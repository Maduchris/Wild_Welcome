import React from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { Input, Button } from './ThemeProvider';

const SearchFormContainer = styled.form`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 1fr;
  gap: 1rem;
  align-items: stretch;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    
    > * {
      height: 50px;
    }
  }
`;

const SearchInput = styled(Input)`
  height: 100%;
  min-height: 48px;
  border-radius: 8px;
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const DateInput = styled(SearchInput)`
  &::-webkit-calendar-picker-indicator {
    background-color: ${props => props.theme.colors.primary};
    border-radius: 3px;
    cursor: pointer;
    filter: invert(0);
  }
  
  &::-webkit-datetime-edit-text {
    color: ${props => props.theme.colors.text};
  }
  
  &::-webkit-datetime-edit-month-field,
  &::-webkit-datetime-edit-day-field,
  &::-webkit-datetime-edit-year-field {
    color: ${props => props.theme.colors.text};
  }
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const SearchButton = styled(Button)`
  height: 100%;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  padding: 0 1rem;
  background: linear-gradient(90deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.brown} 100%);
  color: ${props => props.theme.colors.secondary};
  border: 1px solid ${props => props.theme.colors.primary};
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(90deg, ${props => props.theme.colors.brown} 0%, ${props => props.theme.colors.primary} 100%);
    color: ${props => props.theme.colors.surface};
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SearchForm = ({ 
  location = '', 
  checkIn = '', 
  budget = '', 
  onLocationChange, 
  onCheckInChange, 
  onBudgetChange, 
  onSubmit,
  locationPlaceholder = "Where do you want to live?",
  budgetPlaceholder = "Max budget per night",
  showIcon = true,
  className
}) => {
  return (
    <SearchFormContainer onSubmit={onSubmit} className={className}>
      <SearchInput
        type="text"
        name="location"
        placeholder={locationPlaceholder}
        value={location}
        onChange={onLocationChange}
        aria-label="Location"
      />
      <DateInput
        type="date"
        name="checkIn"
        value={checkIn}
        onChange={onCheckInChange}
        aria-label="Check-in date"
      />
      <SearchInput
        type="number"
        name="budget"
        placeholder={budgetPlaceholder}
        value={budget}
        onChange={onBudgetChange}
        min="0"
        step="10"
        aria-label="Maximum budget per night"
      />
      <SearchButton type="submit" variant="primary">
        {showIcon && <FaSearch />}
        Search
      </SearchButton>
    </SearchFormContainer>
  );
};

export default SearchForm;