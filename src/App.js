import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from 'react-query';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';

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
import AddRoom from './pages/landlord/AddRoom';
import AddApartment from './pages/landlord/AddApartment';
import LandlordDeletePopUp from './pages/landlord/LandlordDeletePopUp';
import Reject from './pages/landlord/Reject';
import Approve from './pages/landlord/Approve';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Router>
          <Routes>
            {/* General Views */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/confirmation" element={<Confirmation />} />

            {/* User Views */}
            <Route path="/user" element={<UserLanding />} />
            <Route path="/user/search" element={<ListingSearch />} />
            <Route path="/user/listing/:id" element={<ListingPage />} />
            <Route path="/user/booking/step1" element={<BookingProcess1 />} />
            <Route path="/user/booking/step2" element={<BookingProcess2 />} />
            <Route path="/user/account" element={<UserAccount />} />
            <Route path="/user/favourites" element={<UserFavourites />} />
            <Route path="/user/applications" element={<UserRoomApplications />} />
            <Route path="/user/delete-popup" element={<DeletePopUp />} />

            {/* Landlord Views */}
            <Route path="/landlord/account" element={<LandlordAccount />} />
            <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
            <Route path="/landlord/properties" element={<LandlordPropertyManagement />} />
            <Route path="/landlord/calendar" element={<LandlordTenantCalendar />} />
            <Route path="/landlord/booking-request" element={<LandlordBookingRequest />} />
            <Route path="/landlord/add-room" element={<AddRoom />} />
            <Route path="/landlord/add-apartment" element={<AddApartment />} />
            <Route path="/landlord/delete-popup" element={<LandlordDeletePopUp />} />
            <Route path="/landlord/reject" element={<Reject />} />
            <Route path="/landlord/approve" element={<Approve />} />

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App; 