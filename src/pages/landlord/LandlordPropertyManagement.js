import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LandlordPropertyManagement.css';

const LandlordPropertyManagement = () => {
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    location: ''
  });

  const properties = [
    {
      id: 1,
      title: "Cozy Studio in Downtown",
      location: "Downtown, City Center",
      status: "available",
      type: "Studio",
      price: "$1,200/month",
      bedrooms: 1,
      bathrooms: 1,
      area: "500 sq ft",
      image: "🏠"
    },
    {
      id: 2,
      title: "Modern 2BR Apartment",
      location: "University District",
      status: "occupied",
      type: "Apartment",
      price: "$1,800/month",
      bedrooms: 2,
      bathrooms: 2,
      area: "800 sq ft",
      image: "🏢"
    },
    {
      id: 3,
      title: "Luxury Penthouse Suite",
      location: "Riverside Area",
      status: "maintenance",
      type: "Penthouse",
      price: "$2,500/month",
      bedrooms: 3,
      bathrooms: 2,
      area: "1200 sq ft",
      image: "🏰"
    },
    {
      id: 4,
      title: "Shared Room Near Campus",
      location: "Campus Area",
      status: "available",
      type: "Shared Room",
      price: "$600/month",
      bedrooms: 1,
      bathrooms: 1,
      area: "300 sq ft",
      image: "🏘️"
    }
  ];

  const stats = [
    {
      title: "Total Properties",
      value: "12",
      change: "+2",
      changeType: "positive",
      icon: "🏠",
      color: "blue"
    },
    {
      title: "Available",
      value: "5",
      change: "+1",
      changeType: "positive",
      icon: "✅",
      color: "green"
    },
    {
      title: "Occupied",
      value: "6",
      change: "0",
      changeType: "neutral",
      icon: "👥",
      color: "orange"
    },
    {
      title: "Maintenance",
      value: "1",
      change: "+1",
      changeType: "negative",
      icon: "🔧",
      color: "red"
    }
  ];

  const getStatusDisplay = (status) => {
    const statusMap = {
      available: { label: 'Available', class: 'status-available' },
      occupied: { label: 'Occupied', class: 'status-occupied' },
      maintenance: { label: 'Maintenance', class: 'status-maintenance' }
    };
    return statusMap[status] || { label: 'Unknown', class: 'status-available' };
  };

  const filteredProperties = properties.filter(property => {
    if (filters.status && property.status !== filters.status) return false;
    if (filters.type && property.type !== filters.type) return false;
    if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    return true;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="property-management-container">
      <header className="property-management-header">
        <div className="header-content">
          <div className="logo">Wild Welcome</div>
          <nav className="landlord-nav">
            <Link to="/landlord/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/landlord/properties" className="nav-link active">Properties</Link>
            <Link to="/landlord/calendar" className="nav-link">Calendar</Link>
            <Link to="/landlord/bookings" className="nav-link">Bookings</Link>
            <Link to="/landlord/account" className="nav-link">Account</Link>
          </nav>
          <div className="user-menu">
            <div className="user-avatar">LS</div>
          </div>
        </div>
      </header>

      <div className="property-management-content">
        <div className="page-header">
          <h1 className="page-title">Property Management</h1>
          <Link to="/landlord/add-room" className="add-property-button">
            + Add Property
          </Link>
        </div>

        <div className="property-stats">
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
                {stat.change} from last month
              </div>
            </div>
          ))}
        </div>

        <div className="property-filters">
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
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Property Type</label>
              <select
                name="type"
                className="filter-select"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="Studio">Studio</option>
                <option value="Apartment">Apartment</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Shared Room">Shared Room</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Location</label>
              <input
                type="text"
                name="location"
                className="filter-input"
                placeholder="Search by location..."
                value={filters.location}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>

        <div className="properties-grid">
          {filteredProperties.map(property => {
            const statusInfo = getStatusDisplay(property.status);
            return (
              <div key={property.id} className="property-card">
                <div className="property-image">
                  {property.image}
                  <span className={`property-status ${statusInfo.class}`}>
                    {statusInfo.label}
                  </span>
                </div>
                <div className="property-content">
                  <div className="property-header">
                    <div>
                      <h3 className="property-title">{property.title}</h3>
                      <p className="property-location">{property.location}</p>
                    </div>
                    <div className="property-price">{property.price}</div>
                  </div>

                  <div className="property-details">
                    <div className="detail-item">
                      <span className="detail-label">Type</span>
                      <span className="detail-value">{property.type}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Bedrooms</span>
                      <span className="detail-value">{property.bedrooms}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Bathrooms</span>
                      <span className="detail-value">{property.bathrooms}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Area</span>
                      <span className="detail-value">{property.area}</span>
                    </div>
                  </div>

                  <div className="property-actions">
                    <Link 
                      to={`/landlord/property/${property.id}`} 
                      className="action-button edit-button"
                    >
                      Edit
                    </Link>
                    <Link 
                      to={`/landlord/property/${property.id}/view`} 
                      className="action-button view-button"
                    >
                      View
                    </Link>
                    <button className="action-button delete-button">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LandlordPropertyManagement; 