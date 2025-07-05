# Agent Management System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for managing agents and distributing lists among them.

## Features

### 🔐 Authentication
- Admin user login with JWT tokens
- Secure password hashing with bcrypt
- Protected routes and API endpoints

### 👥 Agent Management
- Create, read, update, and delete agents
- Agent details: Name, Email, Mobile Number, Password
- Form validation and error handling

### 📊 CSV/XLSX Upload & Distribution
- Upload CSV, XLSX, and XLS files
- Automatic validation of file format and structure
- Equal distribution of records among agents
- Sequential distribution for remaining records
- Batch tracking and management

### 📋 List Management
- View distributed lists by batch
- Filter and search capabilities
- Detailed agent assignment information

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **xlsx** - Excel file parsing
- **csv-parser** - CSV file parsing

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **React Context** - State management
- **CSS-in-JS** - Styling

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AgentManagement
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Environment Configuration

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agent_management
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

### 5. Database Setup
Make sure MongoDB is running on your system, then seed the database with an admin user:
```bash
cd backend
npm run seed
```

This creates an admin user with:
- Email: `admin@example.com`
- Password: `admin123`

### 6. Start the Application

#### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

#### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:3000`

## Usage

### 1. Login
- Navigate to `http://localhost:3001`
- Use the demo credentials:
  - Email: `admin@example.com`
  - Password: `admin123`

### 2. Add Agents
- Click "Add New Agent" in the Agents section
- Fill in the required fields:
  - Name
  - Email
  - Mobile Number
  - Password

### 3. Upload CSV/XLSX Files
- Navigate to the "Upload CSV" section
- Prepare a file with the following columns:
  - `FirstName` (Text)
  - `Phone` (Number)
  - `Notes` (Text, optional)
- Upload the file (max 5MB)
- The system will automatically distribute records among agents

### 4. View Distributed Lists
- Go to the "Lists" section
- Click on any batch to view distribution details
- See which records are assigned to which agents

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user (protected)

### Agents
- `GET /api/agents` - Get all agents (protected)
- `GET /api/agents/:id` - Get single agent (protected)
- `POST /api/agents` - Create new agent (protected)
- `PUT /api/agents/:id` - Update agent (protected)
- `DELETE /api/agents/:id` - Delete agent (protected)

### Lists
- `POST /api/lists/upload` - Upload and distribute CSV/XLSX (protected)
- `GET /api/lists/batches` - Get all batches (protected)
- `GET /api/lists/batch/:batchId` - Get batch details (protected)
- `GET /api/lists/agent/:agentId` - Get agent's lists (protected)

## File Upload Requirements

### Supported Formats
- CSV (.csv)
- Excel (.xlsx, .xls)

### File Structure
The uploaded file must contain these columns:
```csv
FirstName,Phone,Notes
John Doe,1234567890,Some notes
Jane Smith,0987654321,Other notes
```

### Validation Rules
- Maximum file size: 5MB
- Required columns: FirstName, Phone
- Optional columns: Notes
- Phone numbers are converted to strings for storage

## Distribution Logic

The system distributes records among agents using the following algorithm:

1. **Equal Distribution**: Records are distributed equally among all agents
2. **Sequential Distribution**: If the total number of records is not divisible by the number of agents, remaining records are distributed sequentially

**Example**: 25 records among 5 agents
- Agent 1: 5 records
- Agent 2: 5 records
- Agent 3: 5 records
- Agent 4: 5 records
- Agent 5: 5 records

**Example**: 23 records among 5 agents
- Agent 1: 5 records
- Agent 2: 5 records
- Agent 3: 5 records
- Agent 4: 4 records
- Agent 5: 4 records

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API endpoints
- File upload validation
- Input sanitization
- Error handling

## Error Handling

The application includes comprehensive error handling for:
- Invalid file formats
- Missing required fields
- Database connection issues
- Authentication failures
- File upload errors
- Validation errors

## Development

### Backend Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with admin user

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## Deployment

### Backend Deployment
1. Set environment variables for production
2. Use a process manager like PM2
3. Set up MongoDB Atlas or production MongoDB instance
4. Configure CORS for your frontend domain

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or any static hosting service
3. Update API endpoints to point to your production backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository. 