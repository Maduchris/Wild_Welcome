import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
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
  FaEdit
} from 'react-icons/fa';
import { propertiesAPI, getCurrentUser } from '../../services/api';
import LandlordHeader from '../../components/landlord/LandlordHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TextArea from '../../components/ui/TextArea';
import Card from '../../components/ui/Card';
import { FormGroup, FormRow, FormSection, FormSectionTitle, ErrorMessage } from '../../components/ui/FormComponents';
import {
  ThemedComponentProvider
} from '../../components/ui/ThemeProvider';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;


const MainContent = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xxxl};
`;

const BackButton = styled(Button)`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: 2px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  padding: ${props => props.theme.spacing.sm};
  
  &:hover {
    background: ${props => props.theme.colors.surface};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    position: static;
    transform: none;
    margin-bottom: ${props => props.theme.spacing.lg};
  }
`;

const HeaderWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes['3xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const PageSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  color: ${props => props.theme.colors.textSecondary};
  margin: ${props => props.theme.spacing.sm} 0 0 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};
`;

const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
`;

const AmenityItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  background-color: ${props => props.theme.colors.surface};
  
  &.selected {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primary}10;
  }
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const AmenityIcon = styled.div`
  color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.textSecondary};
  font-size: 18px;
`;

const AmenityLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.text};
`;

const CheckIcon = styled(FaCheck)`
  margin-left: auto;
  color: ${props => props.theme.colors.primary};
`;

const ImageUploadSection = styled.div`
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xxxl};
  text-align: center;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  background-color: ${props => props.theme.colors.surface};
  
  &:hover, &.drag-over {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primary}10;
  }
`;

const UploadIcon = styled.div`
  font-size: 48px;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const UploadText = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const UploadHint = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const HiddenInput = styled.input`
  display: none;
`;

const ImagePreview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
`;

const PreviewItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  background-color: ${props => props.theme.colors.surface};
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
  border: 2px solid ${props => props.theme.colors.surface};
  background-color: ${props => props.theme.colors.error};
  color: ${props => props.theme.colors.surface};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 10;
  
  &:hover {
    background-color: ${props => props.theme.colors.errorDark};
    transform: scale(1.1);
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
  padding: ${props => props.theme.spacing.xl};
  border-top: 1px solid ${props => props.theme.colors.border};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column-reverse;
  }
