import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from 'react-query';
import GlobalStyles from './styles/GlobalStyles';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute, { TenantRoute, LandlordRoute, PublicRoute } from './components/auth/ProtectedRoute';

// General Views
import Landing from './pages/general/Landing';
import Login from './pages/general/Login';
import SignUp from './pages/general/SignUp';
import Confirmation from './pages/general/Confirmation';

// User Views
import UserLanding from './pages/user/UserLanding';
import ListingSearch from './pages/user/ListingSearch';
import NotFound from './pages/user/NotFound';
import ListingPage from './pages/user/ListingPage';
import BookingProcess1 from './pages/user/BookingProcess1';
import BookingProcess2 from './pages/user/BookingProcess2';
import UserAccount from './pages/user/UserAccount';
import UserFavourites from './pages/user/UserFavourites';
import UserRoomApplications from './pages/user/UserRoomApplications';
import DeletePopUp from './pages/user/DeletePopUp';

// Landlord Views
import LandlordAccount from './pages/landlord/LandlordAccount';
import LandlordDashboard from './pages/landlord/LandlordDashboard';
import LandlordPropertyManagement from './pages/landlord/LandlordPropertyManagement';
import LandlordTenantCalendar from './pages/landlord/LandlordTenantCalendar';
import LandlordBookingRequest from './pages/landlord/LandlordBookingRequest';
import AddProperty from './pages/landlord/AddProperty';
import LandlordDeletePopUp from './pages/landlord/LandlordDeletePopUp';
import Reject from './pages/landlord/Reject';
import Approve from './pages/landlord/Approve';

const queryClient = new QueryClient();

function AppContent() {
  const { theme } = useTheme();
  
  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyles />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <PublicRoute>
            <Landing />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        } />
        <Route path="/confirmation" element={
          <PublicRoute>
            <Confirmation />
          </PublicRoute>
        } />

        {/* Tenant Routes */}
        <Route path="/user" element={
          <TenantRoute>
            <UserLanding />
          </TenantRoute>
        } />
        <Route path="/user/search" element={
          <TenantRoute>
            <ListingSearch />
          </TenantRoute>
        } />
        <Route path="/user/listing/:id" element={
          <TenantRoute>
            <ListingPage />
          </TenantRoute>
        } />
        <Route path="/user/booking/step1" element={
          <TenantRoute>
            <BookingProcess1 />
          </TenantRoute>
        } />
        <Route path="/user/booking/step2" element={
          <TenantRoute>
            <BookingProcess2 />
          </TenantRoute>
        } />
        <Route path="/user/account" element={
          <TenantRoute>
            <UserAccount />
          </TenantRoute>
        } />
        <Route path="/user/favourites" element={
          <TenantRoute>
            <UserFavourites />
          </TenantRoute>
        } />
        <Route path="/user/applications" element={
          <TenantRoute>
            <UserRoomApplications />
          </TenantRoute>
        } />
        <Route path="/user/delete-popup" element={
          <TenantRoute>
            <DeletePopUp />
          </TenantRoute>
        } />

        {/* Landlord Routes */}
        <Route path="/landlord/account" element={
          <LandlordRoute>
            <LandlordAccount />
          </LandlordRoute>
        } />
        <Route path="/landlord/dashboard" element={
          <LandlordRoute>
            <LandlordDashboard />
          </LandlordRoute>
        } />
        <Route path="/landlord/properties" element={
          <LandlordRoute>
            <LandlordPropertyManagement />
          </LandlordRoute>
        } />
        <Route path="/landlord/calendar" element={
          <LandlordRoute>
            <LandlordTenantCalendar />
          </LandlordRoute>
        } />
        <Route path="/landlord/booking-request" element={
          <LandlordRoute>
            <LandlordBookingRequest />
          </LandlordRoute>
        } />
        <Route path="/landlord/add-property" element={
          <LandlordRoute>
            <AddProperty />
          </LandlordRoute>
        } />
        <Route path="/landlord/delete-popup" element={
          <LandlordRoute>
            <LandlordDeletePopUp />
          </LandlordRoute>
        } />
        <Route path="/landlord/reject" element={
          <LandlordRoute>
            <Reject />
          </LandlordRoute>
        } />
        <Route path="/landlord/approve" element={
          <LandlordRoute>
            <Approve />
          </LandlordRoute>
        } />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </StyledThemeProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <Router>
        <AuthProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </AuthProvider>
        </Router>
    </QueryClientProvider>
  );
}

export default App; 