import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
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
      case 'approved':
        return props.theme.colors.success;
      case 'pending':
        return props.theme.colors.warning;
      case 'rejected':
        return props.theme.colors.error;
      default:
        return props.theme.colors.gray[500];
    }
  }};
  color: ${props => props.theme.colors.white};
`;

const QuickActions = styled(Card)`
  padding: ${props => props.theme.spacing.xl};
`;

const ActionButton = styled(Button)`
  width: 100%;
  margin-bottom: ${props => props.theme.spacing.md};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const RecentActivity = styled(Card)`
  margin-top: ${props => props.theme.spacing.xl};
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 32px;
  height: 32px;
  background-color: ${props => props.theme.colors.primaryLight};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.primary};
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
`;

const ActivityTime = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textSecondary};
`;

const LandlordDashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 12,
    occupiedUnits: 8,
    availableUnits: 4,
    totalRevenue: 45000,
    pendingBookings: 3,
    maintenanceRequests: 2
  });

  const [recentBookings, setRecentBookings] = useState([
        {
          id: 1,
      tenant: 'John Smith',
      property: 'Cozy Studio in Kigali City Center',
      date: '2024-02-15',
      status: 'approved',
      amount: 120
        },
        {
          id: 2,
      tenant: 'Sarah Johnson',
      property: 'Modern 2BR Apartment in Remera',
      date: '2024-02-14',
      status: 'pending',
      amount: 280
        },
        {
          id: 3,
      tenant: 'Mike Wilson',
      property: 'Luxury Suite in Nyarutarama',
      date: '2024-02-13',
          status: 'rejected',
      amount: 450
    }
      ]);

  const [recentActivity, setRecentActivity] = useState([
        {
          id: 1,
      type: 'booking',
      text: 'New booking request from John Smith',
      time: '2 hours ago'
        },
        {
          id: 2,
      type: 'maintenance',
      text: 'Maintenance request submitted for Unit 3B',
      time: '4 hours ago'
    },
    {
      id: 3,
      type: 'payment',
      text: 'Rent payment received from Sarah Johnson',
      time: '1 day ago'
    },
    {
      id: 4,
      type: 'booking',
      text: 'Booking approved for Mike Wilson',
      time: '2 days ago'
    }
  ]);

  return (
    <DashboardContainer>
      <Header userType="landlord" userInitials="LS" />

      <MainContent>
        <WelcomeSection>
          <WelcomeTitle>Welcome back, Sarah!</WelcomeTitle>
          <WelcomeSubtitle>
            Here's what's happening with your properties today.
          </WelcomeSubtitle>
        </WelcomeSection>

        <StatsGrid>
            <StatCard>
            <StatIcon iconColor="#d1fae5" iconTextColor="#059669">
              🏠
            </StatIcon>
              <StatNumber>{stats.totalProperties}</StatNumber>
              <StatLabel>Total Properties</StatLabel>
            </StatCard>

            <StatCard>
            <StatIcon iconColor="#dbeafe" iconTextColor="#2563eb">
              👥
            </StatIcon>
            <StatNumber>{stats.occupiedUnits}</StatNumber>
            <StatLabel>Occupied Units</StatLabel>
            </StatCard>

            <StatCard>
            <StatIcon iconColor="#fef3c7" iconTextColor="#d97706">
              🔓
            </StatIcon>
            <StatNumber>{stats.availableUnits}</StatNumber>
            <StatLabel>Available Units</StatLabel>
            </StatCard>

            <StatCard>
            <StatIcon iconColor="#f3e8ff" iconTextColor="#7c3aed">
              💰
            </StatIcon>
            <StatNumber>${stats.totalRevenue.toLocaleString()}</StatNumber>
            <StatLabel>Monthly Revenue</StatLabel>
            </StatCard>
        </StatsGrid>

        <ContentGrid>
          <div>
            <RecentBookings>
              <SectionTitle>Recent Booking Requests</SectionTitle>
              {recentBookings.map(booking => (
                <BookingItem key={booking.id}>
                    <BookingAvatar>
                      {booking.tenant.split(' ').map(n => n[0]).join('')}
                    </BookingAvatar>
                    <BookingInfo>
                      <BookingTitle>{booking.tenant}</BookingTitle>
                      <BookingDetails>
                      {booking.property} • ${booking.amount}/month
                      </BookingDetails>
                    </BookingInfo>
                    <BookingStatus status={booking.status}>
                    {booking.status}
                    </BookingStatus>
                  </BookingItem>
              ))}
            </RecentBookings>
          </div>

          <div>
            <QuickActions>
              <SectionTitle>Quick Actions</SectionTitle>
              <Link to="/landlord/add-property" style={{ textDecoration: 'none' }}>
                <ActionButton variant="primary">
                  Add New Property
                </ActionButton>
              </Link>
              <Link to="/landlord/booking-request" style={{ textDecoration: 'none' }}>
                <ActionButton variant="outline">
                  View All Bookings
                </ActionButton>
              </Link>
              <Link to="/landlord/properties" style={{ textDecoration: 'none' }}>
                <ActionButton variant="outline">
                  Manage Properties
                </ActionButton>
              </Link>
              <Link to="/landlord/calendar" style={{ textDecoration: 'none' }}>
                <ActionButton variant="outline">
                  View Calendar
                </ActionButton>
              </Link>
            </QuickActions>

            <RecentActivity>
              <SectionTitle>Recent Activity</SectionTitle>
              {recentActivity.map(activity => (
                <ActivityItem key={activity.id}>
                  <ActivityIcon>
                    {activity.type === 'booking' && '📋'}
                    {activity.type === 'maintenance' && '🔧'}
                    {activity.type === 'payment' && '💰'}
                  </ActivityIcon>
                  <ActivityContent>
                    <ActivityText>{activity.text}</ActivityText>
                    <ActivityTime>{activity.time}</ActivityTime>
                  </ActivityContent>
                </ActivityItem>
              ))}
            </RecentActivity>
          </div>
        </ContentGrid>
      </MainContent>
    </DashboardContainer>
  );
};

export default LandlordDashboard; 