import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaHeart,
  FaRegHeart,
  FaHome,
  FaSpinner,
  FaFilter,
  FaTimes,
  FaWifi,
  FaUtensils,
  FaBath,
  FaBuilding,
  FaCar,
  FaDumbbell,
  FaSwimmingPool,
  FaTshirt,
  FaSnowflake,
  FaFire,
  FaCouch,
  FaDog,
  FaBan,
  FaShieldAlt,
} from "react-icons/fa";
import UserHeader from "../../components/user/UserHeader";
import SearchForm from "../../components/ui/SearchForm";
import Pagination from "../../components/ui/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { propertiesAPI, usersAPI } from "../../services/api";
import {
  PageContainer,
  ContentContainer,
  Section,
  Card,
  Button,
  Input,
  Grid,
  ThemedComponentProvider,
} from "../../components/ui/ThemeProvider";

// Search-specific styled components using ONLY theme variables
const SearchHeader = styled(Section)`
  padding: 2rem 0;
  background: ${(props) => props.theme.colors.surface};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

const StyledSearchForm = styled(SearchForm)`
  max-width: 1000px;
  margin: 0 auto;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
`;

const FiltersSidebar = styled(Card)`
  height: fit-content;
  position: sticky;
  top: 2rem;
  min-width: 280px;

  @media (max-width: 1024px) {
    order: 2;
    position: static;
    min-width: unset;
  }
`;

const FiltersTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterGroup = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterLabel = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${(props) => props.theme.colors.text};
  font-size: 0.9rem;
`;

const PriceRange = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
`;

const PriceInput = styled(Input)`
  flex: 1;
  text-align: center;
  min-width: 0;
  font-size: 0.875rem;
`;

const PriceSeparator = styled.span`
  color: ${(props) => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text};
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }

  input[type="checkbox"] {
    margin: 0;
    accent-color: ${(props) => props.theme.colors.primary};
  }
`;

const AmenityLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    font-size: 0.875rem;
    color: ${(props) => props.theme.colors.primary};
  }
`;

const ClearFilters = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.primary};
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.colors.brown};
  }
`;

const ListingsSection = styled.div`
  @media (max-width: 1024px) {
    order: 1;
  }
`;

const ListingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const ResultsCount = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin: 0;
`;

const SortSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  font-size: 0.875rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary}33;
  }
`;

const ListingsGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ListingCard = styled(Card)`
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const ListingImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${(props) =>
    props.image
      ? `url(${props.image})`
      : `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)`};
  background-size: cover;
  background-position: center;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.surface};
  font-size: 2rem;
  position: relative;
  overflow: hidden;
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  background-color: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background-color: ${(props) => props.theme.colors.primary};
    transform: scale(1.1);
    border-color: ${(props) => props.theme.colors.primary};
  }

  .heart-icon {
    color: ${(props) =>
      props.isFavorited
        ? props.theme.colors.primary
        : props.theme.colors.textSecondary};
    font-size: 1rem;
    transition: color 0.2s ease;
  }

  &:hover .heart-icon {
    color: ${(props) => props.theme.colors.surface};
  }
`;

const ListingContent = styled.div`
  padding: 0 0.5rem;
`;

const ListingTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

const ListingLocation = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ListingPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 1rem;

  .period {
    font-size: 1rem;
    font-weight: 400;
    color: ${(props) => props.theme.colors.textSecondary};
  }
`;

const ListingFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const FeatureTag = styled.span`
  background: ${(props) => props.theme.colors.accent};
  color: ${(props) => props.theme.colors.surface};
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ListingAmenities = styled.div`
  display: flex;
  gap: 1rem;
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const AmenityItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: ${(props) => props.theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: ${(props) => props.theme.colors.textSecondary};

  h3 {
    color: ${(props) => props.theme.colors.text};
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
  }
`;

const MobileFilterButton = styled(Button)`
  display: none;

  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
`;

const ListingSearch = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Pagination configuration
  const ITEMS_PER_PAGE = 12;

  // Pagination hook for client-side pagination
  const {
    currentItems: paginatedListings,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
  } = usePagination(listings, ITEMS_PER_PAGE);

  // Search filters state
  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    checkIn: searchParams.get("check_in") || "",
    checkOut: searchParams.get("check_out") || "",
    minPrice: searchParams.get("min_price") || "",
    maxPrice: searchParams.get("max_price") || "",
    propertyType: searchParams.get("property_type") || "",
    amenities: {
      wifi: searchParams.has("wifi"),
      kitchen: searchParams.has("kitchen"),
      privateBathroom: searchParams.has("private_bathroom"),
      balcony: searchParams.has("balcony"),
      parking: searchParams.has("parking"),
      gym: searchParams.has("gym"),
      pool: searchParams.has("pool"),
      laundry: searchParams.has("laundry"),
      airConditioning: searchParams.has("air_conditioning"),
      heating: searchParams.has("heating"),
      furnished: searchParams.has("furnished"),
      petFriendly: searchParams.has("pet_friendly"),
      noSmoking: searchParams.has("no_smoking"),
      securitySystem: searchParams.has("security_system"),
    },
  });

  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    fetchListings();
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams);
      const response = await propertiesAPI.search(params);
      setListings(response);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await usersAPI.getFavorites();
      console.log("Favorites response in search:", response);
      // Handle both API response formats
      const favoritesData =
        response.favourites || response.favorites || response || [];
      setFavorites(new Set(favoritesData.map((fav) => fav.id)));
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLocationChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      location: e.target.value,
    }));
  };

  const handleCheckInChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      checkIn: e.target.value,
    }));
  };

  const handleBudgetChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      maxPrice: e.target.value,
    }));
  };

  const handleAmenityChange = (amenity, checked) => {
    setFilters((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: checked,
      },
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const newParams = new URLSearchParams();

    // Add search parameters
    if (filters.location.trim())
      newParams.set("location", filters.location.trim());
    if (filters.checkIn) newParams.set("check_in", filters.checkIn);
    if (filters.checkOut) newParams.set("check_out", filters.checkOut);
    if (filters.minPrice) newParams.set("min_price", filters.minPrice);
    if (filters.maxPrice) newParams.set("max_price", filters.maxPrice);
    if (filters.propertyType)
      newParams.set("property_type", filters.propertyType);

    // Add amenities (convert camelCase to snake_case for URL)
    const amenityMap = {
      wifi: "wifi",
      kitchen: "kitchen",
      privateBathroom: "private_bathroom",
      balcony: "balcony",
      parking: "parking",
      gym: "gym",
      pool: "pool",
      laundry: "laundry",
      airConditioning: "air_conditioning",
      heating: "heating",
      furnished: "furnished",
      petFriendly: "pet_friendly",
      noSmoking: "no_smoking",
      securitySystem: "security_system",
    };

    Object.entries(filters.amenities).forEach(([amenity, checked]) => {
      if (checked) {
        const urlParam = amenityMap[amenity] || amenity;
        newParams.set(urlParam, "true");
      }
    });

    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      checkIn: "",
      checkOut: "",
      minPrice: "",
      maxPrice: "",
      propertyType: "",
      amenities: {
        wifi: false,
        parking: false,
        kitchen: false,
        laundry: false,
        gym: false,
        pool: false,
      },
    });
    setSearchParams(new URLSearchParams());
  };

  const toggleFavorite = async (propertyId) => {
    try {
      if (favorites.has(propertyId)) {
        await usersAPI.removeFromFavorites(propertyId);
        setFavorites((prev) => {
          const newFavorites = new Set(prev);
          newFavorites.delete(propertyId);
          return newFavorites;
        });
        toast.success("Removed from favorites");
      } else {
        await usersAPI.addToFavorites(propertyId);
        setFavorites((prev) => new Set([...prev, propertyId]));
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Failed to update favorites");
    }
  };

  const handleListingClick = (listingId) => {
    navigate(`/user/listing/${listingId}`);
  };

  const sortedListings = [...paginatedListings].sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        return a.price_per_night - b.price_per_night;
      case "price_high":
        return b.price_per_night - a.price_per_night;
      case "newest":
        return new Date(b.created_at) - new Date(a.created_at);
      default:
        return 0;
    }
  });

  return (
    <ThemedComponentProvider>
      <PageContainer>
        <UserHeader />

        {/* Search Header */}
        <SearchHeader>
          <ContentContainer>
            <StyledSearchForm
              location={filters.location}
              checkIn={filters.checkIn}
              budget={filters.maxPrice}
              onLocationChange={handleLocationChange}
              onCheckInChange={handleCheckInChange}
              onBudgetChange={handleBudgetChange}
              onSubmit={handleSearch}
              locationPlaceholder="Where do you want to stay?"
              budgetPlaceholder="Max price"
              showIcon={true}
            />
          </ContentContainer>
        </SearchHeader>

        {/* Main Content */}
        <MainContent>
          {/* Filters Sidebar */}
          <FiltersSidebar>
            <FiltersTitle>
              <FaFilter />
              Filters
            </FiltersTitle>

            {/* Price Range */}
            <FilterGroup>
              <FilterLabel>Price Range (per night)</FilterLabel>
              <PriceRange>
                <PriceInput
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                  min="0"
                />
                <PriceSeparator>—</PriceSeparator>
                <PriceInput
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                  min="0"
                />
              </PriceRange>
            </FilterGroup>

            {/* Property Type */}
            <FilterGroup>
              <FilterLabel>Property Type</FilterLabel>
              <SortSelect
                value={filters.propertyType}
                onChange={(e) =>
                  handleFilterChange("propertyType", e.target.value)
                }
              >
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="room">Room</option>
                <option value="studio">Studio</option>
              </SortSelect>
            </FilterGroup>

            {/* Amenities */}
            <FilterGroup>
              <FilterLabel>Amenities</FilterLabel>
              <CheckboxGroup>
                {Object.entries({
                  wifi: { label: "WiFi", icon: <FaWifi /> },
                  kitchen: { label: "Kitchen", icon: <FaUtensils /> },
                  privateBathroom: {
                    label: "Private Bathroom",
                    icon: <FaBath />,
                  },
                  balcony: { label: "Balcony", icon: <FaBuilding /> },
                  parking: { label: "Parking", icon: <FaCar /> },
                  gym: { label: "Gym", icon: <FaDumbbell /> },
                  pool: { label: "Pool", icon: <FaSwimmingPool /> },
                  laundry: { label: "Laundry", icon: <FaTshirt /> },
                  airConditioning: {
                    label: "Air Conditioning",
                    icon: <FaSnowflake />,
                  },
                  heating: { label: "Heating", icon: <FaFire /> },
                  furnished: { label: "Furnished", icon: <FaCouch /> },
                  petFriendly: { label: "Pet Friendly", icon: <FaDog /> },
                  noSmoking: { label: "No Smoking", icon: <FaBan /> },
                  securitySystem: {
                    label: "Security System",
                    icon: <FaShieldAlt />,
                  },
                }).map(([key, config]) => (
                  <CheckboxItem key={key}>
                    <input
                      type="checkbox"
                      checked={filters.amenities[key]}
                      onChange={(e) =>
                        handleAmenityChange(key, e.target.checked)
                      }
                    />
                    <AmenityLabel>
                      {config.icon}
                      {config.label}
                    </AmenityLabel>
                  </CheckboxItem>
                ))}
              </CheckboxGroup>
            </FilterGroup>

            <ClearFilters onClick={clearFilters}>
              <FaTimes style={{ marginRight: "0.5rem" }} />
              Clear all filters
            </ClearFilters>
          </FiltersSidebar>

          {/* Listings Section */}
          <ListingsSection>
            <MobileFilterButton
              variant="secondary"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <FaFilter />
              Filters
            </MobileFilterButton>

            <ListingsHeader>
              <ResultsCount>
                {totalItems} {totalItems === 1 ? "property" : "properties"}{" "}
                found
                {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              </ResultsCount>
              <SortSelect
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Sort by relevance</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </SortSelect>
            </ListingsHeader>

            {loading ? (
              <LoadingContainer>
                <FaSpinner
                  className="fa-spin"
                  style={{ marginRight: "1rem" }}
                />
                Loading properties...
              </LoadingContainer>
            ) : listings.length > 0 ? (
              <>
                <ListingsGrid>
                  {sortedListings.map((listing) => (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ListingCard
                        onClick={() => handleListingClick(listing.id)}
                      >
                        <ListingImage image={listing.images?.[0]}>
                          {!listing.images?.[0] && <FaHome />}
                          <FavoriteButton
                            isFavorited={favorites.has(listing.id)}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(listing.id);
                            }}
                          >
                            {favorites.has(listing.id) ? (
                              <FaHeart className="heart-icon" />
                            ) : (
                              <FaRegHeart className="heart-icon" />
                            )}
                          </FavoriteButton>
                        </ListingImage>

                        <ListingContent>
                          <ListingTitle>{listing.title}</ListingTitle>
                          <ListingLocation>
                            <FaMapMarkerAlt />
                            {listing.location?.address ||
                              listing.location?.city ||
                              "Location not specified"}
                          </ListingLocation>
                          <ListingPrice>
                            ${listing.price_per_night}
                            <span className="period">/night</span>
                          </ListingPrice>

                          <ListingFeatures>
                            <FeatureTag>{listing.property_type}</FeatureTag>
                            <FeatureTag>
                              <FaUsers />
                              {listing.max_guests} guests
                            </FeatureTag>
                          </ListingFeatures>

                          <ListingAmenities>
                            {listing.amenities?.wifi && (
                              <AmenityItem>WiFi</AmenityItem>
                            )}
                            {listing.amenities?.parking && (
                              <AmenityItem>Parking</AmenityItem>
                            )}
                            {listing.amenities?.kitchen && (
                              <AmenityItem>Kitchen</AmenityItem>
                            )}
                          </ListingAmenities>
                        </ListingContent>
                      </ListingCard>
                    </motion.div>
                  ))}
                </ListingsGrid>

                {/* Pagination Component */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={goToPage}
                  showInfo={true}
                />
              </>
            ) : (
              <EmptyState>
                <h3>No properties found</h3>
                <p>
                  Try adjusting your search criteria or filters to find more
                  results.
                </p>
                <Button variant="primary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </EmptyState>
            )}
          </ListingsSection>
        </MainContent>
      </PageContainer>
    </ThemedComponentProvider>
  );
};

export default ListingSearch;
