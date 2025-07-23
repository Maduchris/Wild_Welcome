import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaTrash, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaBed, 
  FaBath,
  FaWifi,
  FaCar,
  FaUtensils,
  FaSnowflake,
  FaFire,
  FaTshirt,
  FaSwimmingPool,
  FaDumbbell,
  FaHome
} from 'react-icons/fa';
import { propertiesAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const Header = styled.header`
  background-color: ${props => props.theme.colors.white};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.lg} 0;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BackButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const ActionButton = styled(Button)`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  padding: ${props => props.theme.spacing.sm};
  min-width: 100px;
  
  &.edit {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    border: none;
    &:hover {
      background-color: ${props => props.theme.colors.primaryDark};
    }
  }
  
  &.delete {
    background-color: ${props => props.theme.colors.error};
    color: white;
    border: none;
    &:hover {
      background-color: ${props => props.theme.colors.errorDark};
    }
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`;

const PropertyGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const ImageSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const MainImage = styled.div`
  width: 100%;
  height: 400px;
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.md};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${props => props.theme.spacing.sm};
`;

const ThumbnailImage = styled.div`
  height: 100px;
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  
  &.active {
    border-color: ${props => props.theme.colors.primary};
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &:hover {
    opacity: 0.8;
  }
`;

const PropertyDetails = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const PropertyTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes['3xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const PropertyLocation = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSizes.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const PropertyStats = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const Price = styled.div`
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
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

const AmenitiesSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
  
  h3 {
    font-size: ${props => props.theme.typography.fontSizes.xl};
    font-weight: ${props => props.theme.typography.fontWeights.semibold};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.lg};
  }
`;

const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
`;

const AmenityItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
`;

const Sidebar = styled.div``;

const StatusCard = styled(Card)`
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const StatusTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  
  &.available {
    background-color: ${props => props.theme.colors.successLight};
    color: ${props => props.theme.colors.successDark};
  }
  &.occupied {
    background-color: ${props => props.theme.colors.warningLight};
    color: ${props => props.theme.colors.warningDark};
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  color: ${props => props.theme.colors.textSecondary};
`;

const LandlordPropertyView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        
        const propertyData = await propertiesAPI.getById(id);
        setProperty(propertyData);
      } catch (error) {
        console.error('Error fetching property:', error);
        toast.error('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      await propertiesAPI.delete(id);
      toast.success('Property deleted successfully');
      navigate('/landlord/properties');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    }
  };

  const getAmenityIcon = (amenityKey, amenityValue) => {
    if (!amenityValue) return null;
    
    const icons = {
      wifi: <FaWifi />,
      parking: <FaCar />,
      kitchen: <FaUtensils />,
      ac: <FaSnowflake />,
      heating: <FaFire />,
      washer: <FaTshirt />,
      dryer: <FaTshirt />,
      pool: <FaSwimmingPool />,
      gym: <FaDumbbell />
    };
    
    return icons[amenityKey] || null;
  };

  const getAmenityLabel = (amenityKey) => {
    const labels = {
      wifi: 'WiFi',
      parking: 'Parking',
      kitchen: 'Kitchen',
      ac: 'Air Conditioning',
      heating: 'Heating',
      washer: 'Washer',
      dryer: 'Dryer',
      pool: 'Swimming Pool',
      gym: 'Gym'
    };
    
    return labels[amenityKey] || amenityKey;
  };

  if (loading) {
    return (
      <Container>
        <LoadingState>
          <div>Loading property details...</div>
        </LoadingState>
      </Container>
    );
  }

  if (!property) {
    return (
      <Container>
        <LoadingState>
          <div>Property not found</div>
        </LoadingState>
      </Container>
    );
  }

  const amenities = property.amenities ? Object.entries(property.amenities).filter(([key, value]) => value) : [];

  return (
    <Container>
      <Header>
        <HeaderContent>
          <BackButton as={Link} to="/landlord/properties">
            <FaArrowLeft />
            Back to Properties
          </BackButton>
          <ActionButtons>
            <ActionButton 
              className="edit"
              as={Link}
              to={`/landlord/property/${id}/edit`}
              size="sm"
            >
              <FaEdit />
            </ActionButton>
            <ActionButton 
              className="delete"
              onClick={handleDelete}
              size="sm"
            >
              <FaTrash />
            </ActionButton>
          </ActionButtons>
        </HeaderContent>
      </Header>

      <MainContent>
        <PropertyGrid>
          <div>
            <ImageSection>
              <MainImage>
                {property.images && property.images.length > 0 ? (
                  <img src={property.images[selectedImage]} alt={property.title} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', color: 'white' }}>
                    <FaHome size={60} />
                    <span>No Images Available</span>
                  </div>
                )}
              </MainImage>
              
              {property.images && property.images.length > 1 && (
                <ImageGallery>
                  {property.images.map((image, index) => (
                    <ThumbnailImage
                      key={index}
                      className={selectedImage === index ? 'active' : ''}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img src={image} alt={`${property.title} ${index + 1}`} />
                    </ThumbnailImage>
                  ))}
                </ImageGallery>
              )}
            </ImageSection>

            <PropertyDetails>
              <PropertyTitle>{property.title}</PropertyTitle>
              
              <PropertyLocation>
                <FaMapMarkerAlt />
                {property.location?.address}, {property.location?.city}
              </PropertyLocation>

              <PropertyStats>
                <StatItem>
                  <FaUsers />
                  {property.max_guests} guests
                </StatItem>
                <StatItem>
                  <FaBed />
                  {property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''}
                </StatItem>
                <StatItem>
                  <FaBath />
                  {property.bathrooms} bathroom{property.bathrooms !== 1 ? 's' : ''}
                </StatItem>
              </PropertyStats>

              <Price>${property.price_per_night}/night</Price>

              <Description>
                <h3>About this property</h3>
                <p>{property.description}</p>
              </Description>

              {amenities.length > 0 && (
                <AmenitiesSection>
                  <h3>Amenities</h3>
                  <AmenitiesGrid>
                    {amenities.map(([key, value]) => {
                      const icon = getAmenityIcon(key, value);
                      if (!icon) return null;
                      
                      return (
                        <AmenityItem key={key}>
                          {icon}
                          {getAmenityLabel(key)}
                        </AmenityItem>
                      );
                    })}
                  </AmenitiesGrid>
                </AmenitiesSection>
              )}
            </PropertyDetails>
          </div>

          <Sidebar>
            <StatusCard>
              <StatusTitle>Property Status</StatusTitle>
              <StatusBadge className={property.is_active ? 'available' : 'occupied'}>
                {property.is_active ? 'Available' : 'Occupied'}
              </StatusBadge>
            </StatusCard>
          </Sidebar>
        </PropertyGrid>
      </MainContent>
    </Container>
  );
};

export default LandlordPropertyView;