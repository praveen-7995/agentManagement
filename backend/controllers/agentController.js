const Agent = require('../models/Agent');
const { VALIDATION_CONFIG } = require('../config/constants');

// Get all agents
const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find({}, '-password');
    res.json(agents);
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single agent
const getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id, '-password');
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    console.error('Get agent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new agent
const createAgent = async (req, res) => {
  try {
    const { name, email, mobileNumber, password } = req.body;

    // Validate input
    if (!name || !email || !mobileNumber || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email format
    if (!VALIDATION_CONFIG.EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < VALIDATION_CONFIG.PASSWORD_MIN_LENGTH) {
      return res.status(400).json({ 
        message: `Password must be at least ${VALIDATION_CONFIG.PASSWORD_MIN_LENGTH} characters long` 
      });
    }

    // Check if email already exists
    const existingAgent = await Agent.findOne({ email: email.toLowerCase() });
    if (existingAgent) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create new agent
    const agent = new Agent({
      name,
      email: email.toLowerCase(),
      mobileNumber,
      password
    });

    await agent.save();

    // Return agent without password
    const agentResponse = agent.toObject();
    delete agentResponse.password;

    res.status(201).json(agentResponse);
  } catch (error) {
    console.error('Create agent error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update agent
const updateAgent = async (req, res) => {
  try {
    const { name, email, mobileNumber, password } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) {
      if (!VALIDATION_CONFIG.EMAIL_REGEX.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      updateData.email = email.toLowerCase();
    }
    if (mobileNumber) updateData.mobileNumber = mobileNumber;
    if (password) {
      if (password.length < VALIDATION_CONFIG.PASSWORD_MIN_LENGTH) {
        return res.status(400).json({ 
          message: `Password must be at least ${VALIDATION_CONFIG.PASSWORD_MIN_LENGTH} characters long` 
        });
      }
      updateData.password = password;
    }

    // Check if email already exists (if updating email)
    if (email) {
      const existingAgent = await Agent.findOne({ 
        email: email.toLowerCase(), 
        _id: { $ne: req.params.id } 
      });
      if (existingAgent) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.json(agent);
  } catch (error) {
    console.error('Update agent error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete agent
const deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Delete agent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent
}; 