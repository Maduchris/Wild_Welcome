import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import UserHeader from "../../components/user/UserHeader";
import { authAPI, usersAPI, isAuthenticated } from "../../services/api";
import { useTheme } from "../../contexts/ThemeContext";

const AccountContainer = styled.div`
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.background};
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${(props) => props.theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSizes["3xl"]};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: ${(props) => props.theme.spacing.xl};

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div``;

const ProfileCard = styled(Card)`
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${(props) => props.theme.spacing.lg};
  color: ${(props) => props.theme.colors.white};
  font-size: ${(props) => props.theme.typography.fontSizes["2xl"]};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
`;

const UserName = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSizes.xl};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const UserEmail = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const MenuCard = styled(Card)`
  padding: 0;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: ${(props) => props.theme.spacing.lg};
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.normal};
  border-bottom: 1px solid ${(props) => props.theme.colors.borderLight};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.surface};
  }

  ${(props) =>
    props.isActive &&
    `
    background-color: ${props.theme.colors.primaryLight};
    color: ${props.theme.colors.primary};
    font-weight: ${props.theme.typography.fontWeights.medium};
  `}
`;

const MenuIcon = styled.span`
  margin-right: ${(props) => props.theme.spacing.sm};
`;

const ContentSection = styled.div``;

const Section = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSizes.xl};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.lg};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${(props) => props.theme.spacing.lg};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  margin-top: ${(props) => props.theme.spacing.lg};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const NotificationSettings = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
`;

const NotificationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.spacing.lg};
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
`;

const NotificationInfo = styled.div``;

const NotificationTitle = styled.h4`
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

