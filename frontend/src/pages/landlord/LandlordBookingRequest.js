import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaClipboardList,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import LandlordHeader from "../../components/landlord/LandlordHeader";
import { bookingsAPI, getCurrentUser } from "../../services/api";
import { BOOKING_STATUS } from "../../constants/propertyEnums";
import {
  ThemedComponentProvider,
  PageContainer,
  ContentContainer,
  PageTitle,
  PageHeader,
  LoadingState,
  EmptyState,
  StatCard as ReusableStatCard,
  StatsGrid as ReusableStatsGrid,
  StatNumber,
  StatLabel,
  Card,
  Button as ReusableButton,
  Input as ReusableInput,
  Grid,
} from "../../components/ui/ThemeProvider";

const MainContent = styled(ContentContainer)`
  max-width: 1200px;
  padding: ${(props) => props.theme.spacing.xl};
`;

const StatsGrid = styled(ReusableStatsGrid)`
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const StatCard = styled(ReusableStatCard)`
  padding: ${(props) => props.theme.spacing.lg};
  text-align: center;
  transition: all ${(props) => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.lg};
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const StatTitle = styled(StatLabel)`
  text-align: left;
  margin: 0;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  
  &.primary {
    background-color: ${(props) => props.theme.colors.primary}20;
    color: ${(props) => props.theme.colors.primary};
  }
  
  &.success {
    background-color: ${(props) => props.theme.colors.success}20;
    color: ${(props) => props.theme.colors.success};
  }
  
  &.warning {
    background-color: ${(props) => props.theme.colors.warning}20;
    color: ${(props) => props.theme.colors.warning};
  }
  
  &.error {
    background-color: ${(props) => props.theme.colors.error}20;
    color: ${(props) => props.theme.colors.error};
  }
`;

const StatValue = styled(StatNumber)`
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const StatChange = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.textSecondary};
  
  &.positive {
    color: ${(props) => props.theme.colors.success};
  }
  
  &.negative {
    color: ${(props) => props.theme.colors.error};
  }
  
  &.neutral {
    color: ${(props) => props.theme.colors.textSecondary};
  }
`;

const FiltersSection = styled(Card)`
  margin-bottom: ${(props) => props.theme.spacing.xl};
  padding: ${(props) => props.theme.spacing.lg};
`;

const FiltersTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const FiltersGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${(props) => props.theme.spacing.lg};
`;

const FilterGroup = styled.div``;

const FilterLabel = styled.label`
  display: block;
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: ${(props) => props.theme.spacing.sm};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary}20;
  }
`;

const BookingRequestsGrid = styled.div`
  display: grid;
  gap: ${(props) => props.theme.spacing.lg};
