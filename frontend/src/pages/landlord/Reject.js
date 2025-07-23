import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { FaTimesCircle, FaArrowLeft } from 'react-icons/fa';
import { bookingsAPI } from '../../services/api';
import {
  ThemedComponentProvider,
  PageContainer,
  ContentContainer,
  Card,
  Button,
} from '../../components/ui/ThemeProvider';
import LandlordHeader from '../../components/landlord/LandlordHeader';

const MainContent = styled(ContentContainer)`
  max-width: 800px;
  padding: ${(props) => props.theme.spacing.xl};
`;

const RejectionCard = styled(Card)`
  padding: ${(props) => props.theme.spacing['3xl']};
  text-align: center;
`;

const RejectionHeader = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const RejectionIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.error};
  color: ${(props) => props.theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto ${(props) => props.theme.spacing.lg};
`;

const RejectionTitle = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSizes['3xl']};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const RejectionSubtitle = styled.p`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const BookingDetails = styled.div`
  background-color: ${(props) => props.theme.colors.gray[50]};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  text-align: left;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.spacing.sm} 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.textSecondary};
`;

const DetailValue = styled.span`
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text};
`;

const WarningSection = styled.div`
  background-color: ${(props) => props.theme.colors.warning}20;
  border: 1px solid ${(props) => props.theme.colors.warning};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  text-align: left;
`;

const WarningTitle = styled.div`
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.warning};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`;

const WarningMessage = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
`;

const FormSection = styled.div`
  text-align: left;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const FormGroup = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const FormLabel = styled.label`
  display: block;
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const FormSelect = styled.select`
  width: 100%;
  padding: ${(props) => props.theme.spacing.md};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSizes.md};
  color: ${(props) => props.theme.colors.text};
  background-color: ${(props) => props.theme.colors.surface};
  transition: all ${(props) => props.theme.transitions.normal};
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary}33;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${(props) => props.theme.spacing.md};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSizes.md};
  font-family: inherit;
  color: ${(props) => props.theme.colors.text};
  background-color: ${(props) => props.theme.colors.surface};
  resize: vertical;
  transition: all ${(props) => props.theme.transitions.normal};
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary}33;
  }
  
  &::placeholder {
    color: ${(props) => props.theme.colors.textSecondary};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

const BackButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  background-color: ${(props) => props.theme.colors.gray[500]};
  color: ${(props) => props.theme.colors.white};
  
  &:hover {
    background-color: ${(props) => props.theme.colors.gray[600]};
  }
`;

const RejectButton = styled(Button)`
  background-color: ${(props) => props.theme.colors.error};
  color: ${(props) => props.theme.colors.white};
  
  &:hover {
    background-color: ${(props) => props.theme.colors.errorDark};
  }
`;

const Reject = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [formData, setFormData] = useState({
    reason: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBooking, setIsLoadingBooking] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setIsLoadingBooking(true);
        const bookingData = await bookingsAPI.getById(bookingId);
        setBooking(bookingData);
      } catch (error) {
        console.error('Error fetching booking:', error);
        toast.error('Failed to load booking details');
        navigate('/landlord/bookings');
      } finally {
        setIsLoadingBooking(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId, navigate]);

  const rejectionReasons = [
    'Applicant does not meet income requirements',
    'Poor credit history',
    'Negative rental history',
    'Incomplete application',
    'Property no longer available',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.reason) {
      toast.error('Please select a rejection reason');
      return;
    }
    
    if (!window.confirm('Are you sure you want to reject this booking request?')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Combine reason and message for the rejection
      const rejectionMessage = formData.message 
        ? `${formData.reason}\n\n${formData.message}`
        : formData.reason;
        
      await bookingsAPI.reject(bookingId, rejectionMessage);
      toast.success('Booking request rejected');
      navigate('/landlord/bookings');
    } catch (error) {
      console.error('Rejection error:', error);
      toast.error('Failed to reject booking request');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingBooking) {
    return (
      <ThemedComponentProvider>
        <PageContainer>
          <LandlordHeader />
          <MainContent>
            <div>Loading booking details...</div>
          </MainContent>
        </PageContainer>
      </ThemedComponentProvider>
    );
  }

  if (!booking) {
    return (
      <ThemedComponentProvider>
        <PageContainer>
          <LandlordHeader />
          <MainContent>
            <div>Booking not found</div>
          </MainContent>
        </PageContainer>
      </ThemedComponentProvider>
    );
  }

  return (
    <ThemedComponentProvider>
      <PageContainer>
        <LandlordHeader />
        <MainContent>
          <RejectionCard>
            <RejectionHeader>
              <RejectionIcon>
                <FaTimesCircle />
              </RejectionIcon>
              <RejectionTitle>Reject Booking Request</RejectionTitle>
              <RejectionSubtitle>
                Please provide a reason for rejecting this application
              </RejectionSubtitle>
            </RejectionHeader>

            <BookingDetails>
              <DetailRow>
                <DetailLabel>Property:</DetailLabel>
                <DetailValue>{booking.property_title || 'Property'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Applicant:</DetailLabel>
                <DetailValue>{booking.user_name || 'Applicant'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Move-in Date:</DetailLabel>
                <DetailValue>{booking.move_in_date || 'Not specified'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Lease Duration:</DetailLabel>
                <DetailValue>{booking.lease_duration || 'Not specified'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Monthly Income:</DetailLabel>
                <DetailValue>${booking.monthly_income || 'Not specified'}</DetailValue>
              </DetailRow>
            </BookingDetails>

            <WarningSection>
              <WarningTitle>⚠️ Important</WarningTitle>
              <WarningMessage>
                Rejecting this application will notify the applicant and remove the booking request from your dashboard. 
                This action cannot be undone.
              </WarningMessage>
            </WarningSection>

            <form onSubmit={handleSubmit}>
              <FormSection>
                <FormGroup>
                  <FormLabel htmlFor="reason">Rejection Reason *</FormLabel>
                  <FormSelect
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a reason</option>
                    {rejectionReasons.map(reason => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </FormSelect>
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="message">Additional Message (Optional)</FormLabel>
                  <FormTextarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Provide additional details or feedback for the applicant..."
                  />
                </FormGroup>
              </FormSection>

              <ActionButtons>
                <BackButton
                  as={Link}
                  to="/landlord/bookings"
                  disabled={isLoading}
                >
                  <FaArrowLeft />
                  Back to Requests
                </BackButton>
                <RejectButton
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Rejecting...' : 'Reject Application'}
                </RejectButton>
              </ActionButtons>
            </form>
          </RejectionCard>
        </MainContent>
      </PageContainer>
    </ThemedComponentProvider>
  );
};

export default Reject; 