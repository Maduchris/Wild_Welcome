import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaHome,
  FaCamera,
  FaUpload,
  FaTimes,
  FaCheck,
  FaWifi,
  FaUtensils,
  FaBath,
  FaBuilding,
  FaCar,
  FaDumbbell,
  FaSwimmingPool,
  FaTshirt,
  FaSnowflake,
  FaFire,
  FaCouch,
  FaDog,
  FaBan,
  FaShieldAlt,
  FaSave,
  FaEye,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaDollarSign,
} from "react-icons/fa";
import { propertiesAPI, getCurrentUser } from "../../services/api";
import LandlordHeader from "../../components/landlord/LandlordHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import TextArea from "../../components/ui/TextArea";
import {
  FormGroup,
  FormRow,
  FormSection,
  FormSectionTitle,
} from "../../components/ui/FormComponents";
import {
  ThemedComponentProvider,
  PageContainer,
  ContentContainer,
  PageTitle,
  PageHeader,
} from "../../components/ui/ThemeProvider";

const MainContent = styled(ContentContainer)`
  max-width: 800px;
  padding: ${(props) => props.theme.spacing.xl};
`;

const HeaderWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing.xl};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const BackButton = styled(Button)`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    position: static;
    transform: none;
    margin-bottom: ${(props) => props.theme.spacing.lg};
  }
`;

const PageTitleWrapper = styled.div`
  text-align: center;
`;

const PageSubtitle = styled.p`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  color: ${(props) => props.theme.colors.textSecondary};
  margin: ${(props) => props.theme.spacing.sm} 0 0 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.xl};
`;

const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${(props) => props.theme.spacing.md};
`;

const AmenityItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.md};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.normal};
  background-color: ${(props) => props.theme.colors.surface};

  &.selected {
    border-color: ${(props) => props.theme.colors.primary};
    background-color: ${(props) => props.theme.colors.primary}10;
  }

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const AmenityIcon = styled.div`
  color: ${(props) =>
    props.selected
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  font-size: 18px;
`;

const AmenityLabel = styled.span`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) =>
    props.selected ? props.theme.colors.primary : props.theme.colors.text};
`;

const CheckIcon = styled(FaCheck)`
  margin-left: auto;
  color: ${(props) => props.theme.colors.primary};
`;

const ImageUploadSection = styled.div`
  border: 2px dashed ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.xxxl};
  text-align: center;
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.normal};
  background-color: ${(props) => props.theme.colors.surface};

  &:hover,
  &.drag-over {
    border-color: ${(props) => props.theme.colors.primary};
    background-color: ${(props) => props.theme.colors.primary}10;
  }
`;

const UploadIcon = styled.div`
  font-size: 48px;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const UploadText = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const UploadHint = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.textSecondary};
`;

const HiddenInput = styled.input`
  display: none;
`;

const ImagePreview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${(props) => props.theme.spacing.md};
  margin-top: ${(props) => props.theme.spacing.lg};
`;

const PreviewItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.surface};
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid ${(props) => props.theme.colors.surface};
  background-color: ${(props) => props.theme.colors.error};
  color: ${(props) => props.theme.colors.surface};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 10;

  &:hover {
    background-color: ${(props) => props.theme.colors.errorDark};
    transform: scale(1.1);
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  justify-content: flex-end;
  padding: ${(props) => props.theme.spacing.xl};
  border-top: 1px solid ${(props) => props.theme.colors.border};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column-reverse;
  }
