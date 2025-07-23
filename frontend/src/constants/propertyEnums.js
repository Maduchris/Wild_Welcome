// Property-related enum constants for consistent use across the application

export const PROPERTY_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'studio', label: 'Studio' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'room', label: 'Room' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'townhouse', label: 'Townhouse' }
];

export const PROPERTY_STATUS = [
  { value: '', label: 'All Status' },
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'not-available', label: 'Not Available' }
];

export const BOOKING_STATUS = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' }
];

export const BUILDING_TYPES = [
  { value: '', label: 'Select Building Type' },
  { value: 'apartment', label: 'Apartment Building' },
  { value: 'condo', label: 'Condominium' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'house', label: 'House' },
  { value: 'penthouse', label: 'Penthouse' }
];

// Color mappings for theme-aware styling
export const STATUS_COLORS = {
  available: 'success',
  occupied: 'warning', 
  maintenance: 'error',
  'not-available': 'textSecondary',
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  withdrawn: 'textSecondary'
};

export const STAT_COLORS = {
  primary: 'primary',
  success: 'success', 
  warning: 'warning',
  error: 'error'
};