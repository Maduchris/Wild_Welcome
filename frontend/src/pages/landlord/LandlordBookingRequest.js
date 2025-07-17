import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const BookingRequestContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`;

const PageHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.xxxl};
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
  color: ${props => props.isPositive ? props.theme.colors.success : props.theme.colors.error};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const BookingList = styled(Card)`
  padding: ${props => props.theme.spacing.xl};
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
  margin-bottom: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.isActive ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.isActive ? props.theme.colors.white : props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  
  &:hover {
    background: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.surface};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const BookingItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};
  transition: background-color ${props => props.theme.transitions.normal};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.surface};
  }
`;

const BookingAvatar = styled.div`
  width: 50px;
  height: 50px;
  background-color: ${props => props.theme.colors.primaryLight};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  flex-shrink: 0;
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
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
`;

const BookingDate = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textSecondary};
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

const BookingActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const ActionButton = styled(Button)`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSizes.xs};
`;

const Sidebar = styled.div``;

const QuickActions = styled(Card)`
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ActionItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: background-color ${props => props.theme.transitions.normal};
  
  &:hover {
    background-color: ${props => props.theme.colors.surface};
  }
`;

const ActionIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${props => props.theme.colors.primaryLight};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.typography.fontSizes.lg};
`;

const ActionText = styled.div``;

const ActionTitle = styled.h4`
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
`;

const ActionDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const RecentActivity = styled(Card)`
  padding: ${props => props.theme.spacing.xl};
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
  color: ${props => props.theme.colors.white};
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

const LandlordBookingRequest = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [stats] = useState({
    total: 15,
    pending: 8,
    approved: 5,
    rejected: 2
  });

  const [bookings] = useState([
    {
      id: 1,
      tenant: 'John Smith',
      property: 'Cozy Studio in Kigali City Center',
      date: '2024-02-15',
      status: 'pending',
      amount: 120,
      moveInDate: '2024-03-01'
    },
    {
      id: 2,
      tenant: 'Sarah Johnson',
      property: 'Modern 2BR Apartment in Remera',
      date: '2024-02-14',
      status: 'approved',
      amount: 280,
      moveInDate: '2024-02-28'
    },
    {
      id: 3,
      tenant: 'Mike Wilson',
      property: 'Luxury Suite in Nyarutarama',
      date: '2024-02-13',
      status: 'rejected',
      amount: 450,
      moveInDate: '2024-03-15'
    },
    {
      id: 4,
      tenant: 'Emily Davis',
      property: 'Shared Room Near University',
      date: '2024-02-12',
      status: 'pending',
      amount: 90,
      moveInDate: '2024-02-25'
    },
    {
      id: 5,
      tenant: 'David Brown',
      property: 'Garden View Apartment in Gisozi',
      date: '2024-02-11',
      status: 'approved',
      amount: 200,
      moveInDate: '2024-03-01'
    }
  ]);

  const [recentActivity] = useState([
    {
      id: 1,
      type: 'booking',
      text: 'New booking request from John Smith',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'approval',
      text: 'Booking approved for Sarah Johnson',
      time: '4 hours ago'
    },
    {
      id: 3,
      type: 'rejection',
      text: 'Booking rejected for Mike Wilson',
      time: '1 day ago'
    },
    {
      id: 4,
      type: 'booking',
      text: 'New booking request from Emily Davis',
      time: '2 days ago'
    }
  ]);

  const filteredBookings = activeFilter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === activeFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#198754';
      case 'pending':
        return '#FFC107';
      case 'rejected':
        return '#DC3545';
      default:
        return '#6C757D';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return '✓';
      case 'pending':
        return '⏳';
      case 'rejected':
        return '✗';
      default:
        return '📋';
    }
  };

  return (
    <BookingRequestContainer>
      <Header userType="landlord" userInitials="LS" />
      
      <MainContent>
        <PageHeader>
          <PageTitle>Booking Requests</PageTitle>
          <PageSubtitle>
            Manage and review all incoming booking requests from potential tenants.
          </PageSubtitle>
        </PageHeader>

        <StatsGrid>
          <StatCard>
            <StatIcon iconColor="#6C757D">📋</StatIcon>
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Total Requests</StatLabel>
            <StatChange isPositive={true}>+3 from last week</StatChange>
          </StatCard>
          
          <StatCard>
            <StatIcon iconColor="#FFC107">⏳</StatIcon>
            <StatNumber>{stats.pending}</StatNumber>
            <StatLabel>Pending</StatLabel>
            <StatChange isPositive={true}>+2 from last week</StatChange>
          </StatCard>
          
          <StatCard>
            <StatIcon iconColor="#198754">✓</StatIcon>
            <StatNumber>{stats.approved}</StatNumber>
            <StatLabel>Approved</StatLabel>
            <StatChange isPositive={true}>+1 from last week</StatChange>
          </StatCard>
          
          <StatCard>
            <StatIcon iconColor="#DC3545">✗</StatIcon>
            <StatNumber>{stats.rejected}</StatNumber>
            <StatLabel>Rejected</StatLabel>
            <StatChange isPositive={false}>-1 from last week</StatChange>
          </StatCard>
        </StatsGrid>

        <ContentGrid>
          <BookingList>
            <SectionTitle>Recent Booking Requests</SectionTitle>
            
            <FilterBar>
              <FilterButton 
                isActive={activeFilter === 'all'}
                onClick={() => setActiveFilter('all')}
              >
                All ({bookings.length})
              </FilterButton>
              <FilterButton 
                isActive={activeFilter === 'pending'}
                onClick={() => setActiveFilter('pending')}
              >
                Pending ({bookings.filter(b => b.status === 'pending').length})
              </FilterButton>
              <FilterButton 
                isActive={activeFilter === 'approved'}
                onClick={() => setActiveFilter('approved')}
              >
                Approved ({bookings.filter(b => b.status === 'approved').length})
              </FilterButton>
              <FilterButton 
                isActive={activeFilter === 'rejected'}
                onClick={() => setActiveFilter('rejected')}
              >
                Rejected ({bookings.filter(b => b.status === 'rejected').length})
              </FilterButton>
            </FilterBar>

            {filteredBookings.map(booking => (
              <BookingItem key={booking.id}>
                <BookingAvatar>
                  {booking.tenant.split(' ').map(n => n[0]).join('')}
                </BookingAvatar>
                <BookingInfo>
                  <BookingTitle>{booking.tenant}</BookingTitle>
                  <BookingDetails>
                    {booking.property} • ${booking.amount}/month
                  </BookingDetails>
                  <BookingDate>
                    Move-in: {new Date(booking.moveInDate).toLocaleDateString()}
                  </BookingDate>
                </BookingInfo>
                <BookingStatus status={booking.status}>
                  {booking.status}
                </BookingStatus>
                <BookingActions>
                  <ActionButton variant="outline" size="sm">
                    View
                  </ActionButton>
                  {booking.status === 'pending' && (
                    <>
                      <ActionButton variant="primary" size="sm">
                          Approve
                      </ActionButton>
                      <ActionButton variant="outline" size="sm" color="error">
                          Reject
                      </ActionButton>
                      </>
                    )}
                </BookingActions>
              </BookingItem>
            ))}
          </BookingList>

          <Sidebar>
            <QuickActions>
              <SectionTitle>Quick Actions</SectionTitle>
              <ActionItem>
                <ActionIcon>📊</ActionIcon>
                <ActionText>
                  <ActionTitle>View Analytics</ActionTitle>
                  <ActionDescription>Detailed booking statistics</ActionDescription>
                </ActionText>
              </ActionItem>
              <ActionItem>
                <ActionIcon>⚙️</ActionIcon>
                <ActionText>
                  <ActionTitle>Settings</ActionTitle>
                  <ActionDescription>Booking preferences</ActionDescription>
                </ActionText>
              </ActionItem>
              <ActionItem>
                <ActionIcon>📧</ActionIcon>
                <ActionText>
                  <ActionTitle>Notifications</ActionTitle>
                  <ActionDescription>Email and push alerts</ActionDescription>
                </ActionText>
              </ActionItem>
            </QuickActions>

            <RecentActivity>
              <SectionTitle>Recent Activity</SectionTitle>
              {recentActivity.map(activity => (
                <ActivityItem key={activity.id}>
                  <ActivityIcon>
                    {activity.type === 'booking' && '📋'}
                    {activity.type === 'approval' && '✓'}
                    {activity.type === 'rejection' && '✗'}
                  </ActivityIcon>
                  <ActivityContent>
                    <ActivityText>{activity.text}</ActivityText>
                    <ActivityTime>{activity.time}</ActivityTime>
                  </ActivityContent>
                </ActivityItem>
              ))}
            </RecentActivity>
          </Sidebar>
        </ContentGrid>
      </MainContent>
    </BookingRequestContainer>
  );
};

export default LandlordBookingRequest; 