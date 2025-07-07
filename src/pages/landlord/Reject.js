import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './Reject.css';

const Reject = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [formData, setFormData] = useState({
    reason: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Mock booking data
  const booking = {
    id: bookingId || 1,
    title: "Booking Request from John Smith",
    property: "Cozy Studio in Downtown",
    applicant: {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      avatar: "JS"
    },
    moveInDate: "2024-02-15",
    duration: "12 months",
    rent: "$1,200/month"
  };

  const rejectionReasons = [
    'Applicant does not meet income requirements',
    'Poor credit history',
    'Negative rental history',
    'Incomplete application',
    'Property no longer available',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.reason) {
      alert('Please select a rejection reason');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to bookings page
      navigate('/landlord/bookings');
    } catch (error) {
      console.error('Rejection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reject-container">
      <div className="reject-card">
        <div className="reject-header">
          <div className="reject-icon">
            ❌
          </div>
          <h1 className="reject-title">Reject Booking Request</h1>
          <p className="reject-subtitle">Please provide a reason for rejecting this application</p>
        </div>

        <div className="booking-details">
          <div className="detail-row">
            <span className="detail-label">Property:</span>
            <span className="detail-value">{booking.property}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Move-in Date:</span>
            <span className="detail-value">{booking.moveInDate}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Duration:</span>
            <span className="detail-value">{booking.duration}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Monthly Rent:</span>
            <span className="detail-value">{booking.rent}</span>
          </div>
        </div>

        <div className="applicant-info">
          <div className="applicant-header">
            <div className="applicant-avatar">
              {booking.applicant.avatar}
            </div>
            <div className="applicant-details">
              <h4>{booking.applicant.name}</h4>
              <p>{booking.applicant.email} • {booking.applicant.phone}</p>
            </div>
          </div>
        </div>

        <div className="warning-text">
          <div className="warning-title">⚠️ Important</div>
          <div className="warning-message">
            Rejecting this application will notify the applicant and remove the booking request from your dashboard. 
            This action cannot be undone.
          </div>
        </div>

        <form className="reject-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reason" className="form-label">Rejection Reason *</label>
            <select
              id="reason"
              name="reason"
              className="form-select"
              value={formData.reason}
              onChange={handleChange}
              required
            >
              <option value="">Select a reason</option>
              {rejectionReasons.map(reason => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">Additional Message (Optional)</label>
            <textarea
              id="message"
              name="message"
              className="form-textarea"
              value={formData.message}
              onChange={handleChange}
              placeholder="Provide additional details or feedback for the applicant..."
            />
          </div>

          <div className="reject-actions">
            <Link to="/landlord/bookings" className="cancel-button">
              Cancel
            </Link>
            <button 
              type="submit" 
              className="reject-button"
              disabled={isLoading}
            >
              {isLoading ? 'Rejecting...' : 'Reject Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Reject; 