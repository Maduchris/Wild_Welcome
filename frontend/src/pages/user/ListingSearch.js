import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const SearchContainer = styled.div`
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

const SearchBar = styled.div`
  background-color: ${props => props.theme.colors.white};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.lg} 0;
`;

const SearchForm = styled.form`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.xl};
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: ${props => props.theme.spacing.md};
  align-items: end;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const FiltersSidebar = styled.aside`
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  height: fit-content;
  position: sticky;
  top: 200px;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    position: static;
    order: 2;
  }
`;

const FilterSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.text};
  
  input {
    width: auto;
    margin: 0;
  }
`;

const PriceRange = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  align-items: center;
`;

const PriceInput = styled(Input)`
  flex: 1;
`;

const ResultsSection = styled.section``;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ResultsCount = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSizes.lg};
`;

const SortSelect = styled.select`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

const ListingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.xl};
`;

const ListingCard = styled(Card)`
  cursor: pointer;
  transition: transform ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const ListingImage = styled.div`
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

const ListingTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ListingLocation = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ListingPrice = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ListingFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
`;

const Feature = styled.span`
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.textSecondary};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSizes.xs};
`;

const ClearFilters = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  cursor: pointer;
  text-decoration: underline;
  margin-top: ${props => props.theme.spacing.md};
  
  &:hover {
    color: ${props => props.theme.colors.primaryDark};
  }
