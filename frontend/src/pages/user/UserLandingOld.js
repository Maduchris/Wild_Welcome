import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import UserHeader from "../../components/user/UserHeader";
import {
  authAPI,
  propertiesAPI,
  reviewsAPI,
  isAuthenticated,
} from "../../services/api";
import { useTheme } from "../../contexts/ThemeContext";
import "./UserLanding.css";

const UserLanding = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [userData, setUserData] = useState(null);
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState({
    available_properties: 0,
    total_users: 0,
    happy_tenants: 0,
    trusted_landlords: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState({
    location: "",
    moveInDate: "",
    budget: "",
  });

  // Set CSS custom properties based on theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme) {
      // Base colors
      root.style.setProperty("--gold", theme.colors.gold);
      root.style.setProperty("--dark-green", theme.colors.darkGreen);
      root.style.setProperty("--light-olive", theme.colors.olive);
      root.style.setProperty("--brown", theme.colors.brown);
      root.style.setProperty("--off-white", theme.colors.offWhite);
      root.style.setProperty("--black", theme.colors.black);
      root.style.setProperty("--white", theme.colors.white);

      // Semantic theme variables
      root.style.setProperty("--background", theme.colors.background);
      root.style.setProperty("--surface", theme.colors.surface);
      root.style.setProperty("--text", theme.colors.text);
      root.style.setProperty("--text-secondary", theme.colors.textSecondary);
      root.style.setProperty("--border", theme.colors.border);
      root.style.setProperty("--primary", theme.colors.primary);
      root.style.setProperty(
        "--accent",
        theme.colors.accent || theme.colors.darkGreen
      );
      root.style.setProperty(
        "--muted",
        theme.colors.muted || theme.colors.olive
      );

      // Dynamic gradients
      root.style.setProperty(
        "--hero-gradient",
        `linear-gradient(135deg, ${theme.colors.primary} 0%, ${
          theme.colors.accent || theme.colors.darkGreen
        } 100%)`
      );
      root.style.setProperty(
        "--footer-gradient",
        `linear-gradient(135deg, ${
          theme.colors.accent || theme.colors.darkGreen
        } 0%, ${theme.colors.primary} 100%)`
      );
      root.style.setProperty(
        "--button-gradient",
        `linear-gradient(90deg, ${theme.colors.primary} 0%, ${theme.colors.textSecondary} 100%)`
      );
      root.style.setProperty(
        "--button-gradient-hover",
        `linear-gradient(90deg, ${theme.colors.textSecondary} 0%, ${theme.colors.primary} 100%)`
      );
    }
  }, [theme]);

  // Fetch user data and featured properties on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Fetch user data if authenticated
      if (isAuthenticated()) {
        try {
          const userResponse = await authAPI.getCurrentUser();
          console.log("User data fetched:", userResponse); // Debug log
          setUserData(userResponse);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }

      // Fetch featured properties
      try {
        const propertiesResponse = await propertiesAPI.getAll({ limit: 3 });
        setFeaturedRooms(propertiesResponse);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        toast.error("Failed to load featured properties");
      }

      // Fetch platform stats
      try {
        const statsResponse = await authAPI.getStats();
        setStats(statsResponse);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }

      // Fetch featured reviews/testimonials
      try {
        const reviewsResponse = await reviewsAPI.getFeatured();
        setTestimonials(reviewsResponse);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    // Build search parameters
    const searchParams = new URLSearchParams();

    if (searchData.location.trim()) {
      searchParams.append("location", searchData.location.trim());
    }

    if (searchData.moveInDate) {
      searchParams.append("check_in", searchData.moveInDate);
    }

    if (searchData.budget) {
      // Convert budget to max_price filter
      const budgetValue = parseFloat(searchData.budget);
      if (!isNaN(budgetValue)) {
        searchParams.append("max_price", budgetValue.toString());
      }
    }

    // Navigate to search page with parameters
    const searchUrl = `/user/search${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    navigate(searchUrl);
  };

  return (
    <div
      className="user-landing-container"
      style={{
        backgroundColor: theme?.colors?.background || "#F9F7F3",
        color: theme?.colors?.text || "#295135",
        minHeight: "100vh",
      }}
    >
      <UserHeader />

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Perfect Home</h1>
          <p className="hero-subtitle">
            Discover amazing rooms and apartments from trusted landlords. Book
            with confidence and enjoy your stay with Wild Welcome.
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
              <input
                type="number"
                name="budget"
                className="search-input"
                placeholder="Max budget per night"
                value={searchData.budget}
                onChange={handleSearchChange}
                min="0"
                step="10"
                aria-label="Maximum budget per night"
              />
              <button type="submit" className="search-button">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="banner-section">
        <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80"
          alt="Modern apartment living space"
          className="banner-img"
          loading="lazy"
        />
        <div className="banner-content">
          <h2>Welcome to a New Way of Living</h2>
          <p>
            Browse hundreds of verified rooms and apartments. Enjoy peace of
            mind, transparency, and a community that cares.
          </p>
          <Link to="/user/search" className="banner-cta">
            Start Exploring
          </Link>
        </div>
      </section>

      <section className="featured-section">
        <h2 className="section-title">Featured Properties</h2>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Loading featured properties...</p>
          </div>
        ) : featuredRooms.length > 0 ? (
          <>
            <div className="featured-grid">
              {featuredRooms.map((property) => (
                <div key={property.id} className="featured-card">
                  <div className="card-image-advanced">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          color: theme?.colors?.surface || "#F9F7F3",
                        }}
                      >
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{property.title}</h3>
                    <p className="card-location">
                      {property.location?.address ||
                        property.location?.city ||
                        "Location not specified"}
                    </p>
                    <div className="card-price">
                      ${property.price_per_night}/night
                    </div>
                    <div className="card-features">
                      <span className="feature-tag">
                        {property.property_type}
                      </span>
                      <span className="feature-tag">
                        Max {property.max_guests} guests
                      </span>
                      {property.amenities?.wifi && (
                        <span className="feature-tag">WiFi</span>
                      )}
                      {property.amenities?.parking && (
                        <span className="feature-tag">Parking</span>
                      )}
                    </div>
                    <Link
                      to={`/user/listing/${property.id}`}
                      className="view-more-button"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/user/search" className="view-more-button">
              View All Properties
            </Link>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>No properties available at the moment.</p>
            <Link to="/user/search" className="view-more-button">
              Browse All Properties
            </Link>
          </div>
        )}
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">{stats.available_properties}</div>
            <div className="stat-label">Available Properties</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.happy_tenants}</div>
            <div className="stat-label">Happy Tenants</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.trusted_landlords}</div>
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
        {testimonials.length > 0 ? (
          <div className="testimonials-grid">
            {testimonials.map((review) => (
              <div className="testimonial-card" key={review.id}>
                <div
                  className="testimonial-avatar"
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    backgroundColor: "var(--gold)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--dark-green)",
                    fontWeight: "600",
                    fontSize: "1.5rem",
                    marginBottom: "1.25rem",
                    border: "3px solid var(--gold)",
                  }}
                >
                  {review.user_name
                    ? review.user_name.charAt(0).toUpperCase()
                    : "U"}
                </div>
                <blockquote className="testimonial-quote">
                  "{review.comment}"
                </blockquote>
                <div className="testimonial-name">{review.user_name}</div>
                <div
                  className="testimonial-rating"
                  style={{
                    color: "var(--gold)",
                    marginTop: "0.5rem",
                    fontSize: "1.2rem",
                  }}
                >
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>
              No reviews available yet. Be the first to share your experience!
            </p>
          </div>
        )}
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">Wild Welcome</div>
          <nav className="footer-nav">
            <Link to="/user" className="footer-link">
              Home
            </Link>
            <Link to="/user/search" className="footer-link">
              Search
            </Link>
            <Link to="/user/favourites" className="footer-link">
              Favourites
            </Link>
            <Link to="/user/account" className="footer-link">
              Account
            </Link>
          </nav>
          <div className="footer-social">
            <a
              href="https://instagram.com/wildwelcome"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com/wildwelcome"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://facebook.com/wildwelcome"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
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
