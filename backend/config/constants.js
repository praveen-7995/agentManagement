// Application constants
const APP_CONFIG = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production',
  JWT_EXPIRES_IN: '24h',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/agent_management'
};

// File upload constants
const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_EXTENSIONS: ['.csv', '.xlsx', '.xls'],
  ALLOWED_MIME_TYPES: [
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ],
  UPLOAD_DIR: 'uploads/'
};

// CSV/Excel file constants
const FILE_CONFIG = {
  REQUIRED_COLUMNS: ['FirstName', 'Phone', 'Notes'],
  OPTIONAL_COLUMNS: ['Notes']
};

// Validation constants
const VALIDATION_CONFIG = {
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/
};

module.exports = {
  APP_CONFIG,
  UPLOAD_CONFIG,
  FILE_CONFIG,
  VALIDATION_CONFIG
}; 