`;

const BookingRequestCard = styled(Card)`
  padding: ${(props) => props.theme.spacing.lg};
  transition: all ${(props) => props.theme.transitions.normal};
  
  &:hover {
    box-shadow: ${(props) => props.theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const RequestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const RequestTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text};
  margin: 0 0 ${(props) => props.theme.spacing.xs} 0;
`;

const RequestProperty = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  margin: 0;
`;

const RequestStatus = styled.span`
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  
  &.status-pending {
    background-color: ${(props) => props.theme.colors.warningLight};
    color: ${(props) => props.theme.colors.warningDark};
  }
  
  &.status-approved {
    background-color: ${(props) => props.theme.colors.successLight};
    color: ${(props) => props.theme.colors.successDark};
  }
  
  &.status-rejected {
    background-color: ${(props) => props.theme.colors.errorLight};
    color: ${(props) => props.theme.colors.errorDark};
  }
`;

const RequestDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.xs};
`;

const DetailLabel = styled.span`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.textSecondary};
`;

const DetailValue = styled.span`
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  color: ${(props) => props.theme.colors.text};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
`;

const ApplicantInfo = styled.div`
  background-color: ${(props) => props.theme.colors.gray[50]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const ApplicantHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const ApplicantAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
`;

const ApplicantDetails = styled.div`
  flex: 1;
  
  h4 {
    margin: 0 0 ${(props) => props.theme.spacing.xs} 0;
    color: ${(props) => props.theme.colors.text};
    font-size: ${(props) => props.theme.typography.fontSizes.base};
    font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  }
  
  p {
    margin: 0;
    color: ${(props) => props.theme.colors.textSecondary};
    font-size: ${(props) => props.theme.typography.fontSizes.sm};
  }
`;

const ApplicantStats = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.lg};
`;

const ApplicantStat = styled.div`
  text-align: center;
`;

const ApplicantStatValue = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

const ApplicantStatLabel = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  color: ${(props) => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RequestActions = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
  flex-wrap: wrap;
`;

const ActionButton = styled(ReusableButton)`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  text-decoration: none;
  
  &.view-button {
    background-color: ${(props) => props.theme.colors.gray[500]};
    color: ${(props) => props.theme.colors.white};
    
    &:hover {
      background-color: ${(props) => props.theme.colors.gray[600]};
    }
  }
  
  &.message-button {
    background-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.white};
    
    &:hover {
      background-color: ${(props) => props.theme.colors.primaryDark};
    }
  }
  
  &.approve-button {
    background-color: ${(props) => props.theme.colors.success};
    color: ${(props) => props.theme.colors.white};
    
    &:hover {
      background-color: ${(props) => props.theme.colors.successDark};
    }
  }
  
  &.reject-button {
    background-color: ${(props) => props.theme.colors.error};
    color: ${(props) => props.theme.colors.white};
    
    &:hover {
      background-color: ${(props) => props.theme.colors.errorDark};
    }
  }
`;

const LandlordBookingRequest = () => {
  const [filters, setFilters] = useState({
    status: "",
    property: "",
    dateRange: "",
  });
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        setUser(currentUser);

        const bookingsData = await bookingsAPI.getLandlordApplications();
        console.log("Raw bookings API response:", bookingsData);
        console.log(
          "Type of response:",
          typeof bookingsData,
          "Array?:",
          Array.isArray(bookingsData)
        );

        // Handle different response formats
        let bookingsArray = [];
        if (Array.isArray(bookingsData)) {
          bookingsArray = bookingsData;
        } else if (bookingsData && Array.isArray(bookingsData.data)) {
          bookingsArray = bookingsData.data;
        } else if (bookingsData && Array.isArray(bookingsData.bookings)) {
          bookingsArray = bookingsData.bookings;
        }

        console.log(
          "Final bookings array:",
          bookingsArray,
          "Length:",
          bookingsArray.length
        );
        setBookingRequests(bookingsArray);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        console.log("Error details:", error.response?.data || error.message);
        toast.error("Failed to load booking requests");
        setBookingRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Use only real booking data from backend
  const dataToUse = bookingRequests; // Always use real data, even if empty

  const totalRequests = dataToUse.length;
  const pendingCount = dataToUse.filter(
    (req) => req.status === "pending"
  ).length;
  const approvedCount = dataToUse.filter(
    (req) => req.status === "approved"
  ).length;
  const rejectedCount = dataToUse.filter(
    (req) => req.status === "rejected"
  ).length;

  const stats = [
    {
      title: "Total Requests",
      value: totalRequests.toString(),
      change: "+0",
      changeType: "neutral",
      icon: <FaClipboardList />,
      color: "primary",
    },
    {
      title: "Pending",
      value: pendingCount.toString(),
      change: "+0",
      changeType: "neutral",
      icon: <FaClock />,
      color: "warning",
    },
    {
      title: "Approved",
      value: approvedCount.toString(),
      change: "+0",
      changeType: "positive",
      icon: <FaCheckCircle />,
      color: "success",
    },
    {
      title: "Rejected",
      value: rejectedCount.toString(),
      change: "+0",
      changeType: "neutral",
      icon: <FaTimesCircle />,
      color: "error",
    },
  ];

  const getStatusDisplay = (status) => {
    const statusMap = {
      pending: { label: "Pending Review", class: "status-pending" },
      approved: { label: "Approved", class: "status-approved" },
      rejected: { label: "Rejected", class: "status-rejected" },
    };
    return statusMap[status] || { label: "Unknown", class: "status-pending" };
  };

  // dataToUse is now defined above in stats calculation

  const filteredRequests = dataToUse.filter((request) => {
    if (filters.status && request.status !== filters.status) return false;
    if (
      filters.property &&
      !request.property?.toLowerCase().includes(filters.property.toLowerCase())
    )
      return false;
    return true;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApprove = async (requestId) => {
    if (
      !window.confirm("Are you sure you want to approve this booking request?")
    ) {
      return;
    }

    try {
      await bookingsAPI.approve(requestId);
      toast.success("Booking request approved successfully!");

      // Refresh the data
      const bookingsData = await bookingsAPI.getLandlordApplications();
      setBookingRequests(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (error) {
      console.error("Error approving booking:", error);
      toast.error("Failed to approve booking request");
    }
  };

  const handleReject = async (requestId) => {
    if (
      !window.confirm("Are you sure you want to reject this booking request?")
    ) {
      return;
    }

    try {
      await bookingsAPI.reject(requestId);
      toast.success("Booking request rejected");

      // Refresh the data
      const bookingsData = await bookingsAPI.getLandlordApplications();
      setBookingRequests(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (error) {
      console.error("Error rejecting booking:", error);
      toast.error("Failed to reject booking request");
    }
  };

  return (
    <ThemedComponentProvider>
      <PageContainer>
        <LandlordHeader />
        <MainContent>
          <PageHeader>
            <PageTitle>Booking Requests</PageTitle>
          </PageHeader>

          <StatsGrid>
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <StatCard>
                  <StatHeader>
                    <StatTitle>{stat.title}</StatTitle>
                    <StatIcon className={stat.color}>{stat.icon}</StatIcon>
                  </StatHeader>
                  <StatValue>{stat.value}</StatValue>
                  <StatChange className={stat.changeType}>
                    {stat.changeType === "positive" && "+"}
                    {stat.change} from last week
                  </StatChange>
                </StatCard>
              </motion.div>
            ))}
          </StatsGrid>

          <FiltersSection>
            <FiltersTitle>
              <FaClipboardList />
              Filters
            </FiltersTitle>
            <FiltersGrid>
              <FilterGroup>
                <FilterLabel>Status</FilterLabel>
                <FilterSelect
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  {BOOKING_STATUS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </FilterSelect>
              </FilterGroup>
              <FilterGroup>
                <FilterLabel>Property</FilterLabel>
                <FilterSelect
                  name="property"
                  value={filters.property}
                  onChange={handleFilterChange}
                >
                  <option value="">All Properties</option>
                  <option value="Cozy Studio">Cozy Studio</option>
                  <option value="Modern 2BR">Modern 2BR</option>
                  <option value="Luxury Penthouse">Luxury Penthouse</option>
                </FilterSelect>
              </FilterGroup>
              <FilterGroup>
                <FilterLabel>Date Range</FilterLabel>
                <FilterSelect
                  name="dateRange"
                  value={filters.dateRange}
                  onChange={handleFilterChange}
                >
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </FilterSelect>
              </FilterGroup>
            </FiltersGrid>
          </FiltersSection>

          <BookingRequestsGrid>
            {loading ? (
              <LoadingState>
                <FaSpinner className="loading-spinner" />
                <h2>Loading booking requests...</h2>
                <p>Please wait while we fetch your booking requests.</p>
              </LoadingState>
            ) : filteredRequests.length === 0 ? (
              <EmptyState>
                <FaClipboardList size={60} style={{ marginBottom: "1rem", opacity: 0.3 }} />
                <h3>No booking requests found</h3>
                <p>
                  {filters.status || filters.property
                    ? "No requests match your current filters."
                    : "You don't have any booking requests yet."}
                </p>
              </EmptyState>
            ) : (
              filteredRequests.map((request, index) => {
                const statusInfo = getStatusDisplay(request.status);
                return (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <BookingRequestCard>
                      <RequestHeader>
                        <div>
                          <RequestTitle>
                            {request.title ||
                              `Booking Request from ${
                                request.user_name || "User"
                              }`}
                          </RequestTitle>
                          <RequestProperty>
                            {request.property ||
                              request.property_title ||
                              "Property"}
                          </RequestProperty>
                        </div>
                        <RequestStatus className={statusInfo.class}>
                          {statusInfo.label}
                        </RequestStatus>
                      </RequestHeader>

                      <RequestDetails>
                        <DetailItem>
                          <DetailLabel>Move-in Date</DetailLabel>
                          <DetailValue>
                            {request.moveInDate ||
                              request.check_in_date ||
                              "Not specified"}
                          </DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>Duration</DetailLabel>
                          <DetailValue>
                            {request.duration || "Not specified"}
                          </DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>Monthly Rent</DetailLabel>
                          <DetailValue>
                            {request.rent ||
                              request.total_amount ||
                              "Not specified"}
                          </DetailValue>
                        </DetailItem>
                      </RequestDetails>

                      <ApplicantInfo>
                        <ApplicantHeader>
                          <ApplicantAvatar>
                            {request.applicant?.avatar ||
                              (request.user_name
                                ? request.user_name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                : "U")}
                          </ApplicantAvatar>
                          <ApplicantDetails>
                            <h4>
                              {request.applicant?.name ||
                                request.user_name ||
                                "User"}
                            </h4>
                            <p>
                              {request.applicant?.email ||
                                request.user_email ||
                                "Email not available"}{" "}
                              •{" "}
                              {request.applicant?.phone || "Phone not available"}
                            </p>
                          </ApplicantDetails>
                        </ApplicantHeader>
                        <ApplicantStats>
                          <ApplicantStat>
                            <ApplicantStatValue>
                              {request.applicant?.rating || "N/A"}
                            </ApplicantStatValue>
                            <ApplicantStatLabel>Rating</ApplicantStatLabel>
                          </ApplicantStat>
                          <ApplicantStat>
                            <ApplicantStatValue>
                              {request.applicant?.applications || "1"}
                            </ApplicantStatValue>
                            <ApplicantStatLabel>Applications</ApplicantStatLabel>
                          </ApplicantStat>
                          <ApplicantStat>
                            <ApplicantStatValue>
                              {request.applicant?.verified ? "✓" : "✗"}
                            </ApplicantStatValue>
                            <ApplicantStatLabel>Verified</ApplicantStatLabel>
                          </ApplicantStat>
                        </ApplicantStats>
                      </ApplicantInfo>

                      <RequestActions>
                        <ActionButton
                          as={Link}
                          to={`/landlord/booking/${request.id}`}
                          className="view-button"
                        >
                          View Details
                        </ActionButton>
                        <ActionButton className="message-button">
                          Message
                        </ActionButton>
                        {request.status === "pending" && (
                          <>
                            <ActionButton
                              as={Link}
                              to={`/landlord/approve/${request.id}`}
                              className="approve-button"
                            >
                              Approve
                            </ActionButton>
                            <ActionButton
                              as={Link}
                              to={`/landlord/reject/${request.id}`}
                              className="reject-button"
                            >
                              Reject
                            </ActionButton>
                          </>
                        )}
                      </RequestActions>
                    </BookingRequestCard>
                  </motion.div>
                );
              })
            )}
          </BookingRequestsGrid>
        </MainContent>
      </PageContainer>
    </ThemedComponentProvider>
  );
};

export default LandlordBookingRequest;
