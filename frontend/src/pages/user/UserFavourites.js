import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const FavouritesContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const Header = styled.header`
  background-color: ${props => props.theme.colors.white};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.lg} 0;
  position: sticky;
  top: 0;
  z-index: ${props => props.theme.zIndex.sticky};
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  gap: ${props => props.theme.spacing.xl};
  align-items: center;
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  transition: color ${props => props.theme.transitions.normal};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes['3xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const PageSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const FavouritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.xl};
`;

const FavouriteCard = styled(Card)`
  cursor: pointer;
  transition: transform ${props => props.theme.transitions.normal};
  position: relative;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const FavouriteImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.gray[500]};
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
`;

const FavouriteTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const FavouriteLocation = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const FavouritePrice = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const FavouriteFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Feature = styled.span`
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.textSecondary};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSizes.xs};
`;

const CardActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const RemoveButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.md};
  right: ${props => props.theme.spacing.md};
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background-color: ${props => props.theme.colors.error};
  color: ${props => props.theme.colors.white};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    background-color: ${props => props.theme.colors.errorDark};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxxl} 0;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const EmptyTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const EmptyDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const UserFavourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFavourites([
        {
          id: 1,
          title: 'Cozy Studio in Downtown',
          location: 'Downtown, New York',
          price: 1200,
          features: ['Furnished', 'Private Bath'],
          image: '🏠',
        },
        {
          id: 2,
          title: 'Modern 2BR Apartment',
          location: 'Brooklyn Heights',
          price: 2100,
          features: ['Parking', 'Gym'],
          image: '🏢',
        },
        {
          id: 3,
          title: 'Charming Room in Brownstone',
          location: 'Upper West Side',
          price: 1500,
          features: ['Pet Friendly', 'WiFi'],
          image: '🏘️',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRemoveFavourite = (id) => {
    setFavourites(prev => prev.filter(fav => fav.id !== id));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <FavouritesContainer>
      <Header>
        <HeaderContent>
          <Logo to="/user">Wild Welcome</Logo>
          <Nav>
            <NavLink to="/user/search">Search</NavLink>
            <NavLink to="/user/favourites">Favourites</NavLink>
            <NavLink to="/user/applications">Applications</NavLink>
            <NavLink to="/user/account">Account</NavLink>
          </Nav>
        </HeaderContent>
      </Header>

      <MainContent>
        <PageTitle>My Favourites</PageTitle>
        <PageSubtitle>
          {favourites.length} saved {favourites.length === 1 ? 'property' : 'properties'}
        </PageSubtitle>

        {favourites.length === 0 ? (
          <EmptyState>
            <EmptyIcon>❤️</EmptyIcon>
            <EmptyTitle>No favourites yet</EmptyTitle>
            <EmptyDescription>
              Start exploring properties and save your favourites to view them here later.
            </EmptyDescription>
            <Button as={Link} to="/user/search" size="lg">
              Start Searching
            </Button>
          </EmptyState>
        ) : (
          <FavouritesGrid>
            {favourites.map((favourite, index) => (
              <motion.div
                key={favourite.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <FavouriteCard as={Link} to={`/user/listing/${favourite.id}`}>
                  <RemoveButton
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveFavourite(favourite.id);
                    }}
                  >
                    ×
                  </RemoveButton>
                  
                  <FavouriteImage>{favourite.image}</FavouriteImage>
                  <FavouriteTitle>{favourite.title}</FavouriteTitle>
                  <FavouriteLocation>{favourite.location}</FavouriteLocation>
                  <FavouritePrice>${favourite.price}/month</FavouritePrice>
                  <FavouriteFeatures>
                    {favourite.features.map((feature, i) => (
                      <Feature key={i}>{feature}</Feature>
                    ))}
                  </FavouriteFeatures>
                  
                  <CardActions>
                    <Button variant="outline" size="sm" fullWidth>
                      View Details
                    </Button>
                  </CardActions>
                </FavouriteCard>
              </motion.div>
            ))}
          </FavouritesGrid>
        )}
      </MainContent>
    </FavouritesContainer>
  );
};

export default UserFavourites; 