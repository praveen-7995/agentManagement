'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = [
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      
      if (allowedTypes.includes(selectedFile.type) || 
          selectedFile.name.endsWith('.csv') || 
          selectedFile.name.endsWith('.xlsx') || 
          selectedFile.name.endsWith('.xls')) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a valid CSV, XLSX, or XLS file');
        setFile(null);
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/lists/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`File uploaded successfully! ${data.totalRecords} records distributed among agents.`);
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (error) {
      setError('An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Upload CSV/XLSX File</h2>
      
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '600px'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>File Requirements</h3>
          <ul style={{ color: '#666', lineHeight: '1.6' }}>
            <li>File must be in CSV, XLSX, or XLS format</li>
            <li>Maximum file size: 5MB</li>
            <li>File must contain the following columns:</li>
            <ul style={{ marginLeft: '2rem', marginTop: '0.5rem' }}>
              <li><strong>FirstName</strong> - Text</li>
              <li><strong>Phone</strong> - Number</li>
              <li><strong>Notes</strong> - Text (optional)</li>
            </ul>
          </ul>
        </div>

        <form onSubmit={handleUpload}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold'
            }}>
              Select File:
            </label>
            <input
              id="file-input"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {file && (
            <div style={{
              backgroundColor: '#e8f5e8',
              padding: '1rem',
              borderRadius: '4px',
              marginBottom: '1rem',
              border: '1px solid #c3e6c3'
            }}>
              <strong>Selected file:</strong> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}

          {error && (
            <div style={{
              backgroundColor: '#fee',
              color: '#c33',
              padding: '0.75rem',
              borderRadius: '4px',
              marginBottom: '1rem',
              border: '1px solid #fcc'
            }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{
              backgroundColor: '#e8f5e8',
              color: '#155724',
              padding: '0.75rem',
              borderRadius: '4px',
              marginBottom: '1rem',
              border: '1px solid #c3e6c3'
            }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={!file || uploading}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: !file || uploading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: !file || uploading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            {uploading ? 'Uploading...' : 'Upload and Distribute'}
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>How it works:</h4>
          <ol style={{ color: '#666', lineHeight: '1.6', margin: 0, paddingLeft: '1.5rem' }}>
            <li>Upload your CSV/XLSX file with the required columns</li>
            <li>The system will validate the file format and structure</li>
            <li>Records will be automatically distributed equally among all agents</li>
            <li>If the total number of records is not divisible by the number of agents, remaining records will be distributed sequentially</li>
            <li>You can view the distributed lists in the "Lists" section</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 