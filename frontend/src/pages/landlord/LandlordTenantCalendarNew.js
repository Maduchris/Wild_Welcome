import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { bookingsAPI } from "../../services/api";
import LandlordHeader from "../../components/landlord/LandlordHeader";
import {
  ThemedComponentProvider,
  PageContainer,
  ContentContainer,
  PageTitle,
  PageHeader,
  LoadingState,
  Card,
  Button,
} from "../../components/ui/ThemeProvider";

const MainContent = styled(ContentContainer)`
  max-width: 1200px;
  padding: ${(props) => props.theme.spacing.xl};
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const CalendarControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
`;

const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`;

const MonthTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSizes.xl};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text};
  margin: 0;
  min-width: 200px;
  text-align: center;
`;

const NavButton = styled(Button)`
  min-width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: ${(props) => props.theme.colors.border};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  overflow: hidden;
`;

const CalendarHeaderCell = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  padding: ${(props) => props.theme.spacing.md};
  text-align: center;
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
`;

const CalendarCell = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  min-height: 120px;
  padding: ${(props) => props.theme.spacing.xs};
  position: relative;
  transition: background-color ${(props) => props.theme.transitions.normal};

  ${(props) =>
    props.isOtherMonth &&
    `
    background-color: ${props.theme.colors.gray[200]};
    color: ${props.theme.colors.gray[400]};
  `}

  ${(props) =>
    props.isToday &&
    `
    background-color: ${props.theme.colors.primary}10;
    border: 2px solid ${props.theme.colors.primary};
  `}

  &:hover {
    background-color: ${(props) => props.theme.colors.hover}20;
  }
`;

const DayNumber = styled.div`
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.xs};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};

  ${(props) =>
    props.isToday &&
    `
    color: ${props.theme.colors.primary};
  `}
`;

const EventDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin: 2px 0;

  &.move-in {
    background-color: ${(props) => props.theme.colors.success};
  }
  &.move-out {
    background-color: ${(props) => props.theme.colors.warning};
  }
  &.payment {
    background-color: ${(props) => props.theme.colors.primary};
  }
  &.pending {
    background-color: ${(props) => props.theme.colors.error};
  }
`;

const EventText = styled.div`
  font-size: 10px;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LegendCard = styled(Card)`
  margin-bottom: ${(props) => props.theme.spacing.lg};
  padding: ${(props) => props.theme.spacing.md};
`;

const LegendTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text};
  margin: 0 0 ${(props) => props.theme.spacing.md} 0;
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`;

const LegendGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${(props) => props.theme.spacing.md};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.text};
`;

const LegendDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;

  &.move-in {
    background-color: ${(props) => props.theme.colors.success};
  }
  &.move-out {
    background-color: ${(props) => props.theme.colors.warning};
  }
  &.payment {
    background-color: ${(props) => props.theme.colors.primary};
  }
  &.pending {
    background-color: ${(props) => props.theme.colors.error};
  }
