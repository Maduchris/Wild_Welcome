import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import toast from "react-hot-toast";
import { FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import { bookingsAPI } from "../../services/api";
import {
  ThemedComponentProvider,
  PageContainer,
  ContentContainer,
  Card,
  Button,
} from "../../components/ui/ThemeProvider";
import LandlordHeader from "../../components/landlord/LandlordHeader";

const MainContent = styled(ContentContainer)`
  max-width: 800px;
  padding: ${(props) => props.theme.spacing.xl};
`;

const ApprovalCard = styled(Card)`
  padding: ${(props) => props.theme.spacing["3xl"]};
  text-align: center;
`;

const ApprovalHeader = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const ApprovalIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.success};
  color: ${(props) => props.theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto ${(props) => props.theme.spacing.lg};
`;

const ApprovalTitle = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSizes["3xl"]};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const ApprovalSubtitle = styled.p`
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

const MessageSection = styled.div`
  text-align: left;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const MessageLabel = styled.label`
  display: block;
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const MessageTextarea = styled.textarea`
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

const ApproveButton = styled(Button)`
  background-color: ${(props) => props.theme.colors.success};
  color: ${(props) => props.theme.colors.white};

  &:hover {
    background-color: ${(props) => props.theme.colors.successDark};
  }
`;

const Approve = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBooking, setIsLoadingBooking] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setIsLoadingBooking(true);
        const bookingData = await bookingsAPI.getById(bookingId);
        setBooking(bookingData);
      } catch (error) {
        console.error("Error fetching booking:", error);
        toast.error("Failed to load booking details");
        navigate("/landlord/bookings");
      } finally {
        setIsLoadingBooking(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId, navigate]);

  const handleApprove = async () => {
    if (
      !window.confirm("Are you sure you want to approve this booking request?")
    ) {
      return;
    }

    setIsLoading(true);
    try {
      await bookingsAPI.approve(bookingId, message);
      toast.success("Booking request approved successfully!");
      navigate("/landlord/bookings");
    } catch (error) {
      console.error("Error approving booking:", error);
      toast.error("Failed to approve booking request");
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
          <ApprovalCard>
            <ApprovalHeader>
              <ApprovalIcon>
                <FaCheckCircle />
              </ApprovalIcon>
              <ApprovalTitle>Approve Booking Request</ApprovalTitle>
              <ApprovalSubtitle>
                You're about to approve this booking application
              </ApprovalSubtitle>
            </ApprovalHeader>

            <BookingDetails>
              <DetailRow>
                <DetailLabel>Property:</DetailLabel>
                <DetailValue>
                  {booking.property_title || "Property"}
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Applicant:</DetailLabel>
                <DetailValue>{booking.user_name || "Applicant"}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Move-in Date:</DetailLabel>
                <DetailValue>
                  {booking.move_in_date || "Not specified"}
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Lease Duration:</DetailLabel>
                <DetailValue>
                  {booking.lease_duration || "Not specified"}
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Monthly Income:</DetailLabel>
                <DetailValue>
                  ${booking.monthly_income || "Not specified"}
                </DetailValue>
              </DetailRow>
            </BookingDetails>

            <MessageSection>
              <MessageLabel htmlFor="approvalMessage">
                Approval Message (Optional)
              </MessageLabel>
              <MessageTextarea
                id="approvalMessage"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a welcome message or any additional information for the tenant..."
              />
            </MessageSection>

            <ActionButtons>
              <BackButton
                as={Link}
                to="/landlord/bookings"
                disabled={isLoading}
              >
                <FaArrowLeft />
                Back to Requests
              </BackButton>
              <ApproveButton onClick={handleApprove} disabled={isLoading}>
                {isLoading ? "Approving..." : "Approve Application"}
              </ApproveButton>
            </ActionButtons>
          </ApprovalCard>
        </MainContent>
      </PageContainer>
    </ThemedComponentProvider>
  );
};

export default Approve;
