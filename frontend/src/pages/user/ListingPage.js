import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import toast from "react-hot-toast";
import {
  FaBed,
  FaShower,
  FaCar,
  FaDog,
  FaDumbbell,
  FaWifi,
  FaTshirt,
  FaSwimmingPool,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaMapMarkerAlt,
  FaHeart,
  FaRegHeart,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaUsers,
  FaRuler,
  FaSnowflake,
  FaFire,
  FaUtensils,
  FaTv,
  FaCouch,
  FaTree,
} from "react-icons/fa";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import UserHeader from "../../components/user/UserHeader";
import { propertiesAPI, usersAPI, bookingsAPI } from "../../services/api";

const ListingPageContainer = styled.div`
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.background};
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${(props) => props.theme.spacing.xl};
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.textSecondary};

  a {
    color: ${(props) => props.theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${(props) => props.theme.spacing.xl};

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const ImageGallery = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const MainImage = styled.div`
  width: 100%;
  height: 400px;
  background-color: ${(props) => props.theme.colors.gray[200]};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.gray[500]};
  font-size: ${(props) => props.theme.typography.fontSizes["4xl"]};
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${(props) => props.theme.spacing.md};
`;

const Thumbnail = styled.div`
  width: 100%;
  height: 80px;
  background-color: ${(props) => props.theme.colors.gray[200]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.gray[500]};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.normal};

  &:hover {
    background-color: ${(props) => props.theme.colors.gray[300]};
  }
`;

const PropertyInfo = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const PropertyTitle = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSizes["3xl"]};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const PropertyLocation = styled.p`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const PropertyPrice = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes["2xl"]};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const AmenityItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
`;

const AmenityIcon = styled.span`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
`;

const AmenityText = styled.span`
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  color: ${(props) => props.theme.colors.text};
`;

const Description = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.xl};

  h3 {
    font-size: ${(props) => props.theme.typography.fontSizes.xl};
    font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
    color: ${(props) => props.theme.colors.text};
    margin-bottom: ${(props) => props.theme.spacing.md};
  }

  p {
    color: ${(props) => props.theme.colors.textSecondary};
    line-height: 1.6;
    margin-bottom: ${(props) => props.theme.spacing.md};
  }
`;

const BookingCard = styled(Card)`
  position: sticky;
  top: 100px;
  height: fit-content;
`;

const BookingForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.lg};
`;

const DateInput = styled.input`
  width: 100%;
  padding: ${(props) => props.theme.spacing.md};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSizes.base};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primaryLight};
  }
`;

const BookingSummary = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing.sm};

  &:last-child {
    margin-bottom: 0;
    border-top: 1px solid ${(props) => props.theme.colors.border};
    padding-top: ${(props) => props.theme.spacing.sm};
    font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  }
`;

const ContactInfo = styled.div`
  margin-top: ${(props) => props.theme.spacing.lg};
  padding-top: ${(props) => props.theme.spacing.lg};
  border-top: 1px solid ${(props) => props.theme.colors.borderLight};
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  margin-bottom: ${(props) => props.theme.spacing.sm};

  &:last-child {
    margin-bottom: 0;
  }
`;

const FavoriteButton = styled(Button)`
  svg {
    color: ${(props) =>
      props.isFavorite
        ? props.theme.colors.primary || "#EEC170"
        : props.theme.colors.textSecondary || "#666666"};
    transition: color 0.2s ease;
  }

  &:hover svg {
    color: ${(props) => props.theme.colors.primary || "#EEC170"};
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  &.available {
    color: ${(props) => props.theme.colors.success || "#22C55E"};
  }

  &.unavailable {
    color: ${(props) => props.theme.colors.error || "#EF4444"};
  }

  &.checking {
    color: ${(props) => props.theme.colors.textSecondary || "#666666"};
  }

  svg {
    color: inherit;
  }
`;

const ListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [moveInDate, setMoveInDate] = useState("");
  const [isDateAvailable, setIsDateAvailable] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [existingBookings, setExistingBookings] = useState([]);

  // Placeholder images for when property has no images
  const placeholderImages = [
    "/images/room1.jpg",
    "/images/room2.jpg",
    "/images/room3.jpg",
  ];

  // Get images to display (either property images or placeholders)
  const getDisplayImages = () => {
    if (listing && listing.images && listing.images.length > 0) {
      return listing.images;
    }
    return placeholderImages;
  };

  // Get the current selected image
  const getCurrentImage = () => {
    const images = getDisplayImages();
    return images[selectedImage] || images[0];
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await propertiesAPI.getById(id);
        console.log("Property data:", data);
        setListing(data);

        // Check if property is in favorites
        try {
          const favoritesResponse = await usersAPI.getFavorites();
          const favorites =
            favoritesResponse.favourites || favoritesResponse || [];
          const isInServerFavorites = favorites.some(
            (fav) => fav.id === id || fav._id === id
          );

          // Also check localStorage as fallback
          const localFavorites = JSON.parse(
            localStorage.getItem("userFavorites") || "[]"
          );
          const isInLocalFavorites = localFavorites.includes(id);

          setIsFavorite(isInServerFavorites || isInLocalFavorites);

          // Sync localStorage with server data
          if (isInServerFavorites && !isInLocalFavorites) {
            localFavorites.push(id);
            localStorage.setItem(
              "userFavorites",
              JSON.stringify(localFavorites)
            );
          }
        } catch (error) {
          console.error("Error checking favorites:", error);
          // Fallback to localStorage only
          const localFavorites = JSON.parse(
            localStorage.getItem("userFavorites") || "[]"
          );
          setIsFavorite(localFavorites.includes(id));
        }

        // Fetch existing bookings for this property
        try {
          const bookings = await bookingsAPI.getLandlordApplications();
          const propertyBookings = bookings.filter(
            (booking) =>
              booking.property_id === id &&
              (booking.status === "approved" || booking.status === "pending")
          );
          setExistingBookings(propertyBookings);
        } catch (error) {
          console.error("Error fetching bookings:", error);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const checkDateAvailability = (selectedDate) => {
    if (!selectedDate || !existingBookings.length) {
      setIsDateAvailable(true);
      return;
    }

    const selected = new Date(selectedDate);
    const isConflict = existingBookings.some((booking) => {
      const checkIn = new Date(booking.check_in_date);
      const checkOut = new Date(booking.check_out_date || booking.created_at);

      // Add default 30-day lease if no check-out date
      if (!booking.check_out_date) {
        checkOut.setDate(checkIn.getDate() + 30);
      }

      // Check if selected date falls within any existing booking period
      return selected >= checkIn && selected <= checkOut;
    });

    setIsDateAvailable(!isConflict);
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setMoveInDate(selectedDate);
    setCheckingAvailability(true);

    // Simulate checking availability (you could make this an API call)
    setTimeout(() => {
      checkDateAvailability(selectedDate);
      setCheckingAvailability(false);
    }, 500);
  };

  const handleBooking = (e) => {
    e.preventDefault();
    if (!moveInDate) {
      toast.error("Please select a move-in date");
      return;
    }
    if (!isDateAvailable) {
      toast.error("Selected date is not available");
      return;
    }
    // Navigate to booking process with property data
    navigate(`/user/booking?listingId=${listing.id}`, {
      state: {
        property: listing,
        moveInDate: moveInDate,
      },
    });
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await usersAPI.removeFromFavorites(id);
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await usersAPI.addToFavorites(id);
        setIsFavorite(true);
        toast.success("Added to favorites");
      }

      // Store in localStorage for immediate persistence across navigation
      const favorites = JSON.parse(
        localStorage.getItem("userFavorites") || "[]"
      );
      if (isFavorite) {
        // Remove from favorites
        const updatedFavorites = favorites.filter((favId) => favId !== id);
        localStorage.setItem("userFavorites", JSON.stringify(updatedFavorites));
      } else {
        // Add to favorites
        if (!favorites.includes(id)) {
          favorites.push(id);
          localStorage.setItem("userFavorites", JSON.stringify(favorites));
        }
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorites");
    }
  };

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower === "wifi") return <FaWifi />;
    if (amenityLower === "parking") return <FaCar />;
    if (amenityLower === "kitchen") return <FaUtensils />;
    if (amenityLower === "ac") return <FaSnowflake />;
    if (amenityLower === "heating") return <FaFire />;
    if (amenityLower === "washer" || amenityLower === "dryer")
      return <FaTshirt />;
    if (amenityLower === "tv") return <FaTv />;
    if (amenityLower === "workspace") return <FaCouch />;
    if (amenityLower === "balcony") return <FaTree />;
    if (amenityLower === "garden") return <FaTree />;
    if (amenityLower === "pool") return <FaSwimmingPool />;
    if (amenityLower === "gym") return <FaDumbbell />;
    if (amenityLower.includes("bed") || amenityLower.includes("furnished"))
      return <FaBed />;
    if (amenityLower.includes("bath") || amenityLower.includes("shower"))
      return <FaShower />;
    if (amenityLower.includes("pet") || amenityLower.includes("dog"))
      return <FaDog />;
    if (amenityLower.includes("living") || amenityLower.includes("lounge"))
      return <FaCouch />;
    return <FaHome />;
  };

  if (loading) {
    return (
      <ListingPageContainer>
        <UserHeader />
        <MainContent>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            Loading property details...
          </div>
        </MainContent>
      </ListingPageContainer>
    );
  }

  if (!listing) {
    return (
      <ListingPageContainer>
        <UserHeader />
        <MainContent>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            Property not found
          </div>
        </MainContent>
      </ListingPageContainer>
    );
  }

  return (
    <ListingPageContainer>
      <UserHeader />

      <MainContent>
        <Breadcrumb>
          <Link to="/user">Home</Link>
          <span>›</span>
          <Link to="/user/search">Search</Link>
          <span>›</span>
          <span>{listing.title || "Property Details"}</span>
        </Breadcrumb>

        <ContentGrid>
          <div>
            <ImageGallery>
              <MainImage>
                <img
                  src={getCurrentImage()}
                  alt={listing?.title || "Property"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </MainImage>
              <ThumbnailGrid>
                {getDisplayImages()
                  .slice(0, 4)
                  .map((image, index) => (
                    <Thumbnail
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      style={{
                        backgroundColor:
                          selectedImage === index
                            ? "rgba(238, 193, 112, 0.2)"
                            : "#f5f5f5",
                      }}
                    >
                      <img
                        src={image}
                        alt={`Property ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </Thumbnail>
                  ))}
              </ThumbnailGrid>
            </ImageGallery>

            <PropertyInfo>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <PropertyTitle>{listing.title || "Property"}</PropertyTitle>
                  <PropertyLocation>
                    <FaMapMarkerAlt style={{ marginRight: "8px" }} />
                    {typeof listing.location === "object"
                      ? `${listing.location.address || ""} ${
                          listing.location.city || ""
                        } ${listing.location.country || ""}`.trim() ||
                        "Location not specified"
                      : listing.location ||
                        listing.address ||
                        "Location not specified"}
                  </PropertyLocation>
                  <PropertyPrice>
                    $
                    {listing.rent ||
                      listing.price ||
                      listing.price_per_night ||
                      0}
                    /month
                  </PropertyPrice>

                  {/* Property Details */}
                  <div
                    style={{
                      marginTop: "16px",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "16px",
                      fontSize: "14px",
                      color: "#666",
                    }}
                  >
                    {listing.room_type && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <FaBed size={14} />
                        <span>{listing.room_type}</span>
                      </div>
                    )}
                    {listing.property_type && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <FaHome size={14} />
                        <span>{listing.property_type}</span>
                      </div>
                    )}
                    {listing.max_occupancy && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <FaUsers size={14} />
                        <span>Up to {listing.max_occupancy} guests</span>
                      </div>
                    )}
                    {listing.area && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <FaRuler size={14} />
                        <span>{listing.area} sq ft</span>
                      </div>
                    )}
                    {listing.available_from && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <FaCalendarAlt size={14} />
                        <span>
                          Available from{" "}
                          {new Date(
                            listing.available_from
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <StatusIndicator
                      className={
                        listing.is_active ? "available" : "unavailable"
                      }
                    >
                      {listing.is_active ? (
                        <>
                          <FaCheckCircle size={14} />
                          <span>Available</span>
                        </>
                      ) : (
                        <>
                          <FaTimesCircle size={14} />
                          <span>Not Available</span>
                        </>
                      )}
                    </StatusIndicator>
                  </div>
                </div>
                <FavoriteButton
                  variant="outline"
                  onClick={toggleFavorite}
                  style={{ padding: "12px" }}
                  isFavorite={isFavorite}
                >
                  {isFavorite ? <FaHeart /> : <FaRegHeart />}
                </FavoriteButton>
              </div>
            </PropertyInfo>

            <AmenitiesGrid>
              {listing.amenities && typeof listing.amenities === "object" ? (
                Object.entries(listing.amenities)
                  .filter(([key, value]) => value === true)
                  .map(([amenity, value], index) => (
                    <AmenityItem key={index}>
                      <AmenityIcon>{getAmenityIcon(amenity)}</AmenityIcon>
                      <AmenityText>
                        {amenity.charAt(0).toUpperCase() +
                          amenity.slice(1).replace("_", " ")}
                      </AmenityText>
                    </AmenityItem>
                  ))
              ) : listing.amenities && Array.isArray(listing.amenities) ? (
                listing.amenities.map((amenity, index) => (
                  <AmenityItem key={index}>
                    <AmenityIcon>{getAmenityIcon(amenity)}</AmenityIcon>
                    <AmenityText>{amenity}</AmenityText>
                  </AmenityItem>
                ))
              ) : (
                <AmenityItem>
                  <AmenityIcon>
                    <FaHome />
                  </AmenityIcon>
                  <AmenityText>Basic amenities included</AmenityText>
                </AmenityItem>
              )}
            </AmenitiesGrid>

            <Description>
              <h3>About this property</h3>
              <p>
                {listing.description ||
                  "No description available for this property."}
              </p>

              {/* Additional Property Details */}
              <div
                style={{
                  marginTop: "16px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "12px",
                }}
              >
                {listing.lease_duration && (
                  <div>
                    <strong>Lease Duration:</strong> {listing.lease_duration}
                  </div>
                )}
                {listing.deposit_amount && (
                  <div>
                    <strong>Security Deposit:</strong> ${listing.deposit_amount}
                  </div>
                )}
                {listing.utilities_included !== undefined && (
                  <div>
                    <strong>Utilities:</strong>{" "}
                    {listing.utilities_included ? "Included" : "Not Included"}
                  </div>
                )}
                {listing.smoking_allowed !== undefined && (
                  <div>
                    <strong>Smoking:</strong>{" "}
                    {listing.smoking_allowed ? "Allowed" : "Not Allowed"}
                  </div>
                )}
                {listing.pets_allowed !== undefined && (
                  <div>
                    <strong>Pets:</strong>{" "}
                    {listing.pets_allowed ? "Allowed" : "Not Allowed"}
                  </div>
                )}
              </div>
            </Description>
          </div>

          <div>
            <BookingCard>
              <h3>Book this property</h3>
              <BookingForm onSubmit={handleBooking}>
                <div>
                  <label>Move-in Date</label>
                  <DateInput
                    type="date"
                    value={moveInDate}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                  {moveInDate && (
                    <div style={{ marginTop: "8px", fontSize: "14px" }}>
                      {checkingAvailability ? (
                        <StatusIndicator className="checking">
                          Checking availability...
                        </StatusIndicator>
                      ) : isDateAvailable ? (
                        <StatusIndicator className="available">
                          <FaCheckCircle size={14} /> Available for this date
                        </StatusIndicator>
                      ) : (
                        <StatusIndicator className="unavailable">
                          <FaTimesCircle size={14} /> Not available for this
                          date
                        </StatusIndicator>
                      )}
                    </div>
                  )}
                </div>

                <BookingSummary>
                  <SummaryRow>
                    <span>Monthly Rent</span>
                    <span>
                      $
                      {listing.rent ||
                        listing.price ||
                        (listing.price_per_night
                          ? listing.price_per_night * 30
                          : 0)}
                    </span>
                  </SummaryRow>
                  {(listing.deposit_amount || listing.security_deposit) && (
                    <SummaryRow>
                      <span>Security Deposit</span>
                      <span>
                        ${listing.deposit_amount || listing.security_deposit}
                      </span>
                    </SummaryRow>
                  )}
                  <SummaryRow>
                    <span>Application Fee</span>
                    <span>$50</span>
                  </SummaryRow>
                  {listing.utilities_included === false && (
                    <SummaryRow>
                      <span>Utilities (est.)</span>
                      <span>$100-150</span>
                    </SummaryRow>
                  )}
                  <SummaryRow>
                    <span>Total Initial Cost</span>
                    <span>
                      $
                      {(listing.rent ||
                        listing.price ||
                        (listing.price_per_night
                          ? listing.price_per_night * 30
                          : 0)) +
                        (listing.deposit_amount ||
                          listing.security_deposit ||
                          0) +
                        50}
                    </span>
                  </SummaryRow>
                </BookingSummary>

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  disabled={
                    !listing.is_active ||
                    !isDateAvailable ||
                    checkingAvailability ||
                    !moveInDate
                  }
                >
                  {!listing.is_active
                    ? "Property Not Available"
                    : !moveInDate
                    ? "Select Date to Apply"
                    : checkingAvailability
                    ? "Checking Availability..."
                    : !isDateAvailable
                    ? "Date Not Available"
                    : "Apply Now"}
                </Button>
              </BookingForm>

              <ContactInfo>
                <h4>Contact Landlord</h4>
                <ContactItem>
                  <FaUser />
                  <span>{listing.landlord_name || "Property Owner"}</span>
                </ContactItem>
                <ContactItem>
                  <FaPhone />
                  <span>
                    {listing.landlord_phone || "Contact via platform"}
                  </span>
                </ContactItem>
                <ContactItem>
                  <FaEnvelope />
                  <span>
                    {listing.landlord_email || "Contact via platform"}
                  </span>
                </ContactItem>
              </ContactInfo>
            </BookingCard>
          </div>
        </ContentGrid>
      </MainContent>
    </ListingPageContainer>
  );
};

export default ListingPage;
