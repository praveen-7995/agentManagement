'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Agent {
  _id: string;
  name: string;
  email: string;
}

interface ListItem {
  _id: string;
  firstName: string;
  phone: string;
  notes: string;
  agentId: Agent;
  batchId: string;
  createdAt: string;
}

interface Batch {
  _id: string;
  totalRecords: number;
  uploadedAt: string;
  agents: Agent[];
}

export default function ListsPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [batchDetails, setBatchDetails] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/lists/batches', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBatches(data);
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBatchDetails = async (batchId: string) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(`http://localhost:5000/api/lists/batch/${batchId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBatchDetails(data);
      }
    } catch (error) {
      console.error('Error fetching batch details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleBatchClick = (batchId: string) => {
    if (selectedBatch === batchId) {
      setSelectedBatch(null);
      setBatchDetails([]);
    } else {
      setSelectedBatch(batchId);
      fetchBatchDetails(batchId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Distributed Lists</h2>
      
      {batches.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#666',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p>No distributed lists found. Upload a CSV file to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '2rem' }}>
          {batches.map((batch) => (
            <div key={batch._id} style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div
                onClick={() => handleBatchClick(batch._id)}
                style={{
                  padding: '1.5rem',
                  cursor: 'pointer',
                  backgroundColor: selectedBatch === batch._id ? '#f8f9fa' : 'white',
                  borderBottom: selectedBatch === batch._id ? '1px solid #dee2e6' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>
                    Batch: {batch._id}
                  </h3>
                  <p style={{ margin: 0, color: '#666' }}>
                    {batch.totalRecords} records • {batch.agents.length} agents • {formatDate(batch.uploadedAt)}
                  </p>
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  color: '#666',
                  transform: selectedBatch === batch._id ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }}>
                  ▶
                </div>
              </div>
              
              {selectedBatch === batch._id && (
                <div style={{ padding: '1.5rem' }}>
                  {loadingDetails ? (
                    <div style={{ textAlign: 'center', padding: '1rem' }}>Loading details...</div>
                  ) : (
                    <div>
                      <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>Distribution Details</h4>
                      
                      {/* Agent Summary */}
                      <div style={{ marginBottom: '2rem' }}>
                        <h5 style={{ marginBottom: '1rem' }}>Agents in this batch:</h5>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                          {batch.agents.map((agent) => {
                            const agentRecords = batchDetails.filter(item => item.agentId._id === agent._id);
                            return (
                              <div key={agent._id} style={{
                                padding: '1rem',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '4px',
                                border: '1px solid #dee2e6'
                              }}>
                                <strong>{agent.name}</strong>
                                <br />
                                <small style={{ color: '#666' }}>{agent.email}</small>
                                <br />
                                <span style={{ color: '#007bff', fontWeight: 'bold' }}>
                                  {agentRecords.length} records
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Detailed Records */}
                      <div>
                        <h5 style={{ marginBottom: '1rem' }}>All Records:</h5>
                        <div style={{
                          maxHeight: '400px',
                          overflowY: 'auto',
                          border: '1px solid #dee2e6',
                          borderRadius: '4px'
                        }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: '#f8f9fa', position: 'sticky', top: 0 }}>
                              <tr>
                                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Name</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Phone</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Notes</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Assigned Agent</th>
                              </tr>
                            </thead>
                            <tbody>
                              {batchDetails.map((item) => (
                                <tr key={item._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                  <td style={{ padding: '0.75rem' }}>{item.firstName}</td>
                                  <td style={{ padding: '0.75rem' }}>{item.phone}</td>
                                  <td style={{ padding: '0.75rem' }}>{item.notes || '-'}</td>
                                  <td style={{ padding: '0.75rem' }}>
                                    <div>
                                      <strong>{item.agentId.name}</strong>
                                      <br />
                                      <small style={{ color: '#666' }}>{item.agentId.email}</small>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 