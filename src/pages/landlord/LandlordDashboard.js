import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const DashboardContainer = styled.div`
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

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.white};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`;

const WelcomeSection = styled.section`
  margin-bottom: ${props => props.theme.spacing.xxxl};
`;

const WelcomeTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes['3xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const WelcomeSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  color: ${props => props.theme.colors.textSecondary};
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
  color: ${props => props.iconTextColor || props.theme.colors.primary};
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
  margin: 0;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const RecentBookings = styled(Card)`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const BookingItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};
  
  &:last-child {
    border-bottom: none;
  }
`;

const BookingAvatar = styled.div`
  width: 50px;
  height: 50px;
  background-color: ${props => props.theme.colors.gray[200]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.gray[600]};
`;

const BookingInfo = styled.div`
  flex: 1;
`;

const BookingTitle = styled.h4`
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
`;

const BookingDetails = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const BookingStatus = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  background-color: ${props => {
    switch (props.status) {
      case 'pending': return props.theme.colors.warningLight;
      case 'approved': return props.theme.colors.successLight;
      case 'rejected': return props.theme.colors.errorLight;
      default: return props.theme.colors.gray[100];
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'pending': return props.theme.colors.warningDark;
      case 'approved': return props.theme.colors.successDark;
      case 'rejected': return props.theme.colors.errorDark;
      default: return props.theme.colors.gray[600];
    }
  }};
`;

const QuickActions = styled(Card)`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ActionButton = styled(Button)`
  width: 100%;
  margin-bottom: ${props => props.theme.spacing.md};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const PropertyCard = styled(Card)`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const PropertyImage = styled.div`
  width: 100%;
  height: 150px;
  background-color: ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.gray[500]};
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
`;

const PropertyTitle = styled.h4`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
`;

const PropertyLocation = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
`;

const PropertyStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PropertyPrice = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
`;

const PropertyOccupancy = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
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

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalProperties: 8,
        activeBookings: 12,
        monthlyRevenue: 15600,
        occupancyRate: 85,
      });

      setRecentBookings([
        {
          id: 1,
          tenant: 'John Doe',
          property: 'Downtown Studio',
          date: '2024-01-15',
          status: 'pending',
        },
        {
          id: 2,
          tenant: 'Jane Smith',
          property: 'Brooklyn Apartment',
          date: '2024-01-14',
          status: 'approved',
        },
        {
          id: 3,
          tenant: 'Mike Johnson',
          property: 'Manhattan Loft',
          date: '2024-01-13',
          status: 'rejected',
        },
      ]);

      setProperties([
        {
          id: 1,
          title: 'Downtown Studio',
          location: 'Downtown, New York',
          price: 1200,
          occupancy: 'Occupied',
          image: '🏠',
        },
        {
          id: 2,
          title: 'Brooklyn Apartment',
          location: 'Brooklyn Heights',
          price: 2100,
          occupancy: 'Available',
          image: '🏢',
        },
      ]);
    }, 1000);
  }, []);

  return (
    <DashboardContainer>
      <Header>
        <HeaderContent>
          <Logo to="/landlord/dashboard">Wild Welcome</Logo>
          <Nav>
            <NavLink to="/landlord/properties">Properties</NavLink>
            <NavLink to="/landlord/calendar">Calendar</NavLink>
            <NavLink to="/landlord/booking-request">Bookings</NavLink>
            <NavLink to="/landlord/account">Account</NavLink>
          </Nav>
          <UserMenu>
            <Avatar>LL</Avatar>
          </UserMenu>
        </HeaderContent>
      </Header>

      <MainContent>
        <WelcomeSection>
          <WelcomeTitle>Welcome back, Landlord!</WelcomeTitle>
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
              <StatIcon iconColor="#dbeafe" iconTextColor="#2563eb">🏠</StatIcon>
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
              <StatIcon iconColor="#d1fae5" iconTextColor="#10b981">📅</StatIcon>
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
              <StatIcon iconColor="#fef3c7" iconTextColor="#f59e0b">💰</StatIcon>
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
              <StatIcon iconColor="#fee2e2" iconTextColor="#ef4444">📊</StatIcon>
              <StatNumber>{stats.occupancyRate}%</StatNumber>
              <StatLabel>Occupancy Rate</StatLabel>
            </StatCard>
          </motion.div>
        </StatsGrid>

        <ContentGrid>
          <div>
            <RecentBookings>
              <SectionTitle>Recent Booking Requests</SectionTitle>
              {recentBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <BookingItem>
                    <BookingAvatar>
                      {booking.tenant.split(' ').map(n => n[0]).join('')}
                    </BookingAvatar>
                    <BookingInfo>
                      <BookingTitle>{booking.tenant}</BookingTitle>
                      <BookingDetails>
                        {booking.property} • {new Date(booking.date).toLocaleDateString()}
                      </BookingDetails>
                    </BookingInfo>
                    <BookingStatus status={booking.status}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </BookingStatus>
                  </BookingItem>
                </motion.div>
              ))}
            </RecentBookings>
          </div>

          <div>
            <QuickActions>
              <SectionTitle>Quick Actions</SectionTitle>
              <ActionButton as={Link} to="/landlord/add-room">
                Add New Room
              </ActionButton>
              <ActionButton as={Link} to="/landlord/add-apartment" variant="outline">
                Add New Apartment
              </ActionButton>
              <ActionButton as={Link} to="/landlord/booking-request" variant="outline">
                View All Bookings
              </ActionButton>
            </QuickActions>

            <SectionTitle>Your Properties</SectionTitle>
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <PropertyCard>
                  <PropertyImage>{property.image}</PropertyImage>
                  <PropertyTitle>{property.title}</PropertyTitle>
                  <PropertyLocation>{property.location}</PropertyLocation>
                  <PropertyStats>
                    <PropertyPrice>${property.price}/month</PropertyPrice>
                    <PropertyOccupancy>{property.occupancy}</PropertyOccupancy>
                  </PropertyStats>
                </PropertyCard>
              </motion.div>
            ))}
          </div>
        </ContentGrid>
      </MainContent>
    </DashboardContainer>
  );
};

export default LandlordDashboard; 