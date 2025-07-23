import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { bookingsAPI } from "../../services/api";
import toast from "react-hot-toast";
import BookingWizard from "../../components/booking/BookingWizard";
import PersonalInfoStep from "../../components/booking/PersonalInfoStep";
import ReviewSubmitStep from "../../components/booking/ReviewSubmitStep";
import ConfirmationStep from "../../components/booking/ConfirmationStep";

const BookingFlow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get("listingId");

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
      // Prepare the booking data for the API
      const apiData = {
        property_id: listingId,
        move_in_date: bookingData.personalInfo?.moveInDate,
        lease_duration: bookingData.personalInfo?.leaseDuration,
        monthly_income: parseFloat(
          bookingData.personalInfo?.monthlyIncome || 0
        ),
        employer: bookingData.personalInfo?.employer,
        job_title: bookingData.personalInfo?.jobTitle,
        phone: bookingData.personalInfo?.phone,
        about_me: bookingData.personalInfo?.aboutMe || "",
      };

      console.log("Submitting booking with data:", apiData);

      // Submit the booking application
      const response = await bookingsAPI.create(apiData);

      if (response) {
        toast.success("Application submitted successfully!");
        console.log("Booking created:", response);

        // The wizard will automatically show the confirmation step
        return true;
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

  // Initial data (can be populated from user profile or other sources)
  const initialBookingData = {
    listingId: listingId,
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
