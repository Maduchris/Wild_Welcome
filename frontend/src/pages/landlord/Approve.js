import React from 'react';

const Approve = () => {
  // Mock booking data
  const booking = {
    id: 1,
    title: "Booking Request from John Smith",
    property: "Cozy Studio in Kigali City Center",
    applicant: {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+250 788 123 456",
      avatar: "JS"
    },
    moveInDate: "2024-02-15",
    duration: "12 months",
    rent: "$120/month"
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9F7F3' }}>
      <div style={{ background: '#fff', padding: '2rem 3rem', borderRadius: '1rem', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
        <h1 style={{ color: '#295135', marginBottom: '1rem' }}>Approve Booking</h1>
        <p style={{ color: '#86571F' }}>This is a placeholder for the Approve screen. Implement your approval logic here.</p>
      </div>
    </div>
  );
};

export default Approve; 