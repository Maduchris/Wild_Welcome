# Issue: Frontend-Backend API Sync Issues

**Date**: 2025-01-20  
**Component**: Frontend/Backend Integration  
**Priority**: High  
**Status**: New

## Problem Description
Several API endpoints between frontend and backend are not properly synchronized, leading to potential runtime errors and missing functionality.

## Sync Issues Found

### 1. Google Login Endpoint Mismatch
- **Frontend**: Calls `/auth/google` (api.js:87)
- **Backend**: No corresponding endpoint in auth.py
- **Impact**: Google login feature will fail

### 2. Booking Approval/Rejection Parameter Mismatch
- **Frontend**: Sends `response_message` parameter (api.js:254, 263)
- **Backend**: Doesn't accept any body parameters for approve/reject endpoints
- **Impact**: Messages won't be processed

### 3. Password Reset Parameter Mismatch
- **Frontend**: Sends `new_password` (api.js:112)
- **Backend**: Expects `new_password` (auth.py:135)
- **Status**: ✅ Actually matches - no issue

### 4. Favourites vs Favorites Spelling
- **Frontend**: Uses "favorites" in variable names (api.js:291-315)
- **Backend**: Uses "favourites" in endpoints (/users/favourites)
- **Impact**: Inconsistent naming but API calls work

### 5. Missing Health Check Endpoint
- **Frontend**: Calls `/health` (api.js:349)
- **Backend**: No health check endpoint found in routes
- **Impact**: Health monitoring will fail

### 6. Missing Root Info Endpoint  
- **Frontend**: Calls `/` for app info (api.js:359)
- **Backend**: No root endpoint found
- **Impact**: App info requests will fail

## Expected Behavior
All frontend API calls should have corresponding backend endpoints with matching parameters and response formats.

## Steps to Reproduce
1. Try Google login - will fail with 404
2. Approve/reject booking with message - message won't be saved
3. Call health check endpoint - will fail with 404
4. Request app info from root - will fail with 404

## Environment
- **Frontend**: React app on localhost:3000
- **Backend**: FastAPI on localhost:8000
- **Database**: MongoDB

## Investigation Notes
- Frontend API service is well-structured with proper error handling
- Backend has comprehensive auth, properties, bookings, and users routes
- Most core functionality appears to be synced correctly
- Missing endpoints are mostly auxiliary features

## Potential Solutions
1. **Add Google OAuth endpoint** to backend auth.py
2. **Add message parameter** to booking approve/reject endpoints
3. **Add health check endpoint** to backend main.py
4. **Add root info endpoint** to backend main.py
5. **Standardize naming** (favorites vs favourites) across codebase

## Related Issues
- Google login not implemented on backend
- Health monitoring not available
- Booking approval messages not captured