const NotificationDescription = styled.p`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.textSecondary};
  margin: 0;
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${(props) => props.theme.colors.primary};
  }

  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => props.theme.colors.gray[300]};
  transition: 0.4s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const UserAccount = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    bookingUpdates: true,
    newListings: true,
    promotionalEmails: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        setUserData(response);

        // Pre-fill form with user data
        setValue("firstName", response.first_name);
        setValue("lastName", response.last_name);
        setValue("email", response.email);
        setValue("phone", response.phone || "");
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast.error("Failed to load user data");
      }
    };

    fetchUserData();
  }, [setValue]);

  const handleLogout = () => {
    authAPI.logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleProfileUpdate = async (data) => {
    setIsLoading(true);
    try {
      // Prepare update data
      const updateData = {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone || "",
      };

      const updatedUser = await usersAPI.updateProfile(updateData);
      setUserData(updatedUser);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      const errorMessage =
        error.detail || error.message || "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (data) => {
    setIsLoading(true);
    try {
      // Validate passwords match
      if (data.newPassword !== data.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }

      await authAPI.changePassword(data.currentPassword, data.newPassword);
      toast.success("Password changed successfully!");

      // Reset form
      setValue("currentPassword", "");
      setValue("newPassword", "");
      setValue("confirmPassword", "");
    } catch (error) {
      console.error("Password change error:", error);
      const errorMessage =
        error.detail || error.message || "Failed to change password";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderProfileTab = () => (
    <Section>
      <SectionTitle>Personal Information</SectionTitle>
      <Form onSubmit={handleSubmit(handleProfileUpdate)}>
        <Row>
          <Input
            label="First Name"
            placeholder="Enter your first name"
            {...register("firstName", {
              required: "First name is required",
            })}
            error={errors.firstName?.message}
          />
          <Input
            label="Last Name"
            placeholder="Enter your last name"
            {...register("lastName", {
              required: "Last name is required",
            })}
            error={errors.lastName?.message}
          />
        </Row>

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          disabled
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="Enter your phone number"
          {...register("phone")}
          error={errors.phone?.message}
        />

        <ButtonGroup>
          <Button type="submit" loading={isLoading}>
            Save Changes
          </Button>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </ButtonGroup>
      </Form>
    </Section>
  );

  const renderNotificationsTab = () => (
    <Section>
      <SectionTitle>Notification Settings</SectionTitle>
      <NotificationSettings>
        <NotificationItem>
          <NotificationInfo>
            <NotificationTitle>Email Notifications</NotificationTitle>
            <NotificationDescription>
              Receive updates via email
            </NotificationDescription>
          </NotificationInfo>
          <Toggle>
            <ToggleInput
              type="checkbox"
              checked={notifications.emailNotifications}
              onChange={() => handleNotificationToggle("emailNotifications")}
            />
            <ToggleSlider />
          </Toggle>
        </NotificationItem>

        <NotificationItem>
          <NotificationInfo>
            <NotificationTitle>SMS Notifications</NotificationTitle>
            <NotificationDescription>
              Receive updates via text message
            </NotificationDescription>
          </NotificationInfo>
          <Toggle>
            <ToggleInput
              type="checkbox"
              checked={notifications.smsNotifications}
              onChange={() => handleNotificationToggle("smsNotifications")}
            />
            <ToggleSlider />
          </Toggle>
        </NotificationItem>

        <NotificationItem>
          <NotificationInfo>
            <NotificationTitle>Booking Updates</NotificationTitle>
            <NotificationDescription>
              Get notified about your booking status
            </NotificationDescription>
          </NotificationInfo>
          <Toggle>
            <ToggleInput
              type="checkbox"
              checked={notifications.bookingUpdates}
              onChange={() => handleNotificationToggle("bookingUpdates")}
            />
            <ToggleSlider />
          </Toggle>
        </NotificationItem>

        <NotificationItem>
          <NotificationInfo>
            <NotificationTitle>New Listings</NotificationTitle>
            <NotificationDescription>
              Get notified about new properties
            </NotificationDescription>
          </NotificationInfo>
          <Toggle>
            <ToggleInput
              type="checkbox"
              checked={notifications.newListings}
              onChange={() => handleNotificationToggle("newListings")}
            />
            <ToggleSlider />
          </Toggle>
        </NotificationItem>

        <NotificationItem>
          <NotificationInfo>
            <NotificationTitle>Promotional Emails</NotificationTitle>
            <NotificationDescription>
              Receive special offers and promotions
            </NotificationDescription>
          </NotificationInfo>
          <Toggle>
            <ToggleInput
              type="checkbox"
              checked={notifications.promotionalEmails}
              onChange={() => handleNotificationToggle("promotionalEmails")}
            />
            <ToggleSlider />
          </Toggle>
        </NotificationItem>
      </NotificationSettings>
    </Section>
  );

  const renderSecurityTab = () => (
    <Section>
      <SectionTitle>Security Settings</SectionTitle>
      <Form onSubmit={handleSubmit(handlePasswordChange)}>
        <Input
          label="Current Password"
          type="password"
          placeholder="Enter your current password"
          {...register("currentPassword", {
            required: "Current password is required",
          })}
          error={errors.currentPassword?.message}
        />

        <Input
          label="New Password"
          type="password"
          placeholder="Enter your new password"
          {...register("newPassword", {
            required: "New password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          error={errors.newPassword?.message}
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Confirm your new password"
          {...register("confirmPassword", {
            required: "Please confirm your password",
          })}
          error={errors.confirmPassword?.message}
        />

        <ButtonGroup>
          <Button type="submit" loading={isLoading}>
            Update Password
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              setValue("currentPassword", "");
              setValue("newPassword", "");
              setValue("confirmPassword", "");
            }}
          >
            Cancel
          </Button>
        </ButtonGroup>
      </Form>
    </Section>
  );

  return (
    <AccountContainer>
      <UserHeader />

      <MainContent>
        <PageTitle>My Account</PageTitle>

        <ContentGrid>
          <Sidebar>
            <ProfileCard>
              <Avatar>
                {userData
                  ? `${userData.first_name?.[0] || ""}${
                      userData.last_name?.[0] || ""
                    }`
                  : "U"}
              </Avatar>
              <UserName>
                {userData
                  ? `${userData.first_name || ""} ${userData.last_name || ""}`
                  : "Loading..."}
              </UserName>
              <UserEmail>{userData?.email || "Loading..."}</UserEmail>
            </ProfileCard>

            <MenuCard>
              <MenuItem
                isActive={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
              >
                <MenuIcon>
                  <FaUser />
                </MenuIcon>
                Profile
              </MenuItem>
              <MenuItem
                isActive={activeTab === "notifications"}
                onClick={() => setActiveTab("notifications")}
              >
                <MenuIcon>🔔</MenuIcon>
                Notifications
              </MenuItem>
              <MenuItem
                isActive={activeTab === "security"}
                onClick={() => setActiveTab("security")}
              >
                <MenuIcon>🔒</MenuIcon>
                Security
              </MenuItem>
              {isAuthenticated() && (
                <MenuItem
                  onClick={handleLogout}
                  style={{
                    color: theme?.colors?.error || "#EF4444",
                    borderTop: `2px solid ${
                      theme?.colors?.border || "#f1f5f9"
                    }`,
                  }}
                >
                  <MenuIcon>🚪</MenuIcon>
                  Logout
                </MenuItem>
              )}
            </MenuCard>
          </Sidebar>

          <ContentSection>
            {activeTab === "profile" && renderProfileTab()}
            {activeTab === "notifications" && renderNotificationsTab()}
            {activeTab === "security" && renderSecurityTab()}
          </ContentSection>
        </ContentGrid>
      </MainContent>
    </AccountContainer>
  );
};

export default UserAccount;
