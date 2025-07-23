import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaHome,
  FaUserPlus,
  FaUserMinus,
  FaTools,
  FaEye,
  FaDollarSign,
  FaClock,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { bookingsAPI, getCurrentUser } from "../../services/api";
import LandlordHeader from "../../components/landlord/LandlordHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
  ThemedComponentProvider,
  PageContainer,
  ContentContainer,
  PageTitle,
  PageHeader,
  LoadingState,
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

const ViewToggle = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.xs};
`;

const ViewButton = styled(Button)`
  &.active {
    background-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.white};
  }
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
    background-color: ${props.theme.colors.gray[100]};
    color: ${props.theme.colors.gray[400]};
  `}

  ${(props) =>
    props.isToday &&
    `
    background-color: ${props.theme.colors.primaryLight}20;
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
  const [viewMode, setViewMode] = useState("month");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        setUser(currentUser);

        // Fetch booking data to create calendar events
        const bookingsData = await bookingsAPI.getLandlordApplications();
        console.log("Calendar bookings data:", bookingsData);

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
              title: `Pending: ${guestName} - ${propertyName}`,
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
              title: `Move-in: ${guestName} - ${propertyName}`,
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
              title: `Move-out: ${guestName} - ${propertyName}`,
              type: "move-out",
              date: checkOutDate,
              property: propertyName,
              status: booking.status,
            });
          }

          // Add monthly payment reminders for approved bookings
          if (booking.status === "approved" && checkInDate) {
            const paymentDate = new Date(checkInDate);
            paymentDate.setDate(1); // First of each month
            paymentDate.setMonth(paymentDate.getMonth() + 1); // Next month

            calendarEvents.push({
              id: `${booking.id}-payment`,
              title: `Rent Due: ${guestName} - ${propertyName}`,
              type: "payment",
              date: paymentDate.toISOString().split("T")[0],
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

  // Fallback mock events for demo
  const mockEvents = [
    {
      id: 1,
      title: "Move-in: John Smith",
      type: "move-in",
      date: "2024-02-01",
      property: "Cozy Studio in Downtown",
    },
    {
      id: 2,
      title: "Move-out: Sarah Johnson",
      type: "move-out",
      date: "2024-02-15",
      property: "Modern 2BR Apartment",
    },
    {
      id: 3,
      title: "Maintenance: Plumbing",
      type: "maintenance",
      date: "2024-02-10",
      property: "Luxury Penthouse Suite",
    },
    {
      id: 4,
      title: "Viewing: 2:00 PM",
      type: "viewing",
      date: "2024-02-05",
      property: "Shared Room Near Campus",
    },
    {
      id: 5,
      title: "Rent Payment Due",
      type: "payment",
      date: "2024-02-01",
      property: "All Properties",
    },
  ];

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
    const eventsToUse = events.length > 0 ? events : loading ? [] : mockEvents;
    return eventsToUse.filter((event) => event.date?.startsWith(dateString));
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

  const getEventTypeClass = (type) => {
    const typeMap = {
      "move-in": "event-move-in",
      "move-out": "event-move-out",
      maintenance: "event-maintenance",
      viewing: "event-viewing",
      payment: "event-payment",
    };
    return typeMap[type] || "event-move-in";
  };

  const getEventIcon = (type) => {
    const iconMap = {
      "move-in": <FaUserPlus />,
      "move-out": <FaUserMinus />,
      maintenance: <FaTools />,
      viewing: <FaEye />,
      payment: <FaDollarSign />,
      pending: <FaClock />,
    };
    return iconMap[type] || <FaHome />;
  };

  const eventsToUse = events.length > 0 ? events : loading ? [] : mockEvents;
  const upcomingEvents = eventsToUse
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <ThemedComponentProvider>
      <div className="calendar-container">
        <LandlordHeader />

        <div className="calendar-content">
          <div className="page-header">
            <h1 className="page-title">Tenant Calendar</h1>
            <div className="calendar-controls">
              <div className="calendar-nav">
                <button
                  className="nav-button"
                  onClick={() => navigateMonth(-1)}
                >
                  ←
                </button>
                <span className="current-month">
                  {getMonthName(currentDate)}
                </span>
                <button className="nav-button" onClick={() => navigateMonth(1)}>
                  →
                </button>
              </div>
              <div className="view-toggle">
                <button
                  className={`view-button ${
                    viewMode === "month" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("month")}
                >
                  Month
                </button>
                <button
                  className={`view-button ${
                    viewMode === "week" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("week")}
                >
                  Week
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "2rem" }}>
            <div className="calendar-main" style={{ flex: 1 }}>
              <div className="calendar-grid">
                <div className="calendar-header-row">
                  <div className="calendar-header-cell">Sun</div>
                  <div className="calendar-header-cell">Mon</div>
                  <div className="calendar-header-cell">Tue</div>
                  <div className="calendar-header-cell">Wed</div>
                  <div className="calendar-header-cell">Thu</div>
                  <div className="calendar-header-cell">Fri</div>
                  <div className="calendar-header-cell">Sat</div>
                </div>

                {Array.from({ length: 6 }, (_, weekIndex) => (
                  <div key={weekIndex} className="calendar-row">
                    {Array.from({ length: 7 }, (_, dayIndex) => {
                      const cellIndex = weekIndex * 7 + dayIndex;
                      const cell = renderCalendar()[cellIndex];

                      return (
                        <div
                          key={dayIndex}
                          className={`calendar-cell ${
                            cell.isOtherMonth ? "other-month" : ""
                          } ${cell.isToday ? "today" : ""}`}
                        >
                          <div className="calendar-date">{cell.day}</div>
                          <div className="calendar-events">
                            {cell.events.map((event) => (
                              <div
                                key={event.id}
                                className={`calendar-event ${getEventTypeClass(
                                  event.type
                                )}`}
                                title={event.title}
                              >
                                <span className="event-icon">
                                  {getEventIcon(event.type)}
                                </span>
                                {event.title}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="calendar-sidebar">
              <h3 className="sidebar-title">Event Legend</h3>
              <div className="event-legend">
                <div className="legend-item">
                  <div className="legend-icon" style={{ color: "#16a34a" }}>
                    <FaUserPlus />
                  </div>
                  <span>Move-in</span>
                </div>
                <div className="legend-item">
                  <div className="legend-icon" style={{ color: "#dc2626" }}>
                    <FaUserMinus />
                  </div>
                  <span>Move-out</span>
                </div>
                <div className="legend-item">
                  <div className="legend-icon" style={{ color: "#d97706" }}>
                    <FaTools />
                  </div>
                  <span>Maintenance</span>
                </div>
                <div className="legend-item">
                  <div className="legend-icon" style={{ color: "#2563eb" }}>
                    <FaEye />
                  </div>
                  <span>Viewing</span>
                </div>
                <div className="legend-item">
                  <div className="legend-icon" style={{ color: "#7c3aed" }}>
                    <FaDollarSign />
                  </div>
                  <span>Payment</span>
                </div>
                <div className="legend-item">
                  <div className="legend-icon" style={{ color: "#ea580c" }}>
                    <FaClock />
                  </div>
                  <span>Pending</span>
                </div>
              </div>

              <h3 className="sidebar-title">Upcoming Events</h3>
              <div className="upcoming-events">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="event-item">
                    <div className="event-title">
                      <span className="event-icon">
                        {getEventIcon(event.type)}
                      </span>
                      {event.title}
                    </div>
                    <div className="event-details">
                      {new Date(event.date).toLocaleDateString()} •{" "}
                      {event.property}
                    </div>
                    <div className="event-actions">
                      <button className="event-action view-action">View</button>
                      <button className="event-action edit-action">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemedComponentProvider>
  );
};

export default LandlordTenantCalendar;
