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
  FaFilter,
  FaCalendarAlt,
  FaHome,
  FaDollarSign,
  FaEnvelope,
  FaPhone,
  FaStar,
  FaEye,
  FaCommentDots,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import LandlordHeader from "../../components/landlord/LandlordHeader";
import { bookingsAPI, getCurrentUser } from "../../services/api";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import {
  ThemedComponentProvider,
  PageContainer,
  ContentContainer,
  PageTitle,
  PageHeader,
  LoadingState,
  EmptyState,
} from "../../components/ui/ThemeProvider";

const MainContent = styled(ContentContainer)`
  max-width: 1200px;
  padding: ${(props) => props.theme.spacing.xl};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const StatCard = styled(Card)`
  padding: 1.5rem;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.lg};
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const StatTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.textSecondary};
  margin: 0;
  text-align: left;
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

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin: 0;
`;

const StatChange = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-top: 0.25rem;

  &.positive {
    color: ${(props) => props.theme.colors.success};
  }

  &.negative {
    color: ${(props) => props.theme.colors.error};
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

const FiltersGrid = styled.div`
  display: grid;
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

const RequestsGrid = styled.div`
  display: grid;
  gap: ${(props) => props.theme.spacing.lg};
`;

const RequestCard = styled(Card).withConfig({
  shouldForwardProp: (prop) =>
    !["initial", "animate", "transition"].includes(prop),
})`
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

const RequestInfo = styled.div`
  flex: 1;
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

const StatusBadge = styled.span`
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};

  &.pending {
    background-color: ${(props) => props.theme.colors.warningLight};
    color: ${(props) => props.theme.colors.warningDark};
  }
  &.approved {
    background-color: ${(props) => props.theme.colors.successLight};
    color: ${(props) => props.theme.colors.successDark};
  }
  &.rejected {
    background-color: ${(props) => props.theme.colors.errorLight};
    color: ${(props) => props.theme.colors.errorDark};
  }
`;

const RequestDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  padding: ${(props) => props.theme.spacing.lg};
  background-color: ${(props) => props.theme.colors.surfaceAlt};
  border-radius: ${(props) => props.theme.borderRadius.md};
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
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.text};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
`;

const ApplicantInfo = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const ApplicantHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const ApplicantAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
`;

const ApplicantDetails = styled.div`
  flex: 1;
`;

const ApplicantName = styled.h4`
  font-size: ${(props) => props.theme.typography.fontSizes.md};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text};
  margin: 0 0 ${(props) => props.theme.spacing.xs} 0;
`;

const ApplicantContact = styled.p`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.textSecondary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
`;

const ApplicantStats = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.lg};
`;

const ApplicantStat = styled.div`
  text-align: center;
`;

const ApplicantStatValue = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.md};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.text};
`;

const ApplicantStatLabel = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  color: ${(props) => props.theme.colors.textSecondary};
`;

const RequestActions = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
  flex-wrap: wrap;
`;