`;

const AddRoom = () => {
  const navigate = useNavigate();
  const { id: propertyId } = useParams(); // Get property ID from URL if editing
  const isEditMode = !!propertyId; // True if we have a property ID
  const [, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'room',
    bedrooms: 1,
    bathrooms: 1,
    area: '',
    rent_amount: '',
    security_deposit: '',
    available_from: '',
    lease_term: '12',
    location: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    amenities: [],
    images: [],
    rules: '',
    utilities_included: true
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  React.useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  // Fetch existing property data when in edit mode
  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!isEditMode || !propertyId) return;
      
      try {
        setIsLoading(true);
        const propertyData = await propertiesAPI.getById(propertyId);
        
        // Pre-populate form with existing data
        setFormData(prev => ({
          ...prev,
          title: propertyData.title || '',
          description: propertyData.description || '',
          property_type: propertyData.property_type || 'room',
          bedrooms: propertyData.bedrooms || 1,
          bathrooms: propertyData.bathrooms || 1,
          rent_amount: (propertyData.price_per_night * 30) || '', // Convert back to monthly
          address: propertyData.location?.address || '',
          city: propertyData.location?.city || '',
          amenities: Object.entries(propertyData.amenities || {})
            .filter(([key, value]) => value)
            .map(([key]) => {
              // Map backend amenity keys to frontend labels
              const amenityMap = {
                'wifi': 'WiFi',
                'kitchen': 'Kitchen',
                'parking': 'Parking',
                'ac': 'Air Conditioning',
                'heating': 'Heating',
                'washer': 'Laundry',
                'pool': 'Pool',
                'gym': 'Gym',
                'balcony': 'Balcony'
              };
              return amenityMap[key] || key;
            }),
          images: propertyData.images?.map((url, index) => ({
            id: Date.now() + index,
            name: `existing-image-${index}`,
            url: url,
            file: null // No file object for existing images
          })) || []
        }));
        
      } catch (error) {
        console.error('Error fetching property:', error);
        toast.error('Failed to load property data');
        navigate('/landlord/properties');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyData();
  }, [isEditMode, propertyId, navigate]);

  const amenitiesConfig = [
    { key: 'WiFi', label: 'WiFi', icon: <FaWifi /> },
    { key: 'Kitchen', label: 'Kitchen', icon: <FaUtensils /> },
    { key: 'Private Bathroom', label: 'Private Bathroom', icon: <FaBath /> },
    { key: 'Balcony', label: 'Balcony', icon: <FaBuilding /> },
    { key: 'Parking', label: 'Parking', icon: <FaCar /> },
    { key: 'Gym', label: 'Gym', icon: <FaDumbbell /> },
    { key: 'Pool', label: 'Pool', icon: <FaSwimmingPool /> },
    { key: 'Laundry', label: 'Laundry', icon: <FaTshirt /> },
    { key: 'Air Conditioning', label: 'Air Conditioning', icon: <FaSnowflake /> },
    { key: 'Heating', label: 'Heating', icon: <FaFire /> },
    { key: 'Furnished', label: 'Furnished', icon: <FaCouch /> },
    { key: 'Pet Friendly', label: 'Pet Friendly', icon: <FaDog /> },
    { key: 'No Smoking', label: 'No Smoking', icon: <FaBan /> },
    { key: 'Security System', label: 'Security System', icon: <FaShieldAlt /> }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAmenityChange = (amenityKey) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityKey)
        ? prev.amenities.filter(a => a !== amenityKey)
        : [...prev.amenities, amenityKey]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 10;
    
    // Filter out invalid files
    const validFiles = files.filter(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      
      // Check file size
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      
      return true;
    });
    
    // Check total number of files
    if (formData.images.length + validFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed`);
      return;
    }
    
    const newImages = validFiles.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      url: URL.createObjectURL(file),
      file: file
    }));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
    
    // Clear the input
    e.target.value = '';
  };

  const removeImage = (imageId) => {
    setFormData(prev => {
      // Find the image to remove and revoke its URL to free memory
      const imageToRemove = prev.images.find(img => img.id === imageId);
      if (imageToRemove && imageToRemove.url) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      
      return {
        ...prev,
        images: prev.images.filter(img => img.id !== imageId)
      };
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      // Simulate file input change
      handleImageUpload({ target: { files, value: '' } });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.rent_amount) newErrors.rent_amount = 'Rent amount is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zip_code.trim()) newErrors.zip_code = 'ZIP code is required';
    if (!formData.available_from) newErrors.available_from = 'Available date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (shouldPublish = false) => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Check if user is still authenticated
    const token = localStorage.getItem('access_token');
    const currentUser = getCurrentUser();
    
    if (!token || !currentUser) {
      toast.error('Please log in again to continue');
      navigate('/login');
      return;
    }
    
    if (currentUser.user_type !== 'landlord') {
      toast.error('You must be logged in as a landlord to create properties');
      return;
    }
    
    console.log('Creating property with user:', currentUser);
    setIsLoading(true);
    
    try {
      // Transform data to match backend schema
      const propertyData = {
        title: formData.title,
        description: formData.description,
        property_type: formData.property_type,
        max_guests: parseInt(formData.bedrooms) * 2, // Estimate max guests
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        price_per_night: parseFloat(formData.rent_amount) / 30, // Convert monthly rent to nightly rate
        location: {
          address: formData.address,
          city: formData.city,
          country: "Rwanda"
        },
        amenities: {
          wifi: formData.amenities.includes('WiFi'),
          parking: formData.amenities.includes('Parking'),
          kitchen: formData.amenities.includes('Kitchen'),
          ac: formData.amenities.includes('Air Conditioning'),
          heating: formData.amenities.includes('Heating'),
          washer: formData.amenities.includes('Laundry'),
          dryer: formData.amenities.includes('Laundry'),
          tv: false,
          workspace: false,
          balcony: formData.amenities.includes('Balcony'),
          garden: false,
          pool: formData.amenities.includes('Pool'),
          gym: formData.amenities.includes('Gym'),
          wildlife_viewing: false,
          photography_equipment: false,
          guided_tours: false
        },
        images: [], // Images will be uploaded separately after property creation
        is_active: shouldPublish,
        is_featured: false
      };

      let resultProperty;
      
      if (isEditMode) {
        // Update existing property
        resultProperty = await propertiesAPI.update(propertyId, propertyData);
      } else {
        // Create new property
        resultProperty = await propertiesAPI.create(propertyData);
      }
      
      const targetPropertyId = isEditMode ? propertyId : resultProperty.id;
      
      // Upload images if any exist (only new ones with file objects)
      const newImages = formData.images.filter(img => img.file);
      if (newImages.length > 0) {
        try {
          const imageFiles = newImages.map(img => img.file);
          await propertiesAPI.uploadImages(targetPropertyId, imageFiles);
          const actionText = isEditMode ? 'updated' : (shouldPublish ? 'published' : 'saved as draft');
          toast.success(`Property ${actionText} successfully with images!`);
        } catch (imageError) {
          console.error('Image upload error:', imageError);
          const actionText = isEditMode ? 'updated' : (shouldPublish ? 'published' : 'saved as draft');
          toast.success(`Property ${actionText} but image upload failed`);
        }
      } else {
        const actionText = isEditMode ? 'updated' : (shouldPublish ? 'published' : 'saved as draft');
        toast.success(`Property ${actionText} successfully!`);
      }
      
      navigate('/landlord/properties');
    } catch (error) {
      console.error('Save error:', error);
      console.log('Full error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      // Handle specific error types
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please log in again.');
        return;
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to create properties. Please ensure you are logged in as a landlord.');
        return;
      } else if (error.response?.status === 422 && error.response?.data?.detail) {
        const validationErrors = error.response.data.detail;
        if (Array.isArray(validationErrors)) {
          // Show first validation error
          const firstError = validationErrors[0];
          const errorMessage = firstError.msg || 'Validation error';
          toast.error(`${firstError.loc?.join(' -> ')}: ${errorMessage}`);
        } else if (typeof validationErrors === 'string') {
          toast.error(validationErrors);
        } else {
          toast.error('Please check your input and try again');
        }
      } else {
        const errorMessage = error.response?.data?.message || error.response?.data?.detail || error.message || 'Failed to save property';
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
      <Container>
      <LandlordHeader />

      <MainContent>
        <PageHeader>
          <HeaderWrapper>
            <BackButton as={Link} to="/landlord/property-management" variant="outline">
              <FaArrowLeft />
            </BackButton>
            <div>
              <PageTitle>
                <FaHome />
                {isEditMode ? 'Edit Property' : 'Add New Property'}
              </PageTitle>
              <PageSubtitle>{isEditMode ? 'Update your property details' : 'Create a new listing for your property'}</PageSubtitle>
            </div>
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
                  <Label>Bathrooms</Label>
                  <Select
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                  >
                    <option value={1}>1</option>
                    <option value={1.5}>1.5</option>
                    <option value={2}>2</option>
                    <option value={2.5}>2.5</option>
                    <option value={3}>3</option>
                    <option value={4}>4+</option>
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
              <SectionTitle>
                <FaDollarSign />
                Pricing & Availability
              </SectionTitle>
              
              <FormRow>
                <FormGroup>
                  <Label className="required">Monthly Rent ($)</Label>
                  <Input
                    type="number"
                    name="rent_amount"
                    value={formData.rent_amount}
                    onChange={handleChange}
                    placeholder="e.g., 1200"
                    error={errors.rent_amount}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Security Deposit ($)</Label>
                  <Input
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
                  <Label className="required">Available From</Label>
                  <Input
                    type="date"
                    name="available_from"
                    value={formData.available_from}
                    onChange={handleChange}
                    error={errors.available_from}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Lease Term</Label>
                  <Select
                    name="lease_term"
                    value={formData.lease_term}
                    onChange={handleChange}
                  >
                    <option value="1">1 month</option>
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                    <option value="24">24 months</option>
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
              <SectionTitle>
                <FaMapMarkerAlt />
                Location
              </SectionTitle>
              
              <FormGroup>
                <Label className="required">Location/Neighborhood</Label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Downtown, University District"
                  error={errors.location}
                />
              </FormGroup>

              <FormGroup>
                <Label className="required">Street Address</Label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g., 123 Main Street"
                  error={errors.address}
                />
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label className="required">City</Label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g., New York"
                    error={errors.city}
                  />
                </FormGroup>

                <FormGroup>
                  <Label className="required">State</Label>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g., NY"
                    error={errors.state}
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label className="required">ZIP Code</Label>
                <Input
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
              <SectionTitle>
                <FaCheck />
                Amenities
              </SectionTitle>
              
              <AmenitiesGrid>
                {amenitiesConfig.map(amenity => (
                  <AmenityItem
                    key={amenity.key}
                    className={formData.amenities.includes(amenity.key) ? 'selected' : ''}
                    onClick={() => handleAmenityChange(amenity.key)}
                  >
                    <AmenityIcon selected={formData.amenities.includes(amenity.key)}>
                      {amenity.icon}
                    </AmenityIcon>
                    <AmenityLabel selected={formData.amenities.includes(amenity.key)}>
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
              <SectionTitle>
                <FaCamera />
                Photos
              </SectionTitle>
              
              <ImageUploadSection 
                className={dragOver ? 'drag-over' : ''}
                onClick={() => document.getElementById('image-upload').click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <UploadIcon>
                  <FaUpload />
                </UploadIcon>
                <UploadText>
                  {dragOver ? 'Drop images here' : 'Click to upload photos or drag and drop'}
                </UploadText>
                <UploadHint>PNG, JPG up to 10MB each (Maximum 10 photos)</UploadHint>
              </ImageUploadSection>

              <HiddenInput
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />

              {formData.images.length > 0 && (
                <ImagePreview>
                  {formData.images.map(image => (
                    <PreviewItem key={image.id}>
                      <PreviewImage 
                        src={image.url} 
                        alt={image.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div style={{ 
                        display: 'none', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                      }}>
                        <FaCamera size={30} style={{ opacity: 0.5 }} />
                      </div>
                      <RemoveImageButton
                        type="button"
                        onClick={() => removeImage(image.id)}
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
              <SectionTitle>
                <FaEdit />
                Additional Information
              </SectionTitle>
              
              <FormGroup>
                <Label>Utilities</Label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="utilities"
                    name="utilities_included"
                    checked={formData.utilities_included}
                    onChange={handleChange}
                  />
                  <Label htmlFor="utilities" style={{ margin: 0 }}>
                    Utilities included in rent
                  </Label>
                </div>
              </FormGroup>

              <FormGroup>
                <Label>House Rules</Label>
                <TextArea
                  name="rules"
                  value={formData.rules}
                  onChange={handleChange}
                  placeholder="Any specific rules or policies for tenants..."
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
            <FaSave style={{ marginRight: '8px' }} />
            {isLoading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Save Draft')}
          </Button>
          <Button 
            onClick={handlePublish}
            disabled={isLoading}
          >
            <FaEye style={{ marginRight: '8px' }} />
            {isLoading ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update Property' : 'Publish Listing')}
          </Button>
        </FormActions>
      </MainContent>
      </Container>
    </ThemedComponentProvider>
  );
};

export default AddRoom;