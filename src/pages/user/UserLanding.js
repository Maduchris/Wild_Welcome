import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './UserLanding.css';

const UserLanding = () => {
  const [searchData, setSearchData] = useState({
    location: '',
    moveInDate: '',
    budget: ''
  });

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic
    console.log('Search data:', searchData);
  };

  const featuredRooms = [
    {
      id: 1,
      title: "Cozy Studio in Downtown",
      location: "Downtown, City Center",
      price: "$1,200/month",
      features: ["Private Bathroom", "Kitchen", "WiFi"],
      image: "🏠"
    },
    {
      id: 2,
      title: "Modern Room with View",
      location: "University District",
      price: "$800/month",
      features: ["Shared Bathroom", "Balcony", "Furnished"],
      image: "🏢"
    },
    {
      id: 3,
      title: "Luxury Apartment Suite",
      location: "Riverside Area",
      price: "$1,500/month",
      features: ["Private Bathroom", "Gym Access", "Parking"],
      image: "🏰"
    }
  ];

  return (
    <div className="user-landing-container">
      <header className="user-landing-header">
        <div className="header-content">
          <div className="logo">Wild Welcome</div>
          <nav className="user-nav">
            <Link to="/user/search" className="nav-link">Search</Link>
            <Link to="/user/favourites" className="nav-link">Favourites</Link>
            <Link to="/user/applications" className="nav-link">Applications</Link>
            <Link to="/user/account" className="nav-link">Account</Link>
          </nav>
          <div className="user-menu">
            <div className="user-avatar">JD</div>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Perfect Home</h1>
          <p className="hero-subtitle">
            Discover amazing rooms and apartments from trusted landlords. 
            Book with confidence and enjoy your stay with Wild Welcome.
          </p>
          
          <div className="search-section">
            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                name="location"
                className="search-input"
                placeholder="Where do you want to live?"
                value={searchData.location}
                onChange={handleSearchChange}
              />
              <input
                type="date"
                name="moveInDate"
                className="search-input"
                placeholder="Move-in date"
                value={searchData.moveInDate}
                onChange={handleSearchChange}
              />
              <button type="submit" className="search-button">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <h2 className="section-title">Featured Rooms</h2>
        <div className="featured-grid">
          {featuredRooms.map(room => (
            <div key={room.id} className="featured-card">
              <div className="card-image">
                {room.image}
              </div>
              <div className="card-content">
                <h3 className="card-title">{room.title}</h3>
                <p className="card-location">{room.location}</p>
                <div className="card-price">{room.price}</div>
                <div className="card-features">
                  {room.features.map((feature, index) => (
                    <span key={index} className="feature-tag">{feature}</span>
                  ))}
                </div>
                <Link to={`/user/listing/${room.id}`} className="view-more-button">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
        <Link to="/user/search" className="view-more-button">
          View All Rooms
        </Link>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Available Rooms</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">200+</div>
            <div className="stat-label">Happy Tenants</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Trusted Landlords</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support Available</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserLanding; 