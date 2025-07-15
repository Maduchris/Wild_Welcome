import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const ListingPageContainer = styled.div`
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

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const ImageGallery = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const MainImage = styled.div`
  width: 100%;
  height: 400px;
  background-color: ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.gray[500]};
  font-size: ${props => props.theme.typography.fontSizes['4xl']};
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${props => props.theme.spacing.md};
`;

const Thumbnail = styled.div`
  width: 100%;
  height: 80px;
  background-color: ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.gray[500]};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    background-color: ${props => props.theme.colors.gray[300]};
  }
`;

const PropertyInfo = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const PropertyTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes['3xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const PropertyLocation = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const PropertyPrice = styled.div`
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const AmenityItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const AmenityIcon = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.lg};
`;

const AmenityText = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.base};
  color: ${props => props.theme.colors.text};
`;

const Description = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
  
  h3 {
    font-size: ${props => props.theme.typography.fontSizes.xl};
    font-weight: ${props => props.theme.typography.fontWeights.semibold};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  p {
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.6;
    margin-bottom: ${props => props.theme.spacing.md};
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
  gap: ${props => props.theme.spacing.lg};
`;

const DateInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.base};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primaryLight};
  }
`;

const BookingSummary = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.sm};
  
  &:last-child {
    margin-bottom: 0;
    border-top: 1px solid ${props => props.theme.colors.border};
    padding-top: ${props => props.theme.spacing.sm};
    font-weight: ${props => props.theme.typography.fontWeights.semibold};
  }
`;

const ContactInfo = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
  padding-top: ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.borderLight};
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ListingPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setListing({
        id: id,
        title: 'Cozy Studio in Downtown',
        location: 'Downtown, New York',
        price: 1200,
        description: 'Beautiful studio apartment in the heart of downtown. Recently renovated with modern amenities and stunning city views. Perfect for young professionals or students.',
        amenities: [
          { icon: '🛏️', text: 'Furnished' },
          { icon: '🚿', text: 'Private Bathroom' },
          { icon: '🚗', text: 'Parking Available' },
          { icon: '🐕', text: 'Pet Friendly' },
          { icon: '🏋️', text: 'Gym Access' },
          { icon: '📶', text: 'WiFi Included' },
          { icon: '🧺', text: 'Laundry' },
          { icon: '🏊', text: 'Pool Access' },
        ],
        images: ['🏠', '🛏️', '🚿', '🏋️'],
        landlord: {
          name: 'Sarah Johnson',
          phone: '+1 (555) 123-4567',
          email: 'sarah.johnson@email.com',
        },
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleBooking = (e) => {
    e.preventDefault();
    // Navigate to booking process
    window.location.href = `/user/booking/step1?listingId=${id}`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ListingPageContainer>
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
        <Breadcrumb>
          <Link to="/user">Home</Link>
          <span>›</span>
          <Link to="/user/search">Search</Link>
          <span>›</span>
          <span>{listing.title}</span>
        </Breadcrumb>

        <ContentGrid>
          <div>
            <ImageGallery>
              <MainImage>{listing.images[selectedImage]}</MainImage>
              <ThumbnailGrid>
                {listing.images.map((image, index) => (
                  <Thumbnail
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    style={{
                      backgroundColor: selectedImage === index 
                        ? props => props.theme.colors.primaryLight 
                        : props => props.theme.colors.gray[200]
                    }}
                  >
                    {image}
                  </Thumbnail>
                ))}
              </ThumbnailGrid>
            </ImageGallery>

            <PropertyInfo>
              <PropertyTitle>{listing.title}</PropertyTitle>
              <PropertyLocation>{listing.location}</PropertyLocation>
              <PropertyPrice>${listing.price}/month</PropertyPrice>
            </PropertyInfo>

            <AmenitiesGrid>
              {listing.amenities.map((amenity, index) => (
                <AmenityItem key={index}>
                  <AmenityIcon>{amenity.icon}</AmenityIcon>
                  <AmenityText>{amenity.text}</AmenityText>
                </AmenityItem>
              ))}
            </AmenitiesGrid>

            <Description>
              <h3>About this property</h3>
              <p>{listing.description}</p>
              <p>This property is perfect for those looking for a comfortable and convenient living space in the heart of the city. The location provides easy access to public transportation, shopping centers, and entertainment venues.</p>
            </Description>
          </div>

          <div>
            <BookingCard>
              <h3>Book this property</h3>
              <BookingForm onSubmit={handleBooking}>
                <div>
                  <label>Move-in Date</label>
                  <DateInput type="date" required />
                </div>
                
                <BookingSummary>
                  <SummaryRow>
                    <span>Monthly Rent</span>
                    <span>${listing.price}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span>Security Deposit</span>
                    <span>${listing.price}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span>Application Fee</span>
                    <span>$50</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span>Total</span>
                    <span>${listing.price * 2 + 50}</span>
                  </SummaryRow>
                </BookingSummary>

                <Button type="submit" fullWidth size="lg">
                  Book Now
                </Button>
              </BookingForm>

              <ContactInfo>
                <h4>Contact Landlord</h4>
                <ContactItem>
                  <span>👤</span>
                  <span>{listing.landlord.name}</span>
                </ContactItem>
                <ContactItem>
                  <span>📞</span>
                  <span>{listing.landlord.phone}</span>
                </ContactItem>
                <ContactItem>
                  <span>📧</span>
                  <span>{listing.landlord.email}</span>
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