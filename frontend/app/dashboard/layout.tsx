'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState('agents');
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/dashboard/${tab}`);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '1rem'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '1rem 0',
          borderBottom: '1px solid #34495e',
          marginBottom: '2rem'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Agent Management</h2>
        </div>
        
        <nav>
          <div
            onClick={() => handleTabChange('agents')}
            style={{
              padding: '0.75rem 1rem',
              cursor: 'pointer',
              borderRadius: '4px',
              marginBottom: '0.5rem',
              backgroundColor: activeTab === 'agents' ? '#3498db' : 'transparent',
              transition: 'background-color 0.2s'
            }}
          >
            Agents
          </div>
          
          <div
            onClick={() => handleTabChange('lists')}
            style={{
              padding: '0.75rem 1rem',
              cursor: 'pointer',
              borderRadius: '4px',
              marginBottom: '0.5rem',
              backgroundColor: activeTab === 'lists' ? '#3498db' : 'transparent',
              transition: 'background-color 0.2s'
            }}
          >
            Lists
          </div>
          
          <div
            onClick={() => handleTabChange('upload')}
            style={{
              padding: '0.75rem 1rem',
              cursor: 'pointer',
              borderRadius: '4px',
              marginBottom: '0.5rem',
              backgroundColor: activeTab === 'upload' ? '#3498db' : 'transparent',
              transition: 'background-color 0.2s'
            }}
          >
            Upload CSV
          </div>
        </nav>
      </div>
      
      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: 'white',
          padding: '1rem 2rem',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, color: '#333' }}>
            {activeTab === 'agents' && 'Agent Management'}
            {activeTab === 'lists' && 'Distributed Lists'}
            {activeTab === 'upload' && 'Upload CSV'}
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#666' }}>
              Welcome, {user?.email}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </header>
        
        {/* Content */}
        <main style={{
          flex: 1,
          padding: '2rem',
          backgroundColor: '#f8f9fa'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
} 