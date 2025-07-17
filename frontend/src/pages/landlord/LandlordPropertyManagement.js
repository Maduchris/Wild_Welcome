import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const PropertyManagementContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xxxl};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.lg};
    align-items: flex-start;
  }
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes['3xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.text};
`;

const AddPropertyButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xxxl};
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  transition: transform ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  background-color: ${props => props.iconColor || props.theme.colors.primaryLight};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSizes.xl};
  color: ${props => props.theme.colors.white};
`;

const StatNumber = styled.div`
  font-size: ${props => props.theme.typography.fontSizes['3xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StatLabel = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSizes.base};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
`;

const StatChange = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.isPositive ? props.theme.colors.success : props.isNegative ? props.theme.colors.error : props.theme.colors.textSecondary};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const ContentSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xxxl};
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const FilterBar = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
  flex-wrap: wrap;
  align-items: end;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const FilterLabel = styled.label`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.text};
`;

const FilterSelect = styled.select`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSizes.base};
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}33;
  }
`;

const FilterInput = styled.input`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSizes.base};
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}33;
  }
`;

const PropertiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.xl};
`;

const PropertyCard = styled(Card)`
  padding: ${props => props.theme.spacing.xl};
  transition: transform ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const PropertyHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const PropertyIcon = styled.div`
  width: 50px;
  height: 50px;
  background-color: ${props => props.theme.colors.primaryLight};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.typography.fontSizes.xl};
  color: ${props => props.theme.colors.white};
  flex-shrink: 0;
`;

const PropertyInfo = styled.div`
  flex: 1;
`;

const PropertyTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
`;

const PropertyLocation = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const PropertyDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const DetailItem = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const DetailLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const DetailValue = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.text};
`;

const PropertyPrice = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const PropertyStatus = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  background-color: ${props => {
    switch (props.status) {
      case 'available':
        return props.theme.colors.success;
      case 'occupied':
        return props.theme.colors.warning;
      case 'maintenance':
        return props.theme.colors.error;
      default:
        return props.theme.colors.gray[500];
    }
  }};
  color: ${props => props.theme.colors.white};
`;

const PropertyActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const ActionButton = styled(Button)`
  flex: 1;
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

