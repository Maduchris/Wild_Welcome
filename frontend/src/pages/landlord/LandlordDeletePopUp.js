import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandlordDeletePopUp.css';

const LandlordDeletePopUp = ({ isOpen, onClose, itemToDelete, onDelete, itemType = 'property' }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const getItemTypeText = () => {
    switch (itemType) {
      case 'property':
        return 'property';
      case 'booking':
        return 'booking request';
      case 'tenant':
        return 'tenant';
      default:
        return 'item';
    }
  };

  const getConsequences = () => {
    switch (itemType) {
      case 'property':
        return [
          'All associated bookings will be cancelled',
          'Tenant information will be removed',
          'Property photos and details will be permanently deleted',
          'This action cannot be undone'
        ];
      case 'booking':
        return [
          'The applicant will be notified of the rejection',
          'The booking request will be permanently removed',
          'This action cannot be undone'
        ];
      case 'tenant':
        return [
          'All tenant data will be permanently deleted',
          'Rental history will be removed',
          'This action cannot be undone'
        ];
      default:
        return [
          'This action cannot be undone'
        ];
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onDelete) {
        onDelete(itemToDelete.id);
      }
      
      onClose();
      // Navigate back to appropriate page
      switch (itemType) {
        case 'property':
          navigate('/landlord/properties');
          break;
        case 'booking':
          navigate('/landlord/bookings');
          break;
        case 'tenant':
          navigate('/landlord/tenants');
          break;
        default:
          navigate('/landlord/dashboard');
      }
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="delete-popup-overlay" onClick={handleCancel}>
      <div className="delete-popup" onClick={(e) => e.stopPropagation()}>
        <div className="delete-icon">
          🗑️
        </div>
        
        <h2 className="delete-title">Delete {getItemTypeText().charAt(0).toUpperCase() + getItemTypeText().slice(1)}</h2>
        <p className="delete-message">
          Are you sure you want to delete this {getItemTypeText()}? This action cannot be undone.
        </p>

        {itemToDelete && (
          <div className="delete-item">
            <div className="item-title">{itemToDelete.title || itemToDelete.name}</div>
            <div className="item-details">
              {itemToDelete.location && `${itemToDelete.location} • `}
              {itemToDelete.price && `${itemToDelete.price}`}
            </div>
          </div>
        )}

        <div className="warning-text">
          <div className="warning-title">⚠️ Warning</div>
          <div className="warning-message">
            Deleting this {getItemTypeText()} will permanently remove it from your records.
          </div>
        </div>

        <div className="consequences-list">
          <div className="consequences-title">Consequences:</div>
          <ul>
            {getConsequences().map((consequence, index) => (
              <li key={index}>{consequence}</li>
            ))}
          </ul>
        </div>

        <div className="delete-actions">
          <button 
            className="cancel-button"
            onClick={handleCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            className="delete-button"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandlordDeletePopUp; 