`;

const ListingSearch = () => {
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    furnished: false,
    privateBathroom: false,
    parking: false,
    petFriendly: false,
    gym: false,
    wifi: false,
  });

  const [sortBy, setSortBy] = useState('relevance');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setListings(mockListings);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      furnished: false,
      privateBathroom: false,
      parking: false,
      petFriendly: false,
      gym: false,
      wifi: false,
    });
  };

  const mockListings = [
    {
      id: 1,
      title: 'Cozy Studio in Kigali City Center',
      location: 'Kigali, Rwanda',
      price: 120,
      features: ['Furnished', 'Private Bath'],
      image: '🏠',
    },
    {
      id: 2,
      title: 'Modern 2BR Apartment in Remera',
      location: 'Remera, Kigali',
      price: 280,
      features: ['Parking', 'Gym'],
      image: '🏢',
    },
    {
      id: 3,
      title: 'Charming Room in Kimihurura',
      location: 'Kimihurura, Kigali',
      price: 150,
      features: ['Pet Friendly', 'WiFi'],
      image: '🏘️',
    },
    {
      id: 4,
      title: 'Luxury Suite in Nyarutarama',
      location: 'Nyarutarama, Kigali',
      price: 450,
      features: ['Furnished', 'Parking', 'Gym'],
      image: '🏙️',
    },
    {
      id: 5,
      title: 'Student-Friendly Room Near University',
      location: 'Kacyiru, Kigali',
      price: 90,
      features: ['WiFi', 'Study Area'],
      image: '🎓',
    },
    {
      id: 6,
      title: 'Family Home Room in Gisozi',
      location: 'Gisozi, Kigali',
      price: 130,
      features: ['Pet Friendly', 'Garden'],
      image: '🏡',
    },
    {
      id: 7,
      title: 'Studio Apartment in Kiyovu',
      location: 'Kiyovu, Kigali',
      price: 200,
      features: ['Furnished', 'Balcony'],
      image: '🏠',
    },
    {
      id: 8,
      title: 'Shared Room in Kabeza',
      location: 'Kabeza, Kigali',
      price: 75,
      features: ['WiFi', 'Kitchen'],
      image: '🏘️',
    },
    {
      id: 9,
      title: 'Luxury Apartment in Kigali Heights',
      location: 'Kigali Heights, Rwanda',
      price: 380,
      features: ['Furnished', 'Pool', 'Security'],
      image: '🏢',
    },
    {
      id: 10,
      title: 'Budget Room in Nyamirambo',
      location: 'Nyamirambo, Kigali',
      price: 60,
      features: ['WiFi', 'Shared Kitchen'],
      image: '🏠',
    },
    {
      id: 11,
      title: 'Premium Studio in Kigali Business District',
      location: 'Kigali Business District',
      price: 320,
      features: ['Furnished', 'Gym', 'Parking'],
      image: '🏢',
    },
    {
      id: 12,
      title: 'Cozy Room in Gikondo',
      location: 'Gikondo, Kigali',
      price: 85,
      features: ['WiFi', 'Garden View'],
      image: '🏡',
    },
  ];

  const filteredListings = listings.filter(listing => {
    // Location filter
    if (filters.location && !listing.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // Price filters
    if (filters.minPrice && listing.price < parseInt(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && listing.price > parseInt(filters.maxPrice)) {
      return false;
    }
    
    // Feature filters
    if (filters.furnished && !listing.features.some(f => f.toLowerCase().includes('furnished'))) {
      return false;
    }
    if (filters.privateBathroom && !listing.features.some(f => f.toLowerCase().includes('private') || f.toLowerCase().includes('bath'))) {
      return false;
    }
    if (filters.parking && !listing.features.some(f => f.toLowerCase().includes('parking'))) {
      return false;
    }
    if (filters.petFriendly && !listing.features.some(f => f.toLowerCase().includes('pet'))) {
      return false;
    }
    if (filters.gym && !listing.features.some(f => f.toLowerCase().includes('gym'))) {
      return false;
    }
    if (filters.wifi && !listing.features.some(f => f.toLowerCase().includes('wifi'))) {
      return false;
    }
    
    return true;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return b.id - a.id;
      default:
        return 0;
    }
  });

  return (
    <SearchContainer>
      <Header>
        <HeaderContent>
          <Logo to="/user">Wild Welcome</Logo>
          <Button variant="outline" as={Link} to="/user/account">
            My Account
          </Button>
        </HeaderContent>
      </Header>

      <SearchBar>
        <SearchForm>
          <Input
            label="Location"
            placeholder="Enter city or neighborhood"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          />
          <Input
            label="Min Price"
            type="number"
            placeholder="Min monthly rent"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          />
          <Input
            label="Max Price"
            type="number"
            placeholder="Max monthly rent"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          />
          <Button type="submit" size="lg">
            Search
          </Button>
        </SearchForm>
      </SearchBar>

      <MainContent>
        <FiltersSidebar>
          <FilterSection>
            <FilterTitle>Price Range</FilterTitle>
            <PriceRange>
              <PriceInput
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
              <span>-</span>
              <PriceInput
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </PriceRange>
          </FilterSection>

          <FilterSection>
            <FilterTitle>Amenities</FilterTitle>
            <CheckboxGroup>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={filters.furnished}
                  onChange={(e) => handleFilterChange('furnished', e.target.checked)}
                />
                Furnished
              </CheckboxLabel>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={filters.privateBathroom}
                  onChange={(e) => handleFilterChange('privateBathroom', e.target.checked)}
                />
                Private Bathroom
              </CheckboxLabel>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={filters.parking}
                  onChange={(e) => handleFilterChange('parking', e.target.checked)}
                />
                Parking
              </CheckboxLabel>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={filters.petFriendly}
                  onChange={(e) => handleFilterChange('petFriendly', e.target.checked)}
                />
                Pet Friendly
              </CheckboxLabel>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={filters.gym}
                  onChange={(e) => handleFilterChange('gym', e.target.checked)}
                />
                Gym Access
              </CheckboxLabel>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={filters.wifi}
                  onChange={(e) => handleFilterChange('wifi', e.target.checked)}
                />
                WiFi Included
              </CheckboxLabel>
            </CheckboxGroup>
          </FilterSection>

          <ClearFilters onClick={handleClearFilters}>
            Clear All Filters
          </ClearFilters>
        </FiltersSidebar>

        <ResultsSection>
          <ResultsHeader>
            <ResultsCount>
              {sortedListings.length} listings found
            </ResultsCount>
            <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="relevance">Sort by Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </SortSelect>
          </ResultsHeader>

          <ListingsGrid>
            {sortedListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ListingCard as={Link} to={`/user/listing/${listing.id}`}>
                  <ListingImage>{listing.image}</ListingImage>
                  <ListingTitle>{listing.title}</ListingTitle>
                  <ListingLocation>{listing.location}</ListingLocation>
                  <ListingPrice>${listing.price}/month</ListingPrice>
                  <ListingFeatures>
                    {listing.features.map((feature, i) => (
                      <Feature key={i}>{feature}</Feature>
                    ))}
                  </ListingFeatures>
                </ListingCard>
              </motion.div>
            ))}
          </ListingsGrid>
        </ResultsSection>
      </MainContent>
    </SearchContainer>
  );
};

export default ListingSearch; 