const LandlordPropertyManagement = () => {
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    location: ''
  });

  const properties = [
    {
      id: 1,
      title: "Cozy Studio in Kigali City Center",
      location: "Kigali, Rwanda",
      status: "available",
      type: "Studio",
      price: "$120/month",
      bedrooms: 1,
      bathrooms: 1,
      area: "500 sq ft",
      icon: "🏠"
    },
    {
      id: 2,
      title: "Modern 2BR Apartment in Remera",
      location: "Remera, Kigali",
      status: "occupied",
      type: "Apartment",
      price: "$280/month",
      bedrooms: 2,
      bathrooms: 2,
      area: "800 sq ft",
      icon: "🏢"
    },
    {
      id: 3,
      title: "Luxury Suite in Nyarutarama",
      location: "Nyarutarama, Kigali",
      status: "maintenance",
      type: "Penthouse",
      price: "$450/month",
      bedrooms: 3,
      bathrooms: 2,
      area: "1200 sq ft",
      icon: "🏰"
    },
    {
      id: 4,
      title: "Shared Room Near University",
      location: "Kacyiru, Kigali",
      status: "available",
      type: "Shared Room",
      price: "$90/month",
      bedrooms: 1,
      bathrooms: 1,
      area: "300 sq ft",
      icon: "🏘️"
    },
    {
      id: 5,
      title: "Garden View Apartment in Gisozi",
      location: "Gisozi, Kigali",
      status: "available",
      type: "Apartment",
      price: "$200/month",
      bedrooms: 2,
      bathrooms: 1,
      area: "750 sq ft",
      icon: "🏡"
    },
    {
      id: 6,
      title: "Executive Suite in Business District",
      location: "Kigali Business District",
      status: "occupied",
      type: "Suite",
      price: "$380/month",
      bedrooms: 2,
      bathrooms: 2,
      area: "1000 sq ft",
      icon: "🏢"
    }
  ];

  const stats = [
    {
      title: "Total Properties",
      value: "12",
      change: "+2",
      changeType: "positive",
      icon: "🏠",
      iconColor: "#3B82F6"
    },
    {
      title: "Available",
      value: "5",
      change: "+1",
      changeType: "positive",
      icon: "✅",
      iconColor: "#10B981"
    },
    {
      title: "Occupied",
      value: "6",
      change: "0",
      changeType: "neutral",
      icon: "👥",
      iconColor: "#F59E0B"
    },
    {
      title: "Maintenance",
      value: "1",
      change: "+1",
      changeType: "negative",
      icon: "🔧",
      iconColor: "#EF4444"
    }
  ];

  const filteredProperties = properties.filter(property => {
    if (filters.status && property.status !== filters.status) return false;
    if (filters.type && property.type !== filters.type) return false;
    if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    return true;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <PropertyManagementContainer>
      <Header userType="landlord" userInitials="LS" />
      
      <MainContent>
        <PageHeader>
          <PageTitle>Property Management</PageTitle>
          <Link to="/landlord/add-property" style={{ textDecoration: 'none' }}>
            <AddPropertyButton variant="primary">
              <span>+</span>
              Add Property
            </AddPropertyButton>
          </Link>
        </PageHeader>

        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard key={index}>
              <StatIcon iconColor={stat.iconColor}>{stat.icon}</StatIcon>
              <StatNumber>{stat.value}</StatNumber>
              <StatLabel>{stat.title}</StatLabel>
              <StatChange 
                isPositive={stat.changeType === 'positive'}
                isNegative={stat.changeType === 'negative'}
              >
                {stat.changeType === 'positive' && '+'}
                {stat.change} from last month
              </StatChange>
            </StatCard>
          ))}
        </StatsGrid>

        <ContentSection>
          <SectionTitle>Properties</SectionTitle>
          
          <FilterBar>
            <FilterGroup>
              <FilterLabel>Status</FilterLabel>
              <FilterSelect
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </FilterSelect>
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Property Type</FilterLabel>
              <FilterSelect
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="Studio">Studio</option>
                <option value="Apartment">Apartment</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Shared Room">Shared Room</option>
                <option value="Suite">Suite</option>
              </FilterSelect>
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Location</FilterLabel>
              <FilterInput
                type="text"
                name="location"
                placeholder="Search by location..."
                value={filters.location}
                onChange={handleFilterChange}
              />
            </FilterGroup>
          </FilterBar>

          <PropertiesGrid>
            {filteredProperties.map(property => (
              <PropertyCard key={property.id}>
                <PropertyHeader>
                  <PropertyIcon>{property.icon}</PropertyIcon>
                  <PropertyInfo>
                    <PropertyTitle>{property.title}</PropertyTitle>
                    <PropertyLocation>{property.location}</PropertyLocation>
                  </PropertyInfo>
                  <PropertyStatus status={property.status}>
                    {property.status}
                  </PropertyStatus>
                </PropertyHeader>
                
                <PropertyPrice>{property.price}</PropertyPrice>
                
                <PropertyDetails>
                  <DetailItem>
                    <DetailLabel>Bedrooms</DetailLabel>
                    <DetailValue>{property.bedrooms}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Bathrooms</DetailLabel>
                    <DetailValue>{property.bathrooms}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Area</DetailLabel>
                    <DetailValue>{property.area}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Type</DetailLabel>
                    <DetailValue>{property.type}</DetailValue>
                  </DetailItem>
                </PropertyDetails>
                
                <PropertyActions>
                  <ActionButton variant="outline" size="sm">
                    View Details
                  </ActionButton>
                  <ActionButton variant="outline" size="sm">
                    Edit
                  </ActionButton>
                  <ActionButton variant="outline" size="sm" color="error">
                      Delete
                  </ActionButton>
                </PropertyActions>
              </PropertyCard>
            ))}
          </PropertiesGrid>
        </ContentSection>
      </MainContent>
    </PropertyManagementContainer>
  );
};

export default LandlordPropertyManagement; 