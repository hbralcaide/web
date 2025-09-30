import React from 'react';

const VendorConfirmed: React.FC = () => {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      margin: 0,
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <div style={{
          fontSize: '64px',
          color: '#10b981',
          marginBottom: '20px'
        }}>✅</div>
        
        <h1 style={{
          color: '#1f2937',
          marginBottom: '20px'
        }}>Email Confirmed!</h1>
        
        <p style={{
          color: '#6b7280',
          lineHeight: '1.6',
          marginBottom: '20px'
        }}>
          Thank you for confirming your email address. Your vendor application has been received and is currently under review.
        </p>
        
        <p style={{
          color: '#6b7280',
          lineHeight: '1.6',
          marginBottom: '20px'
        }}>
          Our admin team will review your application and you'll receive an email notification once it's approved.
        </p>
        
        <p style={{
          color: '#6b7280',
          lineHeight: '1.6',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          You can now close this page and return to the mobile app.
        </p>
        
        <button 
          onClick={() => window.close()}
          style={{
            display: 'inline-block',
            backgroundColor: '#3b82f6',
            color: 'white',
            textDecoration: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: 'bold',
            marginTop: '20px',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          Close This Page
        </button>
      </div>
    </div>
  );
};

export default VendorConfirmed;
