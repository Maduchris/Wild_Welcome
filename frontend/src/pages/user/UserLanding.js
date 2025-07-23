import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import styled from "styled-components";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import UserHeader from "../../components/user/UserHeader";
import SearchForm from "../../components/ui/SearchForm";
import {
  authAPI,
  propertiesAPI,
  reviewsAPI,
  isAuthenticated,
} from "../../services/api";
import {
  PageContainer,
  ContentContainer,
  HeroSection,
  Section,
  Card,
  Button,
  Title,
  Subtitle,
  Grid,
  SearchSection,
  StatsGrid,
  StatCard,
  StatNumber,
  StatLabel,
  // ImageContainer,
  ThemedComponentProvider,
} from "../../components/ui/ThemeProvider";
import ListingCard from "../../components/ui/ListingCard";

// Additional styled components for specific sections
const BannerSection = styled(Section)`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary} 0%,
    ${(props) => props.theme.colors.secondary} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  border-radius: 1.25rem;
  margin: 3rem auto 2.5rem auto;
  max-width: 1200px;
  min-height: 260px;
  overflow: hidden;
  position: relative;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 0;
    padding: 0;
  }
`;

const BannerImage = styled.img`
  width: 340px;
  height: 260px;
  object-fit: cover;
  border-radius: 1.25rem 0 0 1.25rem;
  background: ${(props) => props.theme.colors.surface};
  flex-shrink: 0;

  @media (max-width: 900px) {
    width: 100%;
    height: 180px;
    border-radius: 1.25rem 1.25rem 0 0;
  }
`;

const BannerContent = styled.div`
  flex: 1;
  padding: 2rem 2.5rem;
  color: ${(props) => props.theme.colors.surface};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: ${(props) => props.theme.colors.primary};
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 1.15rem;
    margin-bottom: 1.5rem;
    opacity: 0.95;
  }

  @media (max-width: 900px) {
    padding: 1.5rem 1.25rem;
    align-items: center;
    text-align: center;
  }
`;

// const PropertyCardContent = styled.div`
//   padding: 1.5rem;
// `;

// const PropertyTitle = styled.h3`
//   font-size: 1.25rem;
//   font-weight: 600;
//   color: ${(props) => props.theme.colors.text};
//   margin-bottom: 0.5rem;
// `;

// const PropertyLocation = styled.p`
//   color: ${(props) => props.theme.colors.textSecondary};
//   font-size: 0.875rem;
//   margin-bottom: 1rem;
// `;

// const PropertyPrice = styled.div`
//   font-size: 1.5rem;
//   font-weight: 700;
//   color: ${(props) => props.theme.colors.primary};
//   margin-bottom: 1rem;
// `;

// const PropertyFeatures = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 0.5rem;
//   margin-bottom: 1rem;
// `;

const TestimonialCard = styled(Card)`
  text-align: center;
  background: ${(props) => props.theme.colors.accent};

  &:hover {
    transform: translateY(-4px) scale(1.02);
  }
`;

const TestimonialAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.secondary};
  font-weight: 600;
  font-size: 1.5rem;
  margin: 0 auto 1.25rem auto;
  border: 3px solid ${(props) => props.theme.colors.primary};
`;

const TestimonialQuote = styled.blockquote`
  font-size: 1.1rem;
  color: ${(props) => props.theme.colors.text};
  font-style: italic;
  margin-bottom: 1.25rem;
  line-height: 1.5;
`;

const TestimonialName = styled.div`
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
`;

const TestimonialRating = styled.div`
  color: ${(props) => props.theme.colors.primary};
  margin-top: 0.5rem;
  font-size: 1.2rem;
`;

const Footer = styled.footer`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.secondary} 0%,
    ${(props) => props.theme.colors.primary} 100%
  );
  color: ${(props) => props.theme.colors.surface};
  padding: 2.5rem 1rem 1rem 1rem;
  margin-top: 4rem;
  border-radius: 1.5rem 1.5rem 0 0;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
`;

const FooterLogo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
  letter-spacing: 1px;
`;

const FooterNav = styled.nav`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;

  a {
    color: ${(props) => props.theme.colors.surface};
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;

    &:hover {
      color: ${(props) => props.theme.colors.primary};
      text-decoration: underline;
    }
  }
`;

const FooterSocial = styled.div`
  display: flex;
  gap: 1.25rem;

  a {
    font-size: 1.5rem;
    color: ${(props) => props.theme.colors.surface};
    transition: all 0.2s;
    text-decoration: none;

    &:hover {
      color: ${(props) => props.theme.colors.primary};
      transform: scale(1.15);
    }
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  color: ${(props) => props.theme.colors.surface};
  font-size: 0.95rem;
  margin-top: 2rem;
  opacity: 0.85;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${(props) => props.theme.colors.textSecondary};
`;

// Styled wrapper for the search form with padding
const StyledSearchForm = styled(SearchForm)`
  padding: 0.5rem;
`;

