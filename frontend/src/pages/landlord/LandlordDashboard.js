import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaHome, FaCalendarAlt, FaDollarSign, FaChartLine, FaPlus, FaBuilding, FaEye } from 'react-icons/fa';
import LandlordHeader from '../../components/landlord/LandlordHeader';
import { propertiesAPI, bookingsAPI } from '../../services/api';
import {
  Card,
  Button,
  ThemedComponentProvider
} from '../../components/ui/ThemeProvider';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;


const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
`;

const WelcomeSection = styled.section`
  margin-bottom: 3rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: 1.5rem;
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  background-color: ${props => props.iconColor || props.theme.colors.accent};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.25rem;
  color: ${props => props.iconTextColor || props.theme.colors.primary};
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
  margin: 0;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const RecentBookings = styled(Card)`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const BookingItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const BookingAvatar = styled.div`
  width: 50px;
  height: 50px;
  background-color: ${props => props.theme.colors.accent};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const BookingInfo = styled.div`
  flex: 1;
`;

const BookingTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.25rem 0;
`;

const BookingDetails = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const BookingStatus = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'pending': return '#FEF3C7';
      case 'approved': return '#D1FAE5';
      case 'rejected': return '#FEE2E2';
      default: return props.theme.colors.surface;
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'pending': return '#92400E';
      case 'approved': return '#065F46';
      case 'rejected': return '#991B1B';
      default: return props.theme.colors.textSecondary;
    }
  }};
`;

const QuickActions = styled(Card)`
  margin-bottom: 1.5rem;
  padding: 1.5rem;
`;

const ActionButton = styled(Button)`
  width: 100%;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-weight: 500;
  text-align: left;
  padding: 0.75rem 1rem;
  min-height: 44px;
  border-radius: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  svg {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
  }
`;

const PropertyCard = styled(Card)`
  margin-bottom: 1rem;
`;

const EmptyPropertiesCard = styled(Card)`
  text-align: center;
  padding: 3rem;
  border: 2px dashed ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.surface};
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.5rem 0;
`;

const EmptyDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 1rem 0;
`;

const EmptyActionButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
`;

const PropertyImage = styled.div`
  width: 100%;
  height: 150px;
  background-color: ${props => props.theme.colors.accent};
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.5rem;
`;

const PropertyTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.5rem 0;
`;

const PropertyLocation = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin: 0 0 0.75rem 0;
`;

const PropertyStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PropertyPrice = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const PropertyOccupancy = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyBookingsContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.textSecondary};
  
  p {
    margin: 0 0 0.5rem 0;
    
    &:last-child {
      font-size: 0.875rem;
    }
  }
