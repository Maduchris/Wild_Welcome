import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaUsers, FaBed, FaBath, FaMapMarkerAlt } from "react-icons/fa";
import { Button } from "./ThemeProvider";

const Card = styled.div`
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  background: ${(props) => props.theme.colors.surface};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid ${(props) => props.theme.colors.border};
  display: flex;
  flex-direction: column;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  background: ${(props) =>
    props.image
      ? `url(${props.image})`
      : `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)`};
  background-size: cover;
  background-position: center;
  border-radius: 0.5rem 0.5rem 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.surface};
  font-size: 2rem;
`;

const Content = styled.div`
  padding: 1rem 1rem 1.5rem 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Location = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 1rem;
  .period {
    font-size: 1rem;
    font-weight: 400;
    color: ${(props) => props.theme.colors.textSecondary};
  }
`;

const Features = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background: ${(props) => props.theme.colors.accent};
  color: ${(props) => props.theme.colors.surface};
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ListingCard = ({ property }) => {
  return (
    <Card>
      <ImageContainer image={property.images?.[0]}>
        {!property.images?.[0] && <FaBed />}
      </ImageContainer>
      <Content>
        <Title>{property.title}</Title>
        <Location>
          <FaMapMarkerAlt />
          {property.location?.address ||
            property.location?.city ||
            "Location not specified"}
        </Location>
        <Price>
          ${property.price_per_night}
          <span className="period">/night</span>
        </Price>
        <Features>
          <Tag>{property.property_type}</Tag>
          <Tag>
            <FaUsers /> {property.max_guests} guests
          </Tag>
          {property.bedrooms && (
            <Tag>
              <FaBed /> {property.bedrooms} bed
              {property.bedrooms !== 1 ? "s" : ""}
            </Tag>
          )}
          {property.bathrooms && (
            <Tag>
              <FaBath /> {property.bathrooms} bath
              {property.bathrooms !== 1 ? "s" : ""}
            </Tag>
          )}
          {property.amenities?.wifi && <Tag>WiFi</Tag>}
          {property.amenities?.parking && <Tag>Parking</Tag>}
          {property.amenities?.kitchen && <Tag>Kitchen</Tag>}
        </Features>
        <Button
          as={Link}
          to={`/user/listing/${property.id}`}
          variant="secondary"
          style={{ marginTop: "auto" }}
        >
          View Details
        </Button>
      </Content>
    </Card>
  );
};

export default ListingCard;
