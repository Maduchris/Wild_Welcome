import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import GlobalStyles from "./styles/GlobalStyles";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

// General Views
import Landing from "./pages/general/Landing";
import Login from "./pages/general/Login";
import SignUp from "./pages/general/SignUp";
import Confirmation from "./pages/general/Confirmation";

// User Views
import UserLanding from "./pages/user/UserLanding";
import ListingSearch from "./pages/user/ListingSearch";
import NotFound from "./pages/user/NotFound";
import ListingPage from "./pages/user/ListingPage";
import BookingFlow from "./pages/user/BookingFlow";
import UserAccount from "./pages/user/UserAccount";
import UserFavourites from "./pages/user/UserFavourites";
import UserRoomApplications from "./pages/user/UserRoomApplications";
import DeletePopUp from "./pages/user/DeletePopUp";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Landlord Views
import LandlordAccount from "./pages/landlord/LandlordAccount";
import LandlordDashboard from "./pages/landlord/LandlordDashboard";
import LandlordPropertyManagement from "./pages/landlord/LandlordPropertyManagement";
import LandlordTenantCalendar from "./pages/landlord/LandlordTenantCalendarNew";
import LandlordBookingRequest from "./pages/landlord/LandlordBookingRequestNew";
import AddRoom from "./pages/landlord/AddRoom";
import AddApartment from "./pages/landlord/AddApartment";
import LandlordPropertyView from "./pages/landlord/LandlordPropertyView";
import LandlordDeletePopUp from "./pages/landlord/LandlordDeletePopUp";
import Reject from "./pages/landlord/Reject";
import Approve from "./pages/landlord/Approve";

const queryClient = new QueryClient();

// Inner component that uses the theme context
const AppContent = () => {
  const { currentTheme } = useTheme();

  return (
    <StyledThemeProvider theme={currentTheme}>
      <GlobalStyles />
      <Toaster position="top-right" />
      <Router>
        <Routes>
          {/* General Views */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/confirmation" element={<Confirmation />} />

          {/* User Views */}
          <Route
            path="/user"
            element={
              <ProtectedRoute requireAuth={true} userType="user">
                <UserLanding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/search"
            element={
              <ProtectedRoute requireAuth={true} userType="user">
                <ListingSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/listing/:id"
            element={
              <ProtectedRoute requireAuth={true} userType="user">
                <ListingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/booking/*"
            element={
              <ProtectedRoute requireAuth={true} userType="user">
                <BookingFlow />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/account"
            element={
              <ProtectedRoute requireAuth={true} userType="user">
                <UserAccount />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/favourites"
            element={
              <ProtectedRoute requireAuth={true} userType="user">
                <UserFavourites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/applications"
            element={
              <ProtectedRoute requireAuth={true} userType="user">
                <UserRoomApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/delete-popup"
            element={
              <ProtectedRoute requireAuth={true} userType="user">
                <DeletePopUp />
              </ProtectedRoute>
            }
          />

          {/* Landlord Views */}
          <Route
            path="/landlord"
            element={
              <ProtectedRoute requireAuth={true} userType="landlord">
                <LandlordDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/landlord/account"
            element={
              <ProtectedRoute requireAuth={true} userType="landlord">
                <LandlordAccount />
              </ProtectedRoute>
            }
          />
          <Route
            path="/landlord/dashboard"
            element={
              <ProtectedRoute requireAuth={true} userType="landlord">
                <LandlordDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/landlord/properties"
            element={
              <ProtectedRoute requireAuth={true} userType="landlord">
                <LandlordPropertyManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/landlord/calendar"
            element={
              <ProtectedRoute requireAuth={true} userType="landlord">
                <LandlordTenantCalendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/landlord/booking-request"
            element={
              <ProtectedRoute requireAuth={true} userType="landlord">
                <LandlordBookingRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/landlord/bookings"
            element={
              <ProtectedRoute requireAuth={true} userType="landlord">
                <LandlordBookingRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/landlord/add-room"
            element={
              <ProtectedRoute requireAuth={true} userType="landlord">
                <AddRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/landlord/add-apartment"
            element={
              <ProtectedRoute requireAuth={true} userType="landlord">
                <AddApartment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/landlord/property/:id"
            element={
              <ProtectedRoute requireAuth={true} userType="landlord">
                <LandlordPropertyView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/landlord/property/:id/edit"
            element={
              <ProtectedRoute requireAuth={true} userType="landlord">
                <AddRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/landlord/delete-popup"
            element={
              <ProtectedRoute requireAuth={true} userType="landlord">
                <LandlordDeletePopUp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/landlord/reject"
            element={
              <ProtectedRoute requireAuth={true} userType="landlord">
                <Reject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/landlord/approve"
            element={
              <ProtectedRoute requireAuth={true} userType="landlord">
                <Approve />
              </ProtectedRoute>
            }
          />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </StyledThemeProvider>
  );
};

// Main App component that provides theme context
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