`;

const AddRoom = () => {
  const navigate = useNavigate();
  const { id: propertyId } = useParams();
  const isEditMode = !!propertyId;
  const [, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    property_type: "room",
    bedrooms: 1,
    bathrooms: 1,
    area: "",
    rent_amount: "",
    security_deposit: "",
    available_from: "",
    lease_term: "",
    location: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    amenities: [],
    utilities: "",
    is_active: true,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const availableAmenities = [
    { key: "wifi", label: "WiFi", icon: <FaWifi /> },
    { key: "kitchen", label: "Kitchen Access", icon: <FaUtensils /> },
    { key: "bathroom", label: "Private Bathroom", icon: <FaBath /> },
    { key: "elevator", label: "Elevator", icon: <FaBuilding /> },
    { key: "parking", label: "Parking", icon: <FaCar /> },
    { key: "gym", label: "Gym/Fitness", icon: <FaDumbbell /> },
    { key: "pool", label: "Swimming Pool", icon: <FaSwimmingPool /> },
    { key: "laundry", label: "Laundry", icon: <FaTshirt /> },
    { key: "ac", label: "Air Conditioning", icon: <FaSnowflake /> },
    { key: "heating", label: "Heating", icon: <FaFire /> },
    { key: "furnished", label: "Furnished", icon: <FaCouch /> },
    { key: "pets", label: "Pets Allowed", icon: <FaDog /> },
    { key: "no_smoking", label: "No Smoking", icon: <FaBan /> },
    { key: "security", label: "Security System", icon: <FaShieldAlt /> },
  ];

  useEffect(() => {
    const initializeUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    };

    const loadPropertyData = async () => {
      if (isEditMode) {
        try {
          const propertyData = await propertiesAPI.getById(propertyId);
          setFormData({
            title: propertyData.title || "",
            description: propertyData.description || "",
            property_type: propertyData.property_type || "room",
            bedrooms: propertyData.bedrooms || 1,
            bathrooms: propertyData.bathrooms || 1,
            area: propertyData.area || "",
            rent_amount: propertyData.rent_amount || "",
            security_deposit: propertyData.security_deposit || "",
            available_from: propertyData.available_from || "",
            lease_term: propertyData.lease_term || "",
            location: propertyData.location || "",
            address: propertyData.address || "",
            city: propertyData.city || "",
            state: propertyData.state || "",
            zip_code: propertyData.zip_code || "",
            amenities: propertyData.amenities || [],
            utilities: propertyData.utilities || "",
            is_active:
              propertyData.is_active !== undefined
                ? propertyData.is_active
                : true,
          });
          setImages(propertyData.images || []);
        } catch (error) {
          console.error("Error loading property:", error);
          toast.error("Failed to load property data");
        }
      }
    };

    initializeUser();
    loadPropertyData();
  }, [isEditMode, propertyId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleAmenityToggle = (amenityKey) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityKey)
        ? prev.amenities.filter((a) => a !== amenityKey)
        : [...prev.amenities, amenityKey],
    }));
  };

  const handleImageUpload = (files) => {
    const fileArray = Array.from(files);
    const newImages = fileArray.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isNew: true,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Property title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.rent_amount)
      newErrors.rent_amount = "Monthly rent is required";
    if (!formData.available_from)
      newErrors.available_from = "Available from date is required";
    if (typeof formData.location !== "string" || !formData.location.trim())
      newErrors.location = "Location is required";
    if (!formData.address.trim())
      newErrors.address = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zip_code.trim()) newErrors.zip_code = "ZIP code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (publish = false) => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const propertyData = {
        ...formData,
        is_active: publish,
        price_per_night: parseFloat(formData.rent_amount) || 0,
        max_guests: parseInt(formData.bedrooms) || 1,
      };

      if (isEditMode) {
        await propertiesAPI.update(propertyId, propertyData);
      } else {
        await propertiesAPI.create(propertyData);
      }

      toast.success(
        isEditMode
          ? "Property updated successfully!"
          : "Property created successfully!"
      );
      navigate("/landlord/property-management");
    } catch (error) {
      console.error("Error saving property:", error);
      if (error.response?.status === 401) {
        toast.error("Please log in to continue");
        navigate("/auth");
        return;
      } else if (
        error.response?.status === 422 &&
        error.response?.data?.detail
      ) {
        const validationErrors = error.response.data.detail;
        if (Array.isArray(validationErrors)) {
          const firstError = validationErrors[0];
          const errorMessage = firstError.msg || "Validation error";
          toast.error(`${firstError.loc?.join(" -> ")}: ${errorMessage}`);
        } else if (typeof validationErrors === "string") {
          toast.error(validationErrors);
        } else {
          toast.error("Please check your input and try again");
        }
      } else {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.detail ||
          error.message ||
          "Failed to save property";
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = () => handleSave(true);
  const handleSaveDraft = () => handleSave(false);

  return (
    <ThemedComponentProvider>
      <PageContainer>
        <LandlordHeader />
        <MainContent>
          <PageHeader>
            <HeaderWrapper>
              <BackButton
                as={Link}
                to="/landlord/property-management"
                variant="outline"
              >
                <FaArrowLeft />
              </BackButton>
              <PageTitleWrapper>
                <PageTitle>
                  <FaHome />
                  {isEditMode ? "Edit Property" : "Add New Property"}
                </PageTitle>
                <PageSubtitle>
                  {isEditMode
                    ? "Update your property details"
                    : "Create a new listing for your property"}
                </PageSubtitle>
              </PageTitleWrapper>
            </HeaderWrapper>
          </PageHeader>

          <Form>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <FormSection>
                <FormSectionTitle>
                  <FaHome />
                  Basic Information
                </FormSectionTitle>

                <FormGroup>
                  <Input
                    label="Property Title"
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Cozy Studio in Downtown"
                    error={errors.title}
                  />
                </FormGroup>

                <FormGroup>
                  <TextArea
                    label="Description"
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your property, its features, and what makes it special..."
                    error={errors.description}
                    minHeight="120px"
                  />
                </FormGroup>

                <FormRow>
                  <FormGroup>
                    <Select
                      label="Property Type"
                      name="property_type"
                      value={formData.property_type}
                      onChange={handleChange}
                    >
                      <option value="room">Private Room</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="lodge">Lodge</option>
                    </Select>
                  </FormGroup>
                  <FormGroup>
                    <Input
                      label="Area (sq ft)"
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      placeholder="e.g., 500"
                    />
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <Select
                      label="Bedrooms"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5+</option>
                    </Select>
                  </FormGroup>
                  <FormGroup>
                    <Select
                      label="Bathrooms"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                    >
                      <option value={1}>1</option>
                      <option value={1.5}>1.5</option>
                      <option value={2}>2</option>
                      <option value={2.5}>2.5</option>
                      <option value={3}>3+</option>
                    </Select>
                  </FormGroup>
                </FormRow>
              </FormSection>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <FormSection>
                <FormSectionTitle>
                  <FaDollarSign />
                  Pricing & Availability
                </FormSectionTitle>

                <FormRow>
                  <FormGroup>
                    <Input
                      label="Monthly Rent ($)"
                      required
                      type="number"
                      name="rent_amount"
                      value={formData.rent_amount}
                      onChange={handleChange}
                      placeholder="e.g., 1200"
                      error={errors.rent_amount}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      label="Security Deposit ($)"
                      type="number"
                      name="security_deposit"
                      value={formData.security_deposit}
                      onChange={handleChange}
                      placeholder="e.g., 1200"
                    />
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <Input
                      label="Available From"
                      required
                      type="date"
                      name="available_from"
                      value={formData.available_from}
                      onChange={handleChange}
                      error={errors.available_from}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Select
                      label="Lease Term"
                      name="lease_term"
                      value={formData.lease_term}
                      onChange={handleChange}
                    >
                      <option value="">Select lease term</option>
                      <option value="month-to-month">Month-to-Month</option>
                      <option value="6-months">6 Months</option>
                      <option value="1-year">1 Year</option>
                      <option value="2-years">2 Years</option>
                    </Select>
                  </FormGroup>
                </FormRow>
              </FormSection>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <FormSection>
                <FormSectionTitle>
                  <FaMapMarkerAlt />
                  Location
                </FormSectionTitle>

                <FormGroup>
                  <Input
                    label="Location/Neighborhood"
                    required
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Downtown, Near University"
                    error={errors.location}
                  />
                </FormGroup>

                <FormGroup>
                  <Input
                    label="Street Address"
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g., 123 Main Street"
                    error={errors.address}
                  />
                </FormGroup>

                <FormRow>
                  <FormGroup>
                    <Input
                      label="City"
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g., New York"
                      error={errors.city}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      label="State"
                      required
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g., NY"
                      error={errors.state}
                    />
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <Input
                    label="ZIP Code"
                    required
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleChange}
                    placeholder="e.g., 10001"
                    error={errors.zip_code}
                  />
                </FormGroup>
              </FormSection>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <FormSection>
                <FormSectionTitle>
                  <FaCheck />
                  Amenities
                </FormSectionTitle>

                <AmenitiesGrid>
                  {availableAmenities.map((amenity) => (
                    <AmenityItem
                      key={amenity.key}
                      className={
                        formData.amenities.includes(amenity.key)
                          ? "selected"
                          : ""
                      }
                      onClick={() => handleAmenityToggle(amenity.key)}
                    >
                      <AmenityIcon
                        selected={formData.amenities.includes(amenity.key)}
                      >
                        {amenity.icon}
                      </AmenityIcon>
                      <AmenityLabel
                        selected={formData.amenities.includes(amenity.key)}
                      >
                        {amenity.label}
                      </AmenityLabel>
                      {formData.amenities.includes(amenity.key) && (
                        <CheckIcon />
                      )}
                    </AmenityItem>
                  ))}
                </AmenitiesGrid>
              </FormSection>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <FormSection>
                <FormSectionTitle>
                  <FaCamera />
                  Property Images
                </FormSectionTitle>

                <ImageUploadSection
                  className={dragOver ? "drag-over" : ""}
                  onClick={() => document.getElementById("file-upload").click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    handleImageUpload(e.dataTransfer.files);
                  }}
                >
                  <UploadIcon>
                    <FaUpload />
                  </UploadIcon>
                  <UploadText>Upload Property Images</UploadText>
                  <UploadHint>
                    Drag and drop images here or click to browse
                  </UploadHint>
                </ImageUploadSection>

                <HiddenInput
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                />

                {images.length > 0 && (
                  <ImagePreview>
                    {images.map((image, index) => (
                      <PreviewItem key={index}>
                        <PreviewImage
                          src={image.url || image}
                          alt={`Preview ${index + 1}`}
                        />
                        <RemoveImageButton
                          onClick={() => handleRemoveImage(index)}
                        >
                          <FaTimes />
                        </RemoveImageButton>
                      </PreviewItem>
                    ))}
                  </ImagePreview>
                )}
              </FormSection>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <FormSection>
                <FormSectionTitle>Additional Information</FormSectionTitle>

                <FormGroup>
                  <TextArea
                    label="Utilities"
                    name="utilities"
                    value={formData.utilities}
                    onChange={handleChange}
                    placeholder="Specify which utilities are included (e.g., Water, Electricity, Internet, etc.)"
                    minHeight="80px"
                  />
                </FormGroup>
              </FormSection>
            </motion.div>
          </Form>

          <FormActions>
            <Button
              as={Link}
              to="/landlord/property-management"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveDraft}
              disabled={isLoading}
              variant="outline"
            >
              <FaSave style={{ marginRight: "8px" }} />
              {isLoading
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Save Draft"}
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isLoading}
              variant="primary"
            >
              <FaEye style={{ marginRight: "8px" }} />
              {isLoading
                ? isEditMode
                  ? "Updating..."
                  : "Publishing..."
                : isEditMode
                ? "Update Property"
                : "Publish Listing"}
            </Button>
          </FormActions>
        </MainContent>
      </PageContainer>
    </ThemedComponentProvider>
  );
};

export default AddRoom;
