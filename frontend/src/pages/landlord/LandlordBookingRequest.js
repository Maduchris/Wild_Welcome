import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LandlordBookingRequest.css';

const LandlordBookingRequest = () => {
  const [filters, setFilters] = useState({
    status: '',
    property: '',
    dateRange: ''
  });

  const bookingRequests = [
    {
      id: 1,
      title: "Booking Request from John Smith",
      property: "Cozy Studio in Downtown",
      status: "pending",
      applicant: {
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1 (555) 123-4567",
        avatar: "JS",
        rating: 4.8,
        applications: 3,
        verified: true
      },
      moveInDate: "2024-02-15",
      duration: "12 months",
      rent: "$1,200/month",
      message: "I'm a graduate student looking for a quiet place to study. I have excellent references and can provide proof of income."
    },
    {
      id: 2,
      title: "Booking Request from Sarah Johnson",
      property: "Modern 2BR Apartment",
      status: "approved",
      applicant: {
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "+1 (555) 987-6543",
        avatar: "SJ",
        rating: 4.9,
        applications: 1,
        verified: true
      },
      moveInDate: "2024-02-01",
      duration: "6 months",
      rent: "$1,800/month",
      message: "I'm a young professional working downtown. I'm quiet, clean, and always pay rent on time."
    },
    {
      id: 3,
      title: "Booking Request from Mike Wilson",
      property: "Luxury Penthouse Suite",
      status: "rejected",
      applicant: {
        name: "Mike Wilson",
        email: "mike.w@email.com",
        phone: "+1 (555) 456-7890",
        avatar: "MW",
        rating: 3.2,
        applications: 5,
        verified: false
      },
      moveInDate: "2024-03-01",
      duration: "24 months",
      rent: "$2,500/month",
      message: "Looking for a long-term rental. I have a small dog and work from home."
    }
  ];

  const stats = [
    {
      title: "Total Requests",
      value: "15",
      change: "+3",
      changeType: "positive",
      icon: "📋",
      color: "blue"
    },
    {
      title: "Pending",
      value: "8",
      change: "+2",
      changeType: "positive",
      icon: "⏳",
      color: "orange"
    },
    {
      title: "Approved",
      value: "5",
      change: "+1",
      changeType: "positive",
      icon: "✅",
      color: "green"
    },
    {
      title: "Rejected",
      value: "2",
      change: "0",
      changeType: "neutral",
      icon: "❌",
      color: "red"
    }
  ];

  const getStatusDisplay = (status) => {
    const statusMap = {
      pending: { label: 'Pending Review', class: 'status-pending' },
      approved: { label: 'Approved', class: 'status-approved' },
      rejected: { label: 'Rejected', class: 'status-rejected' }
    };
    return statusMap[status] || { label: 'Unknown', class: 'status-pending' };
  };

  const filteredRequests = bookingRequests.filter(request => {
    if (filters.status && request.status !== filters.status) return false;
    if (filters.property && !request.property.toLowerCase().includes(filters.property.toLowerCase())) return false;
    return true;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApprove = (requestId) => {
    console.log('Approving request:', requestId);
    // Handle approval logic
  };

  const handleReject = (requestId) => {
    console.log('Rejecting request:', requestId);
    // Handle rejection logic
  };

  return (
    <div className="booking-request-container">
      <header className="booking-request-header">
        <div className="header-content">
          <div className="logo">Wild Welcome</div>
          <nav className="landlord-nav">
            <Link to="/landlord/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/landlord/properties" className="nav-link">Properties</Link>
            <Link to="/landlord/calendar" className="nav-link">Calendar</Link>
            <Link to="/landlord/bookings" className="nav-link active">Bookings</Link>
            <Link to="/landlord/account" className="nav-link">Account</Link>
          </nav>
          <div className="user-menu">
            <div className="user-avatar">LS</div>
          </div>
        </div>
      </header>

      <div className="booking-request-content">
        <div className="page-header">
          <h1 className="page-title">Booking Requests</h1>
        </div>

        <div className="booking-stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-header">
                <span className="stat-title">{stat.title}</span>
                <div className={`stat-icon ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className={`stat-change ${stat.changeType}`}>
                {stat.changeType === 'positive' && '+'}
                {stat.change} from last week
              </div>
            </div>
          ))}
        </div>

        <div className="booking-filters">
          <h3 className="filters-title">Filters</h3>
          <div className="filters-row">
            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select
                name="status"
                className="filter-select"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Property</label>
              <select
                name="property"
                className="filter-select"
                value={filters.property}
                onChange={handleFilterChange}
              >
                <option value="">All Properties</option>
                <option value="Cozy Studio">Cozy Studio</option>
                <option value="Modern 2BR">Modern 2BR</option>
                <option value="Luxury Penthouse">Luxury Penthouse</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Date Range</label>
              <select
                name="dateRange"
                className="filter-select"
                value={filters.dateRange}
                onChange={handleFilterChange}
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        <div className="booking-requests-grid">
          {filteredRequests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3 className="empty-title">No booking requests found</h3>
              <p className="empty-description">
                {filters.status || filters.property 
                  ? "No requests match your current filters."
                  : "You don't have any booking requests yet."
                }
              </p>
            </div>
          ) : (
            filteredRequests.map(request => {
              const statusInfo = getStatusDisplay(request.status);
              return (
                <div key={request.id} className="booking-request-card">
                  <div className="request-header">
                    <div>
                      <h3 className="request-title">{request.title}</h3>
                      <p className="request-property">{request.property}</p>
                    </div>
                    <span className={`request-status ${statusInfo.class}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="request-details">
                    <div className="detail-item">
                      <span className="detail-label">Move-in Date</span>
                      <span className="detail-value">{request.moveInDate}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Duration</span>
                      <span className="detail-value">{request.duration}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Monthly Rent</span>
                      <span className="detail-value">{request.rent}</span>
                    </div>
                  </div>

                  <div className="applicant-info">
                    <div className="applicant-header">
                      <div className="applicant-avatar">
                        {request.applicant.avatar}
                      </div>
                      <div className="applicant-details">
                        <h4>{request.applicant.name}</h4>
                        <p>{request.applicant.email} • {request.applicant.phone}</p>
                      </div>
                    </div>
                    <div className="applicant-stats">
                      <div className="applicant-stat">
                        <div className="applicant-stat-value">{request.applicant.rating}</div>
                        <div className="applicant-stat-label">Rating</div>
                      </div>
                      <div className="applicant-stat">
                        <div className="applicant-stat-value">{request.applicant.applications}</div>
                        <div className="applicant-stat-label">Applications</div>
                      </div>
                      <div className="applicant-stat">
                        <div className="applicant-stat-value">
                          {request.applicant.verified ? "✓" : "✗"}
                        </div>
                        <div className="applicant-stat-label">Verified</div>
                      </div>
                    </div>
                  </div>

                  <div className="request-actions">
                    <Link 
                      to={`/landlord/booking/${request.id}`} 
                      className="action-button view-button"
                    >
                      View Details
                    </Link>
                    <button className="action-button message-button">
                      Message
                    </button>
                    {request.status === 'pending' && (
                      <>
                        <button 
                          className="action-button approve-button"
                          onClick={() => handleApprove(request.id)}
                        >
                          Approve
                        </button>
                        <button 
                          className="action-button reject-button"
                          onClick={() => handleReject(request.id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default LandlordBookingRequest; 