import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaHome,
  FaCheckCircle,
  FaUsers,
  FaTools,
  FaPlus,
  FaFilter,
} from "react-icons/fa";
import { propertiesAPI } from "../../services/api";
import { PROPERTY_TYPES, PROPERTY_STATUS } from "../../constants/propertyEnums";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import LandlordHeader from "../../components/landlord/LandlordHeader";
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
} from "../../components/ui/ThemeProvider";
import ListingCard from "../../components/ui/ListingCard";

const MainContent = styled(ContentContainer)`
  max-width: 1200px;
  padding: ${(props) => props.theme.spacing.xl};
`;

const StatsGrid = styled(ReusableStatsGrid)`
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const StatCard = styled(ReusableStatCard)`
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

const FilterInput = styled.input`
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

  &::placeholder {
    color: ${(props) => props.theme.colors.textSecondary};
  }
`;

const PropertiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${(props) => props.theme.spacing.lg};
`;

const AddPropertyButton = styled(Button)`
  display: flex;
  align-items: center;
  text-decoration: none;
  background: transparent;
  border: 2px solid ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.primary};
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.lg};
  transition: all 0.3s ease-in-out;

  &:hover {
    background: ${(props) => props.theme.colors.primary}10;
    border-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.primary};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${(props) => props.theme.colors.primary}20;
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    margin-right: 8px;
    transition: transform 0.3s ease-in-out;
  }

  &:hover svg {
    animation: spin 0.6s ease-in-out;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LandlordPropertyManagement = () => {
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    location: "",
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    maintenance: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // User authentication handled by LandlordHeader

        // Fetch properties
        const propertiesData = await propertiesAPI.getMyProperties();
        console.log("Properties data:", propertiesData); // Debug log
        setProperties(propertiesData || []);

        // Calculate stats
        if (propertiesData) {
          const total = propertiesData.length;
          const available = propertiesData.filter((p) => p.is_active).length;
          const occupied = propertiesData.filter(
            (p) => !p.is_active && p.status !== "maintenance"
          ).length;
          const maintenance = propertiesData.filter(
            (p) => p.status === "maintenance"
          ).length;

          setStats({ total, available, occupied, maintenance });
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusDisplay = (property) => {
    if (property.status === "maintenance") {
      return { label: "Maintenance", class: "maintenance" };
    }
    return property.is_active
      ? { label: "Available", class: "available" }
      : { label: "Occupied", class: "occupied" };
  };

  const filteredProperties = properties.filter((property) => {
    const statusInfo = getStatusDisplay(property);
    if (filters.status && statusInfo.class !== filters.status) return false;
    if (filters.type && property.property_type !== filters.type) return false;
    if (
      filters.location &&
      !property.address?.toLowerCase().includes(filters.location.toLowerCase())
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

  const statsConfig = [
    {
      title: "Total Properties",
      value: stats.total,
      icon: <FaHome />,
      color: "primary",
    },
    {
      title: "Available",
      value: stats.available,
      icon: <FaCheckCircle />,
      color: "success",
    },
    {
      title: "Occupied",
      value: stats.occupied,
      icon: <FaUsers />,
      color: "warning",
    },
    {
      title: "Maintenance",
      value: stats.maintenance,
      icon: <FaTools />,
      color: "error",
    },
  ];

  if (loading) {
    return (
      <ThemedComponentProvider>
        <PageContainer>
          <LandlordHeader />
          <MainContent>
            <LoadingState>
              <h2>Loading Properties...</h2>
              <p>Please wait while we fetch your properties.</p>
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
            <PageTitle>Property Management</PageTitle>
            <AddPropertyButton as={Link} to="/landlord/add-room">
              <FaPlus />
              Add Property
            </AddPropertyButton>
          </PageHeader>

          <StatsGrid>
            {statsConfig.map((stat, index) => (
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
                  {PROPERTY_STATUS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </FilterSelect>
              </FilterGroup>
              <FilterGroup>
                <FilterLabel>Property Type</FilterLabel>
                <FilterSelect
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
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
            </FiltersGrid>
          </FiltersSection>

          {filteredProperties.length === 0 ? (
            <EmptyState>
              <FaHome
                size={60}
                style={{ marginBottom: "1rem", opacity: 0.3 }}
              />
              <h3>No properties found</h3>
              <p>
                {properties.length === 0
                  ? "You haven't added any properties yet. Click 'Add Property' to get started!"
                  : "No properties match your current filters. Try adjusting your search criteria."}
              </p>
            </EmptyState>
          ) : (
            <PropertiesGrid>
              {filteredProperties.map((property, index) => {
                return (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <ListingCard property={property} />
                  </motion.div>
                );
              })}
            </PropertiesGrid>
          )}
        </MainContent>
      </PageContainer>
    </ThemedComponentProvider>
  );
};

export default LandlordPropertyManagement;
