import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaHeart,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaUsers,
  FaTrash,
  FaHome,
  FaSpinner,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import UserHeader from "../../components/user/UserHeader";
import Pagination from "../../components/ui/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { usersAPI } from "../../services/api";
import {
  PageContainer,
  ContentContainer,
  Card,
  Button,
  Input,
  Title,
  Subtitle,
  Grid,
  ThemedComponentProvider,
} from "../../components/ui/ThemeProvider";

// Favourites-specific styled components using ONLY theme variables
const MainContent = styled(ContentContainer)`
  padding: 2rem;
  max-width: 1200px;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

const HeaderIcon = styled.span`
  color: ${(props) => props.theme.colors.primary};
  font-size: 2rem;
  margin-right: 1rem;
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
`;

const SearchInput = styled(Input)`
  padding-left: 3rem;
  padding-right: ${(props) => (props.hasValue ? "3rem" : "1rem")};
  border-radius: ${(props) => props.theme.borderRadius.lg};

  &::placeholder {
    color: ${(props) => props.theme.colors.textSecondary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.colors.primary};
  pointer-events: none;
  z-index: 1;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${(props) => props.theme.transitions.normal};

  &:hover {
    color: ${(props) => props.theme.colors.primary};
    background: ${(props) => props.theme.colors.primary}15;
  }
`;

const FavouritesGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FavouriteCard = styled(Card)`
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const FavouriteImage = styled.div`
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

const RemoveButton = styled.button`
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
  color: ${(props) => props.theme.colors.error};
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background-color: ${(props) => props.theme.colors.error};
    color: ${(props) => props.theme.colors.surface};
    transform: scale(1.1);
    border-color: ${(props) => props.theme.colors.error};
  }
`;

const FavouriteContent = styled.div`
  padding: 0 0.5rem;
`;

const FavouriteTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

const FavouriteLocation = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const FavouritePrice = styled.div`
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

const FavouriteFeatures = styled.div`
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

const FavouriteAmenities = styled.div`
  display: flex;
  gap: 1rem;
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const AmenityItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ViewButton = styled(Button)`
  flex: 1;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${(props) => props.theme.colors.textSecondary};
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 1.5rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const EmptyDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: ${(props) => props.theme.colors.textSecondary};
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 3px solid ${(props) => props.theme.colors.border};
  border-radius: 50%;
  border-top-color: ${(props) => props.theme.colors.primary};
  animation: spin 1s ease-in-out infinite;
  margin-right: 1rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const StatsSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: ${(props) => props.theme.colors.accent};
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.border};
`;

const StatItem = styled.div`
  text-align: center;

  .number {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${(props) => props.theme.colors.text};
    margin-bottom: 0.25rem;
  }

  .label {
    font-size: 0.875rem;
    color: ${(props) => props.theme.colors.textSecondary};
  }
`;

