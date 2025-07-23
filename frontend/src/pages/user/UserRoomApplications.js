import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaUser,
  FaSpinner
} from 'react-icons/fa';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import UserHeader from '../../components/user/UserHeader';
import { ThemedComponentProvider } from '../../components/ui/ThemeProvider';
import { bookingsAPI, getCurrentUser } from '../../services/api';

const ApplicationsContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`;

const PageHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes['3xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const PageSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  color: ${props => props.theme.colors.textSecondary};
`;

const TabsContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const TabsList = styled.div`
  display: flex;
  gap: 0;
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  border: none;
  background: none;
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  top: 2px;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  .count {
    margin-left: 0.5rem;
    background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.gray[300]};
    color: ${props => props.active ? 'white' : props.theme.colors.text};
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: ${props => props.theme.typography.fontSizes.xs};
  }
`;

const ApplicationsGrid = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.lg};
`;

const ApplicationCard = styled(Card)`
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const ApplicationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.sm};
  }
`;

const ApplicationInfo = styled.div`
  flex: 1;
`;

const ApplicationTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ApplicationLocation = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StatusBadge = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  
  &.status-pending {
    background-color: ${props => props.theme.colors.warningLight};
    color: ${props => props.theme.colors.warningDark};
  }
  
  &.status-approved {
    background-color: ${props => props.theme.colors.successLight};
    color: ${props => props.theme.colors.successDark};
  }
  
  &.status-rejected {
    background-color: ${props => props.theme.colors.errorLight};
    color: ${props => props.theme.colors.errorDark};
  }
  
  &.status-withdrawn {
    background-color: ${props => props.theme.colors.gray[100]};
    color: ${props => props.theme.colors.gray[600]};
  }
`;

const ApplicationDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  
  .icon {
    color: ${props => props.theme.colors.primary};
  }
  
  .label {
    font-size: ${props => props.theme.typography.fontSizes.sm};
    color: ${props => props.theme.colors.textSecondary};
  }
  
  .value {
    font-weight: ${props => props.theme.typography.fontWeights.medium};
    color: ${props => props.theme.colors.text};
  }
`;

const ApplicationActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing.xxxl};
  color: ${props => props.theme.colors.textSecondary};
  
  .loading-icon {
    animation: spin 1s linear infinite;
    margin-right: ${props => props.theme.spacing.md};
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxxl};
  color: ${props => props.theme.colors.textSecondary};
  
  .empty-icon {
    font-size: 64px;
    margin-bottom: ${props => props.theme.spacing.lg};
    opacity: 0.5;
  }
  
  h3 {
    font-size: ${props => props.theme.typography.fontSizes.xl};
    margin-bottom: ${props => props.theme.spacing.md};
    color: ${props => props.theme.colors.text};
  }
  
  p {
    margin-bottom: ${props => props.theme.spacing.lg};
  }
`;

