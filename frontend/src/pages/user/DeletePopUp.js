import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeletePopUp.css';

const DeletePopUp = ({ isOpen, onClose, itemToDelete, onDelete }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onDelete) {
        onDelete(itemToDelete.id);
      }
      
      onClose();
      // Navigate back to applications page
      navigate('/user/applications');
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
        
        <h2 className="delete-title">Delete Application</h2>
        <p className="delete-message">
          Are you sure you want to delete this application? This action cannot be undone.
        </p>

        {itemToDelete && (
          <div className="delete-item">
            <div className="item-title">{itemToDelete.title}</div>
            <div className="item-details">
              {itemToDelete.location} • {itemToDelete.rent}
            </div>
          </div>
        )}

        <div className="warning-text">
          <div className="warning-title">⚠️ Warning</div>
          <div className="warning-message">
            Deleting this application will permanently remove it from your records. 
            You will need to reapply if you change your mind.
          </div>
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

export default DeletePopUp; 