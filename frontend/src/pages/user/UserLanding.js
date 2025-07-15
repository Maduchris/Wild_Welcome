import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../../components/ui/ThemeToggle';
import './UserLanding.css';

const featuredRooms = [
  {
    id: 1,
    title: "Cozy Studio in Downtown",
    location: "Downtown, City Center",
    price: "$1,200/month",
    features: ["Private Bathroom", "Kitchen", "WiFi"],
    image: "/images/room1.jpg",
    imageAlt: "Cozy studio room with modern decor"
  },
  {
    id: 2,
    title: "Modern Room with View",
    location: "University District",
    price: "$800/month",
    features: ["Shared Bathroom", "Balcony", "Furnished"],
    image: "/images/room2.jpg",
    imageAlt: "Modern room with large window and city view"
  },
  {
    id: 3,
    title: "Luxury Apartment Suite",
    location: "Riverside Area",
    price: "$1,500/month",
    features: ["Private Bathroom", "Gym Access", "Parking"],
    image: "/images/room3.jpg",
    imageAlt: "Luxury apartment suite with elegant furnishings"
  }
];

const testimonials = [
  {
    name: 'Sarah O.',
    avatar: '/images/avatar1.jpg',
    quote: 'Wild Welcome made finding my dream room so easy and stress-free! Highly recommended.'
  },
  {
    name: 'Michael B.',
    avatar: '/images/avatar2.jpg',
    quote: 'The landlords are trustworthy and the support team is always there to help.'
  },
  {
    name: 'Priya K.',
    avatar: '/images/avatar3.jpg',
    quote: 'I love the modern design and how simple it is to book a place. 10/10!'
  }
];

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

  return (
    <div className="user-landing-container">
      <header className="user-landing-header">
        <div className="header-content">
          <div className="logo">
            <img src="/images/wild-welcome-logo.png" alt="Wild Welcome Logo" className="logo-image" />
          </div>
          <nav className="user-nav">
            <Link to="/user/search" className="nav-link">Search</Link>
            <Link to="/user/favourites" className="nav-link">Favourites</Link>
            <Link to="/user/applications" className="nav-link">Applications</Link>
            <Link to="/user/account" className="nav-link">Account</Link>
          </nav>
          <div className="user-menu">
            <ThemeToggle />
            <div className="user-avatar" tabIndex={0} aria-label="User initials">JD</div>
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
                aria-label="Location"
              />
              <input
                type="date"
                name="moveInDate"
                className="search-input"
                placeholder="Move-in date"
                value={searchData.moveInDate}
                onChange={handleSearchChange}
                aria-label="Move-in date"
              />
              <button type="submit" className="search-button">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="banner-section">
        <img src="/images/banner.jpg" alt="Find your next home with Wild Welcome" className="banner-img" loading="lazy" />
        <div className="banner-content">
          <h2>Welcome to a New Way of Living</h2>
          <p>Browse hundreds of verified rooms and apartments. Enjoy peace of mind, transparency, and a community that cares.</p>
          <Link to="/user/search" className="banner-cta">Start Exploring</Link>
        </div>
      </section>

      <section className="featured-section">
        <h2 className="section-title">Featured Rooms</h2>
        <div className="featured-grid">
          {featuredRooms.map(room => (
            <div key={room.id} className="featured-card">
              <div className="card-image-advanced">
                <img src={room.image} alt={room.imageAlt} loading="lazy" />
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

      <section className="testimonials-section">
        <h2 className="testimonials-title">What Our Users Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <div className="testimonial-card" key={idx}>
              <img src={t.avatar} alt={t.name + ' avatar'} className="testimonial-avatar" loading="lazy" />
              <blockquote className="testimonial-quote">“{t.quote}”</blockquote>
              <div className="testimonial-name">{t.name}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/images/wild-welcome-logo.png" alt="Wild Welcome Logo" className="footer-logo-image" />
          </div>
          <nav className="footer-nav">
            <Link to="/user" className="footer-link">Home</Link>
            <Link to="/user/search" className="footer-link">Search</Link>
            <Link to="/user/favourites" className="footer-link">Favourites</Link>
            <Link to="/user/account" className="footer-link">Account</Link>
          </nav>
          <div className="footer-social">
            <a href="#" className="footer-social-icon" aria-label="Instagram"><span role="img" aria-label="Instagram">📸</span></a>
            <a href="#" className="footer-social-icon" aria-label="Twitter"><span role="img" aria-label="Twitter">🐦</span></a>
            <a href="#" className="footer-social-icon" aria-label="Facebook"><span role="img" aria-label="Facebook">📘</span></a>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Wild Welcome. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default UserLanding; 