const UserLanding = () => {
  const navigate = useNavigate();
  const [, setUserData] = useState(null);
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

  // Fetch user data and featured properties on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Fetch user data if authenticated
      if (isAuthenticated()) {
        try {
          const userResponse = await authAPI.getCurrentUser();
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

  const handleLocationChange = (e) => {
    setSearchData((prev) => ({
      ...prev,
      location: e.target.value,
    }));
  };

  const handleCheckInChange = (e) => {
    setSearchData((prev) => ({
      ...prev,
      moveInDate: e.target.value,
    }));
  };

  const handleBudgetChange = (e) => {
    setSearchData((prev) => ({
      ...prev,
      budget: e.target.value,
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
    <ThemedComponentProvider>
      <PageContainer>
        <UserHeader />

        {/* Hero Section */}
        <HeroSection>
          <ContentContainer>
            <Title size="large" color="currentColor">
              Find Your Perfect Home
            </Title>
            <Subtitle color="currentColor" maxWidth="800px">
              Discover amazing rooms and apartments from trusted landlords. Book
              with confidence and enjoy your stay with Wild Welcome.
            </Subtitle>

            <SearchSection>
              <StyledSearchForm
                location={searchData.location}
                checkIn={searchData.moveInDate}
                budget={searchData.budget}
                onLocationChange={handleLocationChange}
                onCheckInChange={handleCheckInChange}
                onBudgetChange={handleBudgetChange}
                onSubmit={handleSearch}
                locationPlaceholder="Where do you want to live?"
                budgetPlaceholder="Max budget per night"
                showIcon={true}
              />
            </SearchSection>
          </ContentContainer>
        </HeroSection>

        {/* Banner Section */}
        <BannerSection>
          <BannerImage
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80"
            alt="Modern apartment living space"
            loading="lazy"
          />
          <BannerContent>
            <h2>Welcome to a New Way of Living</h2>
            <p>
              Browse hundreds of verified rooms and apartments. Enjoy peace of
              mind, transparency, and a community that cares.
            </p>
            <Button as={Link} to="/user/search" variant="primary" size="large">
              Start Exploring
            </Button>
          </BannerContent>
        </BannerSection>

        {/* Featured Properties Section */}
        <Section>
          <ContentContainer>
            <Title size="medium" centered>
              Featured Properties
            </Title>

            {isLoading ? (
              <LoadingText>Loading featured properties...</LoadingText>
            ) : featuredRooms.length > 0 ? (
              <>
                <Grid>
                  {featuredRooms.map((property) => (
                    <ListingCard key={property.id} property={property} />
                  ))}
                </Grid>

                <div style={{ textAlign: "center", marginTop: "3rem" }}>
                  <Button
                    as={Link}
                    to="/user/search"
                    variant="primary"
                    size="large"
                  >
                    View All Properties
                  </Button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <p>No properties available at the moment.</p>
                <Button
                  as={Link}
                  to="/user/search"
                  variant="primary"
                  style={{ marginTop: "1rem" }}
                >
                  Browse All Properties
                </Button>
              </div>
            )}
          </ContentContainer>
        </Section>

        {/* Stats Section */}
        <Section>
          <ContentContainer>
            <StatsGrid>
              <StatCard>
                <StatNumber>{stats.available_properties}</StatNumber>
                <StatLabel>Available Properties</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{stats.happy_tenants}</StatNumber>
                <StatLabel>Happy Tenants</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{stats.trusted_landlords}</StatNumber>
                <StatLabel>Trusted Landlords</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>24/7</StatNumber>
                <StatLabel>Support Available</StatLabel>
              </StatCard>
            </StatsGrid>
          </ContentContainer>
        </Section>

        {/* Testimonials Section */}
        <Section>
          <ContentContainer>
            <Title size="medium" centered>
              What Our Users Say
            </Title>

            {testimonials.length > 0 ? (
              <Grid columns="repeat(auto-fit, minmax(260px, 1fr))">
                {testimonials.map((review) => (
                  <TestimonialCard key={review.id}>
                    <TestimonialAvatar>
                      {review.user_name
                        ? review.user_name.charAt(0).toUpperCase()
                        : "U"}
                    </TestimonialAvatar>
                    <TestimonialQuote>"{review.comment}"</TestimonialQuote>
                    <TestimonialName>{review.user_name}</TestimonialName>
                    <TestimonialRating>
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </TestimonialRating>
                  </TestimonialCard>
                ))}
              </Grid>
            ) : (
              <LoadingText>
                No reviews available yet. Be the first to share your experience!
              </LoadingText>
            )}
          </ContentContainer>
        </Section>

        {/* Footer */}
        <Footer>
          <FooterContent>
            <FooterLogo>Wild Welcome</FooterLogo>
            <FooterNav>
              <Link to="/user">Home</Link>
              <Link to="/user/search">Search</Link>
              <Link to="/user/favourites">Favourites</Link>
              <Link to="/user/account">Account</Link>
            </FooterNav>
            <FooterSocial>
              <a
                href="https://instagram.com/wildwelcome"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://twitter.com/wildwelcome"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="https://facebook.com/wildwelcome"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
            </FooterSocial>
          </FooterContent>
          <FooterBottom>
            &copy; {new Date().getFullYear()} Wild Welcome. All rights reserved.
          </FooterBottom>
        </Footer>
      </PageContainer>
    </ThemedComponentProvider>
  );
};

export default UserLanding;
