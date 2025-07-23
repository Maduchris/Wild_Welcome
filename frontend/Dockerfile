# Multi-stage build for Wild Welcome Frontend
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Set environment variables for build
ENV NODE_ENV=production

# Build arguments that can be passed at build time
ARG REACT_APP_API_URL=https://home-oi2z.onrender.com/api
ARG GENERATE_SOURCEMAP=false
ARG REACT_APP_APP_NAME="Wild Welcome"
ARG REACT_APP_VERSION="1.0.0"
ARG REACT_APP_ENVIRONMENT=production

# Set environment variables from build args
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV GENERATE_SOURCEMAP=$GENERATE_SOURCEMAP
ENV REACT_APP_APP_NAME=$REACT_APP_APP_NAME
ENV REACT_APP_VERSION=$REACT_APP_VERSION
ENV REACT_APP_ENVIRONMENT=$REACT_APP_ENVIRONMENT

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci --silent

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built app from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Run as root for nginx (standard practice for nginx containers)

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]