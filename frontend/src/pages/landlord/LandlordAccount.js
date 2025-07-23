import React from 'react';
import LandlordHeader from '../../components/landlord/LandlordHeader';
import AccountPage from '../../components/ui/AccountPage';

const LandlordAccount = () => {
  return (
    <AccountPage 
      Header={LandlordHeader}
      userType="landlord"
      redirectPath="/login"
      dashboardPath="/landlord"
    />
  );
};

export default LandlordAccount;