const UserFavourites = () => {
  const navigate = useNavigate();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    setLoading(true);
    try {
      const response = await usersAPI.getFavorites();
      console.log("Favorites response:", response);
      // Handle both API response formats
      const favoritesData =
        response.favourites || response.favorites || response || [];
      setFavourites(Array.isArray(favoritesData) ? favoritesData : []);
    } catch (error) {
      console.error("Failed to fetch favourites:", error);
      toast.error("Failed to load favourites");
      setFavourites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavourite = async (propertyId) => {
    setRemoving((prev) => new Set(prev).add(propertyId));

    try {
      await usersAPI.removeFromFavorites(propertyId);
      setFavourites((prev) => prev.filter((fav) => fav.id !== propertyId));
      toast.success("Removed from favourites");
    } catch (error) {
      console.error("Failed to remove favourite:", error);
      toast.error("Failed to remove from favourites");
    } finally {
      setRemoving((prev) => {
        const newSet = new Set(prev);
        newSet.delete(propertyId);
        return newSet;
      });
    }
  };

  const handleViewProperty = (propertyId) => {
    navigate(`/user/listing/${propertyId}`);
  };

  // Filter favourites based on search term
  const baseFilteredFavourites = Array.isArray(favourites)
    ? favourites.filter(
        (favourite) =>
          favourite.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          favourite.location?.address
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          favourite.location?.city
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    : [];

  // Pagination configuration
  const ITEMS_PER_PAGE = 9; // 3x3 grid looks good for favorites

  // Pagination hook
  const {
    currentItems: filteredFavourites,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
  } = usePagination(baseFilteredFavourites, ITEMS_PER_PAGE);

  if (loading) {
    return (
      <ThemedComponentProvider>
        <PageContainer>
          <UserHeader />
          <LoadingContainer>
            <LoadingSpinner />
            Loading your favourites...
          </LoadingContainer>
        </PageContainer>
      </ThemedComponentProvider>
    );
  }

  return (
    <ThemedComponentProvider>
      <PageContainer>
        <UserHeader />

        <MainContent>
          <PageHeader>
            <Title size="large" style={{ marginBottom: "0.5rem" }}>
              <HeaderIcon>
                <FaHeart />
              </HeaderIcon>
              My Favourites
            </Title>
            <Subtitle>
              {favourites.length === 0
                ? "Start browsing and save properties you love by clicking the heart icon."
                : searchTerm
                ? `Found ${totalItems} favourite${
                    totalItems !== 1 ? "s" : ""
                  } matching "${searchTerm}"`
                : `You have ${favourites.length} favourite${
                    favourites.length !== 1 ? "s" : ""
                  } saved.`}
            </Subtitle>
          </PageHeader>

          {favourites.length > 0 && (
            <>
              <StatsSection>
                <StatItem>
                  <div className="number">{favourites.length}</div>
                  <div className="label">Total Favourites</div>
                </StatItem>
                {searchTerm && (
                  <StatItem>
                    <div className="number">{totalItems}</div>
                    <div className="label">Matching Search</div>
                  </StatItem>
                )}
                {totalPages > 1 && (
                  <StatItem>
                    <div className="number">
                      {currentPage}/{totalPages}
                    </div>
                    <div className="label">Current Page</div>
                  </StatItem>
                )}
              </StatsSection>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  margin: "2rem 0 2.5rem 0",
                }}
              >
                <SearchContainer style={{ margin: 0 }}>
                  <SearchIcon>
                    <FaSearch />
                  </SearchIcon>
                  <SearchInput
                    type="text"
                    placeholder="Search your favourites..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    hasValue={searchTerm.length > 0}
                  />
                  {searchTerm && (
                    <ClearButton
                      onClick={() => setSearchTerm("")}
                      title="Clear search"
                    >
                      <FaTimes />
                    </ClearButton>
                  )}
                </SearchContainer>
              </div>
            </>
          )}

          {favourites.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <FaHeart />
              </EmptyIcon>
              <EmptyTitle>No Favourites Yet</EmptyTitle>
              <EmptyDescription>
                You haven't saved any properties to your favourites yet. Browse
                our amazing properties and click the heart icon to save them
                here.
              </EmptyDescription>
              <Button
                as={Link}
                to="/user/search"
                variant="primary"
                size="large"
              >
                <FaSearch style={{ marginRight: "0.5rem" }} />
                Start Browsing
              </Button>
            </EmptyState>
          ) : filteredFavourites.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <FaSearch />
              </EmptyIcon>
              <EmptyTitle>No Results Found</EmptyTitle>
              <EmptyDescription>
                No properties match your search term "{searchTerm}". Try a
                different search or clear the search to see all favourites.
              </EmptyDescription>
              <Button variant="secondary" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            </EmptyState>
          ) : (
            <>
              <FavouritesGrid>
                <AnimatePresence>
                  {filteredFavourites.map((favourite) => (
                    <motion.div
                      key={favourite.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FavouriteCard>
                        <FavouriteImage image={favourite.images?.[0]}>
                          {!favourite.images?.[0] && <FaHome />}
                          <RemoveButton
                            onClick={() => handleRemoveFavourite(favourite.id)}
                            disabled={removing.has(favourite.id)}
                            title="Remove from favourites"
                          >
                            {removing.has(favourite.id) ? (
                              <FaSpinner className="fa-spin" />
                            ) : (
                              <FaTrash />
                            )}
                          </RemoveButton>
                        </FavouriteImage>

                        <FavouriteContent>
                          <FavouriteTitle>{favourite.title}</FavouriteTitle>
                          <FavouriteLocation>
                            <FaMapMarkerAlt />
                            {favourite.location?.address ||
                              favourite.location?.city ||
                              "Location not specified"}
                          </FavouriteLocation>
                          <FavouritePrice>
                            ${favourite.price_per_night}
                            <span className="period">/night</span>
                          </FavouritePrice>

                          <FavouriteFeatures>
                            <FeatureTag>{favourite.property_type}</FeatureTag>
                            <FeatureTag>
                              <FaUsers />
                              {favourite.max_guests} guests
                            </FeatureTag>
                            {favourite.bedrooms && (
                              <FeatureTag>
                                <FaBed />
                                {favourite.bedrooms} bed
                                {favourite.bedrooms !== 1 ? "s" : ""}
                              </FeatureTag>
                            )}
                            {favourite.bathrooms && (
                              <FeatureTag>
                                <FaBath />
                                {favourite.bathrooms} bath
                                {favourite.bathrooms !== 1 ? "s" : ""}
                              </FeatureTag>
                            )}
                          </FavouriteFeatures>

                          <FavouriteAmenities>
                            {favourite.amenities?.wifi && (
                              <AmenityItem>WiFi</AmenityItem>
                            )}
                            {favourite.amenities?.parking && (
                              <AmenityItem>Parking</AmenityItem>
                            )}
                            {favourite.amenities?.kitchen && (
                              <AmenityItem>Kitchen</AmenityItem>
                            )}
                          </FavouriteAmenities>

                          <ActionButtons>
                            <ViewButton
                              variant="primary"
                              onClick={() => handleViewProperty(favourite.id)}
                            >
                              View Details
                            </ViewButton>
                          </ActionButtons>
                        </FavouriteContent>
                      </FavouriteCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </FavouritesGrid>

              {/* Pagination Component */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={goToPage}
                  showInfo={true}
                />
              )}
            </>
          )}
        </MainContent>
      </PageContainer>
    </ThemedComponentProvider>
  );
};

export default UserFavourites;