`;

const LandlordTenantCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch booking data to create calendar events
        const bookingsData = await bookingsAPI.getLandlordApplications();

        // Transform bookings into calendar events
        const calendarEvents = [];

        (bookingsData || []).forEach((booking) => {
          const checkInDate = booking.check_in_date || booking.created_at;
          const checkOutDate = booking.check_out_date;
          const propertyName = booking.property_title || "Unknown Property";
          const guestName = booking.user_name || "Guest";

          // Add booking status event
          if (booking.status === "pending") {
            calendarEvents.push({
              id: `${booking.id}-pending`,
              title: `Pending: ${guestName}`,
              type: "pending",
              date: checkInDate,
              property: propertyName,
              status: booking.status,
            });
          }

          // Add move-in event for approved bookings
          if (booking.status === "approved" && checkInDate) {
            calendarEvents.push({
              id: `${booking.id}-check-in`,
              title: `Move-in: ${guestName}`,
              type: "move-in",
              date: checkInDate,
              property: propertyName,
              status: booking.status,
            });
          }

          // Add move-out event for approved bookings
          if (booking.status === "approved" && checkOutDate) {
            calendarEvents.push({
              id: `${booking.id}-checkout`,
              title: `Move-out: ${guestName}`,
              type: "move-out",
              date: checkOutDate,
              property: propertyName,
              status: booking.status,
            });
          }
        });

        setEvents(calendarEvents);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
        toast.error("Failed to load calendar data");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    return { daysInMonth, startingDay };
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const getEventsForDate = (date) => {
    const dateString = date.toISOString().split("T")[0];
    return events.filter((event) => event.date?.startsWith(dateString));
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
    const today = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const calendar = [];
    const totalCells = 42; // 6 weeks * 7 days

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startingDay + 1;
      const date = new Date(currentYear, currentMonth, dayNumber);
      const isOtherMonth = dayNumber < 1 || dayNumber > daysInMonth;
      const isToday = date.toDateString() === today.toDateString();
      const dayEvents = isOtherMonth ? [] : getEventsForDate(date);

      calendar.push({
        day: dayNumber,
        date,
        isOtherMonth,
        isToday,
        events: dayEvents,
      });
    }

    return calendar;
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  if (loading) {
    return (
      <ThemedComponentProvider>
        <PageContainer>
          <LandlordHeader />
          <MainContent>
            <LoadingState>
              <h2>Loading Calendar...</h2>
              <p>Please wait while we fetch your calendar data.</p>
            </LoadingState>
          </MainContent>
        </PageContainer>
      </ThemedComponentProvider>
    );
  }

  return (
    <ThemedComponentProvider>
      <PageContainer>
        <LandlordHeader />
        <MainContent>
          <PageHeader>
            <PageTitle>Tenant Calendar</PageTitle>
          </PageHeader>

          <LegendCard>
            <LegendTitle>
              <FaCalendarAlt />
              Event Legend
            </LegendTitle>
            <LegendGrid>
              <LegendItem>
                <LegendDot className="move-in" />
                <span>Move-in</span>
              </LegendItem>
              <LegendItem>
                <LegendDot className="move-out" />
                <span>Move-out</span>
              </LegendItem>
              <LegendItem>
                <LegendDot className="payment" />
                <span>Payment Due</span>
              </LegendItem>
              <LegendItem>
                <LegendDot className="pending" />
                <span>Pending Application</span>
              </LegendItem>
            </LegendGrid>
          </LegendCard>

          <Card>
            <CalendarHeader>
              <CalendarControls>
                <MonthNavigation>
                  <NavButton
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth(-1)}
                  >
                    <FaChevronLeft />
                  </NavButton>
                  <MonthTitle>{getMonthName(currentDate)}</MonthTitle>
                  <NavButton
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth(1)}
                  >
                    <FaChevronRight />
                  </NavButton>
                </MonthNavigation>
              </CalendarControls>
            </CalendarHeader>

            <CalendarGrid>
              <CalendarHeaderCell>Sun</CalendarHeaderCell>
              <CalendarHeaderCell>Mon</CalendarHeaderCell>
              <CalendarHeaderCell>Tue</CalendarHeaderCell>
              <CalendarHeaderCell>Wed</CalendarHeaderCell>
              <CalendarHeaderCell>Thu</CalendarHeaderCell>
              <CalendarHeaderCell>Fri</CalendarHeaderCell>
              <CalendarHeaderCell>Sat</CalendarHeaderCell>

              {renderCalendar().map((day, index) => (
                <CalendarCell
                  key={index}
                  isOtherMonth={day.isOtherMonth}
                  isToday={day.isToday}
                >
                  <DayNumber isToday={day.isToday}>
                    {day.isOtherMonth ? "" : day.day}
                  </DayNumber>

                  {day.events.map((event, eventIndex) => (
                    <motion.div
                      key={`${event.id}-${eventIndex}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: eventIndex * 0.1 }}
                    >
                      <EventDot className={event.type} />
                      <EventText>{event.title}</EventText>
                    </motion.div>
                  ))}
                </CalendarCell>
              ))}
            </CalendarGrid>
          </Card>
        </MainContent>
      </PageContainer>
    </ThemedComponentProvider>
  );
};

export default LandlordTenantCalendar;