`;

const LandlordDashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeBookings: 0,
    monthlyRevenue: 0,
    occupancyRate: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Current user handled by LandlordHeader component

        // Fetch landlord's properties
        const propertiesData = await propertiesAPI.getMyProperties();
        setProperties(Array.isArray(propertiesData) ? propertiesData : []);

        // Fetch booking requests
        const bookingsData = await bookingsAPI.getLandlordApplications();
        setRecentBookings(bookingsData?.slice(0, 5) || []); // Show latest 5 bookings

        // Calculate stats from properties and bookings
        const totalProperties = propertiesData?.length || 0;
        const activeBookings = bookingsData?.filter(b => b.status === 'approved')?.length || 0;
        
        // Calculate monthly revenue (sum of approved bookings)
        const monthlyRevenue = propertiesData?.reduce((total, prop) => {
          return total + (prop.rent_amount || prop.price || 0);
        }, 0) || 0;

        // Calculate occupancy rate (approved bookings / total properties)
        const occupancyRate = totalProperties > 0 ? Math.round((activeBookings / totalProperties) * 100) : 0;

        setStats({
          totalProperties,
          activeBookings,
          monthlyRevenue,
          occupancyRate,
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
        
        // Fallback to mock data
        setStats({
          totalProperties: 0,
          activeBookings: 0,
          monthlyRevenue: 0,
          occupancyRate: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  

  if (loading) {
    return (
      <ThemedComponentProvider>
        <DashboardContainer>
          <LandlordHeader />
          <MainContent>
            <WelcomeSection>
              <WelcomeTitle>Loading...</WelcomeTitle>
              <WelcomeSubtitle>Fetching your dashboard data...</WelcomeSubtitle>
            </WelcomeSection>
          </MainContent>
        </DashboardContainer>
      </ThemedComponentProvider>
    );
  }

  return (
    <ThemedComponentProvider>
      <DashboardContainer>
      <LandlordHeader />

      <MainContent>
        <WelcomeSection>
          <WelcomeTitle>
            Welcome back, Landlord!
          </WelcomeTitle>
          <WelcomeSubtitle>
            Here's what's happening with your properties today.
          </WelcomeSubtitle>
        </WelcomeSection>

        <StatsGrid>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <StatCard>
              <StatIcon>
                <FaHome />
              </StatIcon>
              <StatNumber>{stats.totalProperties}</StatNumber>
              <StatLabel>Total Properties</StatLabel>
            </StatCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <StatCard>
              <StatIcon>
                <FaCalendarAlt />
              </StatIcon>
              <StatNumber>{stats.activeBookings}</StatNumber>
              <StatLabel>Active Bookings</StatLabel>
            </StatCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <StatCard>
              <StatIcon>
                <FaDollarSign />
              </StatIcon>
              <StatNumber>${stats.monthlyRevenue.toLocaleString()}</StatNumber>
              <StatLabel>Monthly Revenue</StatLabel>
            </StatCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <StatCard>
              <StatIcon>
                <FaChartLine />
              </StatIcon>
              <StatNumber>{stats.occupancyRate}%</StatNumber>
              <StatLabel>Occupancy Rate</StatLabel>
            </StatCard>
          </motion.div>
        </StatsGrid>

        <ContentGrid>
          <div>
            <RecentBookings>
              <SectionTitle>Recent Booking Requests</SectionTitle>
              {recentBookings.length === 0 ? (
                <EmptyBookingsContainer>
                  <p>No booking requests yet</p>
                  <p style={{fontSize: '0.875rem'}}>Booking requests will appear here when users apply for your properties.</p>
                </EmptyBookingsContainer>
              ) : (
                recentBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <BookingItem>
                    <BookingAvatar>
                      {booking.user_name ? booking.user_name.split(' ').map(n => n[0]).join('') : 'U'}
                    </BookingAvatar>
                    <BookingInfo>
                      <BookingTitle>{booking.user_name || 'User'}</BookingTitle>
                      <BookingDetails>
                        {booking.property_title || 'Property'} • {new Date(booking.created_at || booking.date).toLocaleDateString()}
                      </BookingDetails>
                    </BookingInfo>
                    <BookingStatus status={booking.status}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </BookingStatus>
                  </BookingItem>
                </motion.div>
                ))
              )}
            </RecentBookings>
          </div>

          <div>
            <QuickActions>
              <SectionTitle>Quick Actions</SectionTitle>
              <ActionButton as={Link} to="/landlord/add-room">
                <FaPlus style={{ marginRight: '8px' }} />
                Add New Property
              </ActionButton>
              <ActionButton as={Link} to="/landlord/properties" variant="outline">
                <FaBuilding style={{ marginRight: '8px' }} />
                Manage Properties
              </ActionButton>
              <ActionButton as={Link} to="/landlord/booking-request" variant="outline">
                <FaEye style={{ marginRight: '8px' }} />
                View All Bookings
              </ActionButton>
            </QuickActions>

            <SectionTitle>Your Properties</SectionTitle>
            {!properties || properties.length === 0 ? (
              <EmptyPropertiesCard>
                <EmptyIcon>
                  <FaHome />
                </EmptyIcon>
                <EmptyTitle>No properties yet</EmptyTitle>
                <EmptyDescription>
                  Add your first property to start managing your rental business!
                </EmptyDescription>
                <EmptyActionButton as={Link} to="/landlord/add-room">
                  <FaPlus />
                  Add Your First Property
                </EmptyActionButton>
              </EmptyPropertiesCard>
            ) : (
              properties.slice(0, 3).map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <PropertyCard>
                  <PropertyImage>
                    {property.images && property.images.length > 0 ? (
                      <img src={property.images[0]} alt={property.title} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px'}} />
                    ) : <FaHome size={40} />}
                  </PropertyImage>
                  <PropertyTitle>{property.title}</PropertyTitle>
                  <PropertyLocation>{property.location?.address || property.address || 'Address not available'}</PropertyLocation>
                  <PropertyStats>
                    <PropertyPrice>${property.price_per_night || property.rent_amount || property.price}/night</PropertyPrice>
                    <PropertyOccupancy>{property.is_active ? 'Available' : 'Inactive'}</PropertyOccupancy>
                  </PropertyStats>
                </PropertyCard>
              </motion.div>
              ))
            )}
          </div>
        </ContentGrid>
      </MainContent>
      </DashboardContainer>
    </ThemedComponentProvider>
  );
};

export default LandlordDashboard; 