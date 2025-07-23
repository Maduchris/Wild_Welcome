import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AddApartment.css";

const AddApartment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: "",
    rent: "",
    deposit: "",
    availableFrom: "",
    leaseTerm: "12",
    location: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    floor: "",
    buildingType: "apartment",
    amenities: [],
    images: [],
    rules: "",
    utilities: "included",
    parking: "available",
    petPolicy: "allowed",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const amenities = [
    "WiFi",
    "Kitchen",
    "Private Bathroom",
    "Balcony",
    "Parking",
    "Gym",
    "Pool",
    "Laundry",
    "Air Conditioning",
    "Heating",
    "Furnished",
    "Pet Friendly",
    "No Smoking",
    "Security System",
    "Elevator",
    "Doorman",
    "Storage",
    "Garden",
    "Terrace",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // Simulate image upload
    const newImages = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const removeImage = (imageId) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.rent) {
      newErrors.rent = "Rent amount is required";
    }

    if (typeof formData.location !== "string" || !formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    }

    if (!formData.availableFrom) {
      newErrors.availableFrom = "Available date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to properties page
      navigate("/landlord/properties");
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to properties page
      navigate("/landlord/properties");
    } catch (error) {
      console.error("Publish error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-apartment-container">
      <header className="add-apartment-header">
        <div className="header-content">
          <div className="logo">Wild Welcome</div>
          <nav className="landlord-nav">
            <Link to="/landlord/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link to="/landlord/properties" className="nav-link">
              Properties
            </Link>
            <Link to="/landlord/calendar" className="nav-link">
              Calendar
            </Link>
            <Link to="/landlord/bookings" className="nav-link">
              Bookings
            </Link>
            <Link to="/landlord/account" className="nav-link">
              Account
            </Link>
          </nav>
          <div className="user-menu">
            <div className="user-avatar">LS</div>
          </div>
        </div>
      </header>

      <div className="add-apartment-content">
        <div className="page-header">
          <h1 className="page-title">Add New Apartment</h1>
          <p className="page-subtitle">
            Create a new listing for your apartment
          </p>
        </div>

        <form className="add-apartment-form">
          <div className="form-section">
            <h2 className="section-title">Basic Information</h2>

            <div className="form-group full-width">
              <label htmlFor="title" className="form-label required">
                Apartment Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className={`form-input ${errors.title ? "error" : ""}`}
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Modern 2BR Apartment in Downtown"
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="description" className="form-label required">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className={`form-textarea ${errors.description ? "error" : ""}`}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your apartment, its features, and what makes it special..."
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="propertyType" className="form-label">
                  Property Type
                </label>
                <select
                  id="propertyType"
                  name="propertyType"
                  className="form-select"
                  value={formData.propertyType}
                  onChange={handleChange}
                >
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="loft">Loft</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="buildingType" className="form-label">
                  Building Type
                </label>
                <select
                  id="buildingType"
                  name="buildingType"
                  className="form-select"
                  value={formData.buildingType}
                  onChange={handleChange}
                >
                  <option value="apartment">Apartment Building</option>
                  <option value="condo">Condominium</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="house">House</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bedrooms" className="form-label">
                  Bedrooms
                </label>
                <select
                  id="bedrooms"
                  name="bedrooms"
                  className="form-select"
                  value={formData.bedrooms}
                  onChange={handleChange}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5+</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="bathrooms" className="form-label">
                  Bathrooms
                </label>
                <select
                  id="bathrooms"
                  name="bathrooms"
                  className="form-select"
                  value={formData.bathrooms}
                  onChange={handleChange}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4+</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="area" className="form-label">
                  Area (sq ft)
                </label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  className="form-input"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="e.g., 800"
                />
              </div>

              <div className="form-group">
                <label htmlFor="floor" className="form-label">
                  Floor
                </label>
                <input
                  type="number"
                  id="floor"
                  name="floor"
                  className="form-input"
                  value={formData.floor}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Pricing & Availability</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="rent" className="form-label required">
                  Monthly Rent ($)
                </label>
                <input
                  type="number"
                  id="rent"
                  name="rent"
                  className={`form-input ${errors.rent ? "error" : ""}`}
                  value={formData.rent}
                  onChange={handleChange}
                  placeholder="e.g., 1800"
                />
                {errors.rent && (
                  <span className="error-message">{errors.rent}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="deposit" className="form-label">
                  Security Deposit ($)
                </label>
                <input
                  type="number"
                  id="deposit"
                  name="deposit"
                  className="form-input"
                  value={formData.deposit}
                  onChange={handleChange}
                  placeholder="e.g., 1800"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="availableFrom" className="form-label required">
                  Available From
                </label>
                <input
                  type="date"
                  id="availableFrom"
                  name="availableFrom"
                  className={`form-input ${
                    errors.availableFrom ? "error" : ""
                  }`}
                  value={formData.availableFrom}
                  onChange={handleChange}
                />
                {errors.availableFrom && (
                  <span className="error-message">{errors.availableFrom}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="leaseTerm" className="form-label">
                  Lease Term (months)
                </label>
                <select
                  id="leaseTerm"
                  name="leaseTerm"
                  className="form-select"
                  value={formData.leaseTerm}
                  onChange={handleChange}
                >
                  <option value="1">1 month</option>
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Location</h2>

            <div className="form-group full-width">
              <label htmlFor="location" className="form-label required">
                Location/Neighborhood
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className={`form-input ${errors.location ? "error" : ""}`}
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Downtown, University District"
              />
              {errors.location && (
                <span className="error-message">{errors.location}</span>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="address" className="form-label required">
                Street Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                className={`form-input ${errors.address ? "error" : ""}`}
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g., 123 Main Street"
              />
              {errors.address && (
                <span className="error-message">{errors.address}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city" className="form-label required">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className={`form-input ${errors.city ? "error" : ""}`}
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g., New York"
                />
                {errors.city && (
                  <span className="error-message">{errors.city}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="state" className="form-label required">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  className={`form-input ${errors.state ? "error" : ""}`}
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g., NY"
                />
                {errors.state && (
                  <span className="error-message">{errors.state}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="zipCode" className="form-label required">
                ZIP Code
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                className={`form-input ${errors.zipCode ? "error" : ""}`}
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="e.g., 10001"
              />
              {errors.zipCode && (
                <span className="error-message">{errors.zipCode}</span>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Amenities</h2>

            <div className="amenities-grid">
              {amenities.map((amenity) => (
                <div
                  key={amenity}
                  className={`amenity-item ${
                    formData.amenities.includes(amenity) ? "selected" : ""
                  }`}
                  onClick={() => handleAmenityChange(amenity)}
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                  />
                  <span className="amenity-label">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Photos</h2>

            <div className="image-upload">
              <div className="upload-icon">📷</div>
              <div className="upload-text">
                Click to upload photos or drag and drop
              </div>
              <div className="upload-hint">PNG, JPG up to 10MB each</div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
                id="image-upload"
              />
              <label htmlFor="image-upload" style={{ cursor: "pointer" }}>
                Choose Files
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="image-preview">
                {formData.images.map((image) => (
                  <div key={image.id} className="preview-item">
                    <span>📷</span>
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeImage(image.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-section">
            <h2 className="section-title">Additional Information</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="utilities" className="form-label">
                  Utilities
                </label>
                <select
                  id="utilities"
                  name="utilities"
                  className="form-select"
                  value={formData.utilities}
                  onChange={handleChange}
                >
                  <option value="included">Included in rent</option>
                  <option value="separate">Separate billing</option>
                  <option value="partial">Partially included</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="parking" className="form-label">
                  Parking
                </label>
                <select
                  id="parking"
                  name="parking"
                  className="form-select"
                  value={formData.parking}
                  onChange={handleChange}
                >
                  <option value="available">Available</option>
                  <option value="not-available">Not Available</option>
                  <option value="street">Street Parking</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="petPolicy" className="form-label">
                Pet Policy
              </label>
              <select
                id="petPolicy"
                name="petPolicy"
                className="form-select"
                value={formData.petPolicy}
                onChange={handleChange}
              >
                <option value="allowed">Pets Allowed</option>
                <option value="not-allowed">No Pets</option>
                <option value="cats-only">Cats Only</option>
                <option value="dogs-only">Dogs Only</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="rules" className="form-label">
                House Rules
              </label>
              <textarea
                id="rules"
                name="rules"
                className="form-textarea"
                value={formData.rules}
                onChange={handleChange}
                placeholder="Any specific rules or policies for tenants..."
              />
            </div>
          </div>

          <div className="form-actions">
            <Link to="/landlord/properties" className="cancel-button">
              Cancel
            </Link>
            <button
              type="button"
              className="save-button"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Draft"}
            </button>
            <button
              type="button"
              className="publish-button"
              onClick={handlePublish}
              disabled={isLoading}
            >
              {isLoading ? "Publishing..." : "Publish Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddApartment;
