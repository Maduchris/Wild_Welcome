import React from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { bookingsAPI, getCurrentUser } from "../../services/api";
import toast from "react-hot-toast";
import BookingWizard from "../../components/booking/BookingWizard";
import PersonalInfoStep from "../../components/booking/PersonalInfoStep";
import ReviewSubmitStep from "../../components/booking/ReviewSubmitStep";
import ConfirmationStep from "../../components/booking/ConfirmationStep";

const BookingFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get("listingId");
  
  // Extract prefilled data from navigation state and current user
  const { property, moveInDate } = location.state || {};
  const currentUser = getCurrentUser();

  // Define the booking steps
  const bookingSteps = [
    {
      id: "personalInfo",
      title: "Personal Info",
      component: PersonalInfoStep,
    },
    {
      id: "review",
      title: "Review & Submit",
      component: ReviewSubmitStep,
    },
    {
      id: "confirmation",
      title: "Confirmation",
      component: ConfirmationStep,
    },
  ];

  // Handle the completion of the booking process
  const handleBookingComplete = async (bookingData) => {
    try {
      // Calculate check_out date based on lease duration
      const moveInDate = new Date(bookingData.personalInfo?.moveInDate);
      const leaseDuration = bookingData.personalInfo?.leaseDuration;
      
      let checkOutDate = new Date(moveInDate);
      // Calculate check_out based on lease duration
      if (leaseDuration === "3-months") {
        checkOutDate.setMonth(checkOutDate.getMonth() + 3);
      } else if (leaseDuration === "6-months") {
        checkOutDate.setMonth(checkOutDate.getMonth() + 6);
      } else if (leaseDuration === "12-months") {
        checkOutDate.setFullYear(checkOutDate.getFullYear() + 1);
      } else if (leaseDuration === "18-months") {
        checkOutDate.setMonth(checkOutDate.getMonth() + 18);
      } else if (leaseDuration === "24-months") {
        checkOutDate.setFullYear(checkOutDate.getFullYear() + 2);
      } else {
        // Default to 12 months for month-to-month
        checkOutDate.setFullYear(checkOutDate.getFullYear() + 1);
      }

      // Prepare the booking data for the API (simplified)
      const apiData = {
        property_id: listingId,
        check_in: moveInDate.toISOString(),
        check_out: checkOutDate.toISOString(),
        guests: parseInt(bookingData.personalInfo?.guests || 1),
        total_price: parseFloat(bookingData.personalInfo?.monthlyIncome || 100),
        special_requests: `Applicant: ${bookingData.personalInfo?.firstName} ${bookingData.personalInfo?.lastName}\nPhone: ${bookingData.personalInfo?.phone}\nEmployer: ${bookingData.personalInfo?.employer}\nJob: ${bookingData.personalInfo?.jobTitle}\nIncome: $${bookingData.personalInfo?.monthlyIncome}\nLease: ${leaseDuration}\n\nAbout: ${bookingData.personalInfo?.aboutMe || ""}`,
      };

      // Validate required fields
      if (!apiData.property_id) {
        throw new Error("Property ID is required");
      }
      if (!apiData.check_in || !apiData.check_out) {
        throw new Error("Check-in and check-out dates are required");
      }

      console.log("Submitting booking with data:", apiData);
      console.log("Current user:", getCurrentUser());

      // Submit the booking application
      const response = await bookingsAPI.create(apiData);

      if (response) {
        toast.success("Application submitted successfully!");
        console.log("Booking created:", response);
        console.log("Booking ID:", response.id);
        console.log("User ID in booking:", response.user_id);

        // Store booking ID for reference
        localStorage.setItem('lastBookingId', response.id);

        // The wizard will automatically show the confirmation step
        return true;
      } else {
        console.error("No response from booking API");
        throw new Error("No response from booking API");
      }
    } catch (error) {
      console.error("Booking submission error:", error);

      let errorMessage = "Failed to submit application. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }

      toast.error(errorMessage);
      throw error; // Prevent moving to confirmation step
    }
  };

  // Handle cancelling the booking process
  const handleBookingCancel = () => {
    if (listingId) {
      navigate(`/user/listing/${listingId}`);
    } else {
      navigate("/user/search");
    }
  };

  // Initial data with prefilled information from property details page and user profile
  const initialBookingData = {
    listingId: listingId,
    property: property,
    // Prefill personal info with user data and selected move-in date
    personalInfo: {
      firstName: currentUser?.first_name || "",
      lastName: currentUser?.last_name || "",
      email: currentUser?.email || "",
      moveInDate: moveInDate || "",
    },
  };

  if (!listingId) {
    toast.error(
      "Property information is missing. Please select a property first."
    );
    navigate("/user/search");
    return null;
  }

  return (
    <BookingWizard
      steps={bookingSteps}
      initialData={initialBookingData}
      onComplete={handleBookingComplete}
      onCancel={handleBookingCancel}
    />
  );
};

export default BookingFlow;
