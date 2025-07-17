import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import Button from './Button';

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  background-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  overflow: hidden;
  border: 3px solid ${props => props.theme.colors.border};
  
  &:hover {
    transform: scale(1.02);
    border-color: ${props => props.theme.colors.primary};
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UploadOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity ${props => props.theme.transitions.normal};
  cursor: pointer;
  
  &:hover {
    opacity: 1;
  }
  
  span {
    color: white;
    font-size: ${props => props.theme.typography.fontSizes.sm};
    font-weight: ${props => props.theme.typography.fontWeights.medium};
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: center;
`;

const PreviewImage = styled.img`
  max-width: 200px;
  max-height: 200px;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 2px solid ${props => props.theme.colors.border};
`;

const ProfileImageUpload = ({ 
  currentImage = null, 
  userInitials = 'U', 
  onImageChange, 
  onRemoveImage 
}) => {
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        if (onImageChange) {
          onImageChange(file, e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemoveImage) {
      onRemoveImage();
    }
  };

  const displayImage = previewImage || currentImage;

  return (
    <UploadContainer>
      <AvatarContainer>
        <Avatar onClick={handleAvatarClick}>
          {displayImage ? (
            <img src={displayImage} alt="Profile" />
          ) : (
            userInitials
          )}
        </Avatar>
        <UploadOverlay onClick={handleAvatarClick}>
          <span>Change Photo</span>
        </UploadOverlay>
      </AvatarContainer>
      
      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
      />
      
      <ButtonGroup>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAvatarClick}
        >
          Upload Photo
        </Button>
        {displayImage && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRemoveImage}
            color="error"
          >
            Remove Photo
          </Button>
        )}
      </ButtonGroup>
      
      {previewImage && (
        <div>
          <h4>Preview:</h4>
          <PreviewImage src={previewImage} alt="Preview" />
        </div>
      )}
    </UploadContainer>
  );
};

export default ProfileImageUpload; 