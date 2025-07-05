const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const Agent = require('../models/Agent');
const List = require('../models/List');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV, XLSX, and XLS files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload and distribute CSV/XLSX file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let data = [];

    // Parse file based on extension
    if (fileExtension === '.csv') {
      data = await parseCSV(filePath);
    } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
      data = await parseExcel(filePath);
    }

    // Validate data structure
    if (!validateDataStructure(data)) {
      return res.status(400).json({ 
        message: 'Invalid file format. File must contain FirstName, Phone, and Notes columns' 
      });
    }

    // Get all agents
    const agents = await Agent.find({});
    if (agents.length === 0) {
      return res.status(400).json({ message: 'No agents found. Please add agents first.' });
    }

    // Distribute data among agents
    const batchId = `batch_${Date.now()}`;
    const distributedData = distributeDataAmongAgents(data, agents, batchId);

    // Save to database
    await List.insertMany(distributedData);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      message: 'File uploaded and distributed successfully',
      totalRecords: data.length,
      distributedRecords: distributedData.length,
      batchId: batchId
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (error.message.includes('Only CSV, XLSX, and XLS files are allowed')) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Get distributed lists by agent
router.get('/agent/:agentId', async (req, res) => {
  try {
    const lists = await List.find({ agentId: req.params.agentId })
      .populate('agentId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(lists);
  } catch (error) {
    console.error('Get lists error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all distributed lists grouped by batch
router.get('/batches', async (req, res) => {
  try {
    const batches = await List.aggregate([
      {
        $group: {
          _id: '$batchId',
          totalRecords: { $sum: 1 },
          uploadedAt: { $first: '$uploadedAt' },
          agents: { $addToSet: '$agentId' }
        }
      },
      {
        $sort: { uploadedAt: -1 }
      }
    ]);

    // Populate agent details
    const populatedBatches = await List.populate(batches, {
      path: 'agents',
      select: 'name email'
    });

    res.json(populatedBatches);
  } catch (error) {
    console.error('Get batches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get lists by batch ID
router.get('/batch/:batchId', async (req, res) => {
  try {
    const lists = await List.find({ batchId: req.params.batchId })
      .populate('agentId', 'name email')
      .sort({ createdAt: 1 });
    
    res.json(lists);
  } catch (error) {
    console.error('Get batch lists error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper functions
function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

function parseExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(worksheet);
}

function validateDataStructure(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }

  const firstRow = data[0];
  const requiredFields = ['FirstName', 'Phone', 'Notes'];
  
  return requiredFields.every(field => firstRow.hasOwnProperty(field));
}

function distributeDataAmongAgents(data, agents, batchId) {
  const distributedData = [];
  const agentCount = agents.length;
  
  data.forEach((item, index) => {
    const agentIndex = index % agentCount;
    const agent = agents[agentIndex];
    
    distributedData.push({
      firstName: item.FirstName,
      phone: item.Phone.toString(),
      notes: item.Notes || '',
      agentId: agent._id,
      batchId: batchId
    });
  });
  
  return distributedData;
}

module.exports = router; 