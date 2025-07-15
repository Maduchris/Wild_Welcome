import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './UserRoomApplications.css';

const UserRoomApplications = () => {
  const [activeTab, setActiveTab] = useState('all');

  const applications = [
    {
      id: 1,
      title: "Cozy Studio in Downtown",
      location: "Downtown, City Center",
      status: "pending",
      appliedDate: "2024-01-15",
      moveInDate: "2024-02-01",
      rent: "$1,200/month",
      landlord: "John Smith"
    },
    {
      id: 2,
      title: "Modern Room with View",
      location: "University District",
      status: "approved",
      appliedDate: "2024-01-10",
      moveInDate: "2024-01-25",
      rent: "$800/month",
      landlord: "Sarah Johnson"
    },
    {
      id: 3,
      title: "Luxury Apartment Suite",
      location: "Riverside Area",
      status: "rejected",
      appliedDate: "2024-01-05",
      moveInDate: "2024-02-15",
      rent: "$1,500/month",
      landlord: "Mike Wilson"
    },
    {
      id: 4,
      title: "Shared Room Near Campus",
      location: "Campus Area",
      status: "withdrawn",
      appliedDate: "2024-01-12",
      moveInDate: "2024-02-01",
      rent: "$600/month",
      landlord: "Lisa Brown"
    }
  ];

  const getStatusDisplay = (status) => {
    const statusMap = {
      pending: { label: 'Pending', class: 'status-pending' },
      approved: { label: 'Approved', class: 'status-approved' },
      rejected: { label: 'Rejected', class: 'status-rejected' },
      withdrawn: { label: 'Withdrawn', class: 'status-withdrawn' }
    };
    return statusMap[status] || { label: 'Unknown', class: 'status-pending' };
  };

  const filteredApplications = activeTab === 'all' 
    ? applications 
    : applications.filter(app => app.status === activeTab);

  const handleWithdraw = (applicationId) => {
    // Handle withdraw logic
    console.log('Withdrawing application:', applicationId);
  };

  const handleDelete = (applicationId) => {
    // Handle delete logic
    console.log('Deleting application:', applicationId);
  };

  return (
    <div className="applications-container">
      <header className="applications-header">
        <div className="header-content">
          <div className="logo">Wild Welcome</div>
          <nav className="user-nav">
            <Link to="/user" className="nav-link">Home</Link>
            <Link to="/user/search" className="nav-link">Search</Link>
            <Link to="/user/favourites" className="nav-link">Favourites</Link>
            <Link to="/user/applications" className="nav-link active">Applications</Link>
            <Link to="/user/account" className="nav-link">Account</Link>
          </nav>
          <div className="user-menu">
            <div className="user-avatar">JD</div>
          </div>
        </div>
      </header>

      <div className="applications-content">
        <h1 className="page-title">My Applications</h1>
        <p className="page-subtitle">Track the status of your room applications</p>

        <div className="applications-tabs">
          <button 
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({applications.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending ({applications.filter(app => app.status === 'pending').length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            Approved ({applications.filter(app => app.status === 'approved').length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'rejected' ? 'active' : ''}`}
            onClick={() => setActiveTab('rejected')}
          >
            Rejected ({applications.filter(app => app.status === 'rejected').length})
          </button>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3 className="empty-title">No applications found</h3>
            <p className="empty-description">
              {activeTab === 'all' 
                ? "You haven't applied for any rooms yet."
                : `You don't have any ${activeTab} applications.`
              }
            </p>
            <Link to="/user/search" className="browse-button">
              Browse Available Rooms
            </Link>
          </div>
        ) : (
          <div className="applications-grid">
            {filteredApplications.map(application => {
              const statusInfo = getStatusDisplay(application.status);
              return (
                <div key={application.id} className="application-card">
                  <div className="application-header">
                    <div>
                      <h3 className="application-title">{application.title}</h3>
                      <p className="application-location">{application.location}</p>
                    </div>
                    <span className={`application-status ${statusInfo.class}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="application-details">
                    <div className="detail-item">
                      <span className="detail-label">Applied Date</span>
                      <span className="detail-value">{application.appliedDate}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Move-in Date</span>
                      <span className="detail-value">{application.moveInDate}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Monthly Rent</span>
                      <span className="detail-value">{application.rent}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Landlord</span>
                      <span className="detail-value">{application.landlord}</span>
                    </div>
                  </div>

                  <div className="application-actions">
                    <Link 
                      to={`/user/listing/${application.id}`} 
                      className="action-button view-button"
                    >
                      View Details
                    </Link>
                    {application.status === 'pending' && (
                      <button 
                        className="action-button withdraw-button"
                        onClick={() => handleWithdraw(application.id)}
                      >
                        Withdraw
                      </button>
                    )}
                    {(application.status === 'rejected' || application.status === 'withdrawn') && (
                      <button 
                        className="action-button delete-button"
                        onClick={() => handleDelete(application.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRoomApplications; 