const UserRoomApplications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        console.log('Fetching user bookings...');
        console.log('Current user:', getCurrentUser());
        
        const data = await bookingsAPI.getUserBookings();
        console.log('User applications data:', data);
        console.log('Number of applications:', data?.length || 0);
        
        setApplications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching applications:', error);
        console.error('Error details:', error.response?.data);
        toast.error('Failed to load your applications');
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock />;
      case 'approved':
        return <FaCheckCircle />;
      case 'rejected':
        return <FaTimesCircle />;
      case 'withdrawn':
        return <FaTimesCircle />;
      default:
        return <FaClock />;
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'withdrawn':
        return 'Withdrawn';
      default:
        return 'Unknown';
    }
  };

  const filteredApplications = applications.filter(app => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  const getTabCounts = () => {
    const counts = {
      all: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
    };
    return counts;
  };

  const counts = getTabCounts();

  const viewProperty = (propertyId) => {
    navigate(`/user/listing/${propertyId}`);
  };

  if (loading) {
    return (
      <ThemedComponentProvider>
        <ApplicationsContainer>
          <UserHeader />
          <MainContent>
            <LoadingState>
              <FaSpinner className="loading-icon" />
              Loading your applications...
            </LoadingState>
          </MainContent>
        </ApplicationsContainer>
      </ThemedComponentProvider>
    );
  }

  return (
    <ThemedComponentProvider>
      <ApplicationsContainer>
        <UserHeader />
      <MainContent>
        <PageHeader>
          <PageTitle>
            <FaClipboardList style={{ color: '#3b82f6' }} />
            My Applications
          </PageTitle>
          <PageSubtitle>
            Track the status of your property applications and bookings.
          </PageSubtitle>
        </PageHeader>

        <TabsContainer>
          <TabsList>
            <Tab 
              active={activeTab === 'all'} 
              onClick={() => setActiveTab('all')}
            >
              All Applications
              <span className="count">{counts.all}</span>
            </Tab>
            <Tab 
              active={activeTab === 'pending'} 
              onClick={() => setActiveTab('pending')}
            >
              Pending
              <span className="count">{counts.pending}</span>
            </Tab>
            <Tab 
              active={activeTab === 'approved'} 
              onClick={() => setActiveTab('approved')}
            >
              Approved
              <span className="count">{counts.approved}</span>
            </Tab>
            <Tab 
              active={activeTab === 'rejected'} 
              onClick={() => setActiveTab('rejected')}
            >
              Rejected
              <span className="count">{counts.rejected}</span>
            </Tab>
          </TabsList>
        </TabsContainer>

        {filteredApplications.length === 0 ? (
          <EmptyState>
            <div className="empty-icon">
              <FaClipboardList />
            </div>
            <h3>
              {activeTab === 'all' 
                ? 'No applications yet'
                : `No ${activeTab} applications`
              }
            </h3>
            <p>
              {activeTab === 'all'
                ? 'Start browsing properties and submit applications to see them here.'
                : `You don't have any ${activeTab} applications at the moment.`
              }
            </p>
            {activeTab === 'all' && (
              <Button as={Link} to="/user/search">
                Browse Properties
              </Button>
            )}
          </EmptyState>
        ) : (
          <ApplicationsGrid>
            {filteredApplications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ApplicationCard>
                  <ApplicationHeader>
                    <ApplicationInfo>
                      <ApplicationTitle>
                        {application.property_title || application.title || 'Property Application'}
                      </ApplicationTitle>
                      <ApplicationLocation>
                        <FaMapMarkerAlt />
                        {application.property_location || application.location || 'Location not available'}
                      </ApplicationLocation>
                    </ApplicationInfo>
                    <StatusBadge className={`status-${application.status}`}>
                      {getStatusIcon(application.status)}
                      {getStatusDisplay(application.status)}
                    </StatusBadge>
                  </ApplicationHeader>

                  <ApplicationDetails>
                    <DetailItem>
                      <FaCalendarAlt className="icon" />
                      <div>
                        <div className="label">Applied Date</div>
                        <div className="value">
                          {application.created_at 
                            ? new Date(application.created_at).toLocaleDateString()
                            : 'N/A'
                          }
                        </div>
                      </div>
                    </DetailItem>
                    
                    <DetailItem>
                      <FaCalendarAlt className="icon" />
                      <div>
                        <div className="label">Check-in Date</div>
                        <div className="value">
                          {application.check_in 
                            ? new Date(application.check_in).toLocaleDateString()
                            : 'N/A'
                          }
                        </div>
                      </div>
                    </DetailItem>

                    <DetailItem>
                      <FaDollarSign className="icon" />
                      <div>
                        <div className="label">Total Price</div>
                        <div className="value">
                          ${application.total_price || 'N/A'}
                        </div>
                      </div>
                    </DetailItem>

                    <DetailItem>
                      <FaUser className="icon" />
                      <div>
                        <div className="label">Landlord</div>
                        <div className="value">
                          {application.landlord_name || 'N/A'}
                        </div>
                      </div>
                    </DetailItem>
                  </ApplicationDetails>

                  <ApplicationActions>
                    <Button 
                      variant="outline" 
                      onClick={() => viewProperty(application.property_id)}
                    >
                      <FaEye /> View Property
                    </Button>
                    
                    {application.status === 'pending' && (
                      <Button variant="outline" disabled>
                        <FaClock /> Awaiting Response
                      </Button>
                    )}
                    
                    {application.status === 'approved' && (
                      <Button variant="primary">
                        <FaCheckCircle /> View Booking Details
                      </Button>
                    )}
                  </ApplicationActions>
                </ApplicationCard>
              </motion.div>
            ))}
          </ApplicationsGrid>
        )}
      </MainContent>
    </ApplicationsContainer>
    </ThemedComponentProvider>
  );
};

export default UserRoomApplications;