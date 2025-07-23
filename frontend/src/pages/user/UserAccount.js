import React from 'react';
import UserHeader from '../../components/user/UserHeader';
import AccountPage from '../../components/ui/AccountPage';

const UserAccount = () => {
  return (
    <AccountPage 
      Header={UserHeader}
      userType="user"
      redirectPath="/login"
      dashboardPath="/user"
    />
  );
};

export default UserAccount;