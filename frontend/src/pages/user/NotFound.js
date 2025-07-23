import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';
import Button from '../../components/ui/Button';

const NotFoundContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
`;

const NotFoundContent = styled(motion.div)`
  text-align: center;
  max-width: 600px;
  color: ${props => props.theme.colors.white};
`;

const ErrorCode = styled(motion.h1)`
  font-size: 8rem;
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  margin: 0;
  line-height: 1;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 6rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 4rem;
  }
`;

const ErrorTitle = styled(motion.h2)`
  font-size: ${props => props.theme.typography.fontSizes['3xl']};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  margin: ${props => props.theme.spacing.lg} 0;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.typography.fontSizes['2xl']};
  }
`;

const ErrorMessage = styled(motion.p)`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  color: ${props => props.theme.colors.gray[100]};
  margin-bottom: ${props => props.theme.spacing.xl};
  line-height: 1.6;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.typography.fontSizes.base};
  }
`;

const ActionsContainer = styled(motion.div)`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  justify-content: center;
  flex-wrap: wrap;
  margin-top: ${props => props.theme.spacing.xl};
`;

const Illustration = styled(motion.div)`
  font-size: 6rem;
  margin-bottom: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 4rem;
  }
`;

const SuggestionsContainer = styled(motion.div)`
  margin-top: ${props => props.theme.spacing.xxxl};
  padding-top: ${props => props.theme.spacing.xl};
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const SuggestionsTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SuggestionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const SuggestionItem = styled.li`
  font-size: ${props => props.theme.typography.fontSizes.base};
  color: ${props => props.theme.colors.gray[100]};
  
  &::before {
    content: '•';
    color: ${props => props.theme.colors.white};
    font-weight: bold;
    margin-right: ${props => props.theme.spacing.sm};
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <NotFoundContent
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Illustration
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <FaHome />
        </Illustration>

        <ErrorCode
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          404
        </ErrorCode>

        <ErrorTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Page Not Found
        </ErrorTitle>

        <ErrorMessage
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Oops! The page you're looking for doesn't exist. It might have been moved, 
          deleted, or you entered the wrong URL.
        </ErrorMessage>

        <ActionsContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Button
            size="lg"
            variant="secondary"
            as={Link}
            to="/user"
          >
            Go to Homepage
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            as={Link}
            to="/user/search"
          >
            Search Rooms
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </ActionsContainer>

        <SuggestionsContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <SuggestionsTitle>What you can do:</SuggestionsTitle>
          <SuggestionsList>
            <SuggestionItem>
              Check the URL for any typos or spelling errors
            </SuggestionItem>
            <SuggestionItem>
              Use the search bar to find what you're looking for
            </SuggestionItem>
            <SuggestionItem>
              Browse our featured listings on the homepage
            </SuggestionItem>
            <SuggestionItem>
              Contact our support team if you need help
            </SuggestionItem>
          </SuggestionsList>
        </SuggestionsContainer>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

export default NotFound; 