const ActionButton = styled(Button)`
  flex: 1;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.xs};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
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

        // Handle different response formats
        let bookingsArray = [];
        if (Array.isArray(bookingsData)) {
          bookingsArray = bookingsData;
        } else if (bookingsData && Array.isArray(bookingsData.data)) {
          bookingsArray = bookingsData.data;
        } else if (bookingsData && Array.isArray(bookingsData.bookings)) {
          bookingsArray = bookingsData.bookings;
        }

        console.log("Final bookings array:", bookingsArray);
        setBookingRequests(bookingsArray);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load booking requests");
        setBookingRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const dataToUse = bookingRequests;

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
      change: "+0 from last week",
      changeType: "neutral",
      icon: <FaClipboardList />,
      color: "primary",
    },
    {
      title: "Pending",
      value: pendingCount.toString(),
      change: "+0 from last week",
      changeType: "neutral",
      icon: <FaClock />,
      color: "warning",
    },
    {
      title: "Approved",
      value: approvedCount.toString(),
      change: "+0 from last week",
      changeType: "positive",
      icon: <FaCheckCircle />,
      color: "success",
    },
    {
      title: "Rejected",
      value: rejectedCount.toString(),
      change: "+0 from last week",
      changeType: "neutral",
      icon: <FaTimesCircle />,
      color: "error",
    },
  ];

  const getStatusDisplay = (status) => {
    const statusMap = {
      pending: { label: "Pending Review", class: "pending" },
      approved: { label: "Approved", class: "approved" },
      rejected: { label: "Rejected", class: "rejected" },
    };
    return statusMap[status] || { label: "Unknown", class: "pending" };
  };

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

  if (loading) {
    return (
      <ThemedComponentProvider>
        <PageContainer>
          <LandlordHeader />
          <MainContent>
            <LoadingState>
              <FaSpinner className="spinner" />
              <h2>Loading Booking Requests...</h2>
              <p>Please wait while we fetch your booking requests.</p>
            </LoadingState>
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
                    {stat.change}
                  </StatChange>
                </StatCard>
              </motion.div>
            ))}
          </StatsGrid>

          <FiltersSection>
            <FiltersTitle>
              <FaFilter />
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
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
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

          {filteredRequests.length === 0 ? (
            <EmptyState>
              <FaClipboardList
                size={60}
                style={{ marginBottom: "1rem", opacity: 0.3 }}
              />
              <h3>No booking requests found</h3>
              <p>
                {bookingRequests.length === 0
                  ? "You don't have any booking requests yet."
                  : "No requests match your current filters. Try adjusting your search criteria."}
              </p>
            </EmptyState>
          ) : (
            <RequestsGrid>
              {filteredRequests.map((request, index) => {
                const statusInfo = getStatusDisplay(request.status);
                return (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <RequestCard>
                      <RequestHeader>
                        <RequestInfo>
                          <RequestTitle>
                            {request.title ||
                              `Booking Request from ${
                                request.user_name || "User"
                              }`}
                          </RequestTitle>
                          <RequestProperty>
                            <FaHome style={{ marginRight: "8px" }} />
                            {request.property ||
                              request.property_title ||
                              "Property"}
                          </RequestProperty>
                        </RequestInfo>
                        <StatusBadge className={statusInfo.class}>
                          {statusInfo.label}
                        </StatusBadge>
                      </RequestHeader>

                      <RequestDetails>
                        <DetailItem>
                          <DetailLabel>
                            <FaCalendarAlt
                              style={{ marginRight: "6px", opacity: 0.7 }}
                            />
                            Move-in Date
                          </DetailLabel>
                          <DetailValue>
                            {request.moveInDate ||
                              request.check_in_date ||
                              "Not specified"}
                          </DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>
                            <FaClock
                              style={{ marginRight: "6px", opacity: 0.7 }}
                            />
                            Duration
                          </DetailLabel>
                          <DetailValue>
                            {request.duration || "Not specified"}
                          </DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>
                            <FaDollarSign
                              style={{ marginRight: "6px", opacity: 0.7 }}
                            />
                            Monthly Rent
                          </DetailLabel>
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
                            <ApplicantName>
                              {request.applicant?.name ||
                                request.user_name ||
                                "User"}
                            </ApplicantName>
                            <ApplicantContact>
                              <span>
                                <FaEnvelope
                                  style={{ marginRight: "4px", opacity: 0.7 }}
                                />
                                {request.applicant?.email ||
                                  request.user_email ||
                                  "Email not available"}
                              </span>
                              <span>
                                <FaPhone
                                  style={{ marginRight: "4px", opacity: 0.7 }}
                                />
                                {request.applicant?.phone ||
                                  "Phone not available"}
                              </span>
                            </ApplicantContact>
                          </ApplicantDetails>
                        </ApplicantHeader>
                        <ApplicantStats>
                          <ApplicantStat>
                            <ApplicantStatValue>
                              <FaStar
                                style={{ marginRight: "4px", opacity: 0.7 }}
                              />
                              {request.applicant?.rating || "N/A"}
                            </ApplicantStatValue>
                            <ApplicantStatLabel>Rating</ApplicantStatLabel>
                          </ApplicantStat>
                          <ApplicantStat>
                            <ApplicantStatValue>
                              {request.applicant?.applications || "1"}
                            </ApplicantStatValue>
                            <ApplicantStatLabel>
                              Applications
                            </ApplicantStatLabel>
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
                          variant="secondary"
                          size="sm"
                        >
                          <FaEye />
                          View Details
                        </ActionButton>
                        <ActionButton variant="outline" size="sm">
                          <FaCommentDots />
                          Message
                        </ActionButton>
                        {request.status === "pending" && (
                          <>
                            <ActionButton
                              onClick={() => handleApprove(request.id)}
                              variant="success"
                              size="sm"
                            >
                              <FaCheck />
                              Approve
                            </ActionButton>
                            <ActionButton
                              onClick={() => handleReject(request.id)}
                              variant="danger"
                              size="sm"
                            >
                              <FaTimes />
                              Reject
                            </ActionButton>
                          </>
                        )}
                      </RequestActions>
                    </RequestCard>
                  </motion.div>
                );
              })}
            </RequestsGrid>
          )}
        </MainContent>
      </PageContainer>
    </ThemedComponentProvider>
  );
};

export default LandlordBookingRequest;
