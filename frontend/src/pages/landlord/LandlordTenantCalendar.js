import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/ui/Header';

const CalendarContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.lg};
    align-items: flex-start;
  }
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes['3xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.text};
`;

const CalendarControls = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  align-items: center;
`;

const CalendarNav = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const NavButton = styled.button`
  background: none;
  border: none;
  font-size: ${props => props.theme.typography.fontSizes.lg};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    background-color: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.primary};
  }
`;

const CurrentMonth = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.text};
  min-width: 120px;
  text-align: center;
`;

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
`;

const ViewButton = styled.button`
  background: ${props => props.isActive ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.isActive ? props.theme.colors.white : props.theme.colors.text};
  border: none;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  
  &:hover {
    background: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.surface};
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const CalendarMain = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.md};
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
`;

const CalendarHeaderCell = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.md};
  text-align: center;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

const CalendarCell = styled.div`
  background-color: ${props => props.theme.colors.surface};
  min-height: 100px;
  padding: ${props => props.theme.spacing.sm};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
  
  ${props => props.isOtherMonth && `
    background-color: ${props.theme.colors.background};
    color: ${props.theme.colors.textSecondary};
  `}
  
  ${props => props.isToday && `
    background-color: ${props.theme.colors.primaryLight};
    border: 2px solid ${props.theme.colors.primary};
  `}
`;

const CalendarDate = styled.div`
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.isOtherMonth ? props.theme.colors.textSecondary : props.theme.colors.text};
`;

const CalendarEvents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

const CalendarEvent = styled.div`
  background-color: ${props => props.color || props.theme.colors.primaryLight};
  color: ${props => props.theme.colors.text};
  padding: 2px 4px;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

const CalendarSidebar = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.md};
  height: fit-content;
`;

const SidebarTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const EventLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: ${props => props.theme.borderRadius.sm};
  background-color: ${props => props.color};
`;

const UpcomingEvents = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const EventItem = styled.div`
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  border-left: 3px solid ${props => props.theme.colors.primary};
`;

const EventTitle = styled.div`
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const EventDetails = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const EventActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
`;

const EventAction = styled.button`
  background: none;
  border: 1px solid ${props => props.theme.colors.border};
  padding: 2px 6px;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const LandlordTenantCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');

  const events = [
    {
      id: 1,
      title: "Move-in: John Smith",
      type: "move-in",
      date: "2024-02-01",
      property: "Cozy Studio in Downtown"
    },
    {
      id: 2,
      title: "Move-out: Sarah Johnson",
      type: "move-out",
      date: "2024-02-15",
      property: "Modern 2BR Apartment"
    },
    {
      id: 3,
      title: "Maintenance: Plumbing",
      type: "maintenance",
      date: "2024-02-10",
      property: "Luxury Penthouse Suite"
    },
    {
      id: 4,
      title: "Viewing: 2:00 PM",
      type: "viewing",
      date: "2024-02-05",
      property: "Shared Room Near Campus"
    },
    {
      id: 5,
      title: "Rent Payment Due",
      type: "payment",
      date: "2024-02-01",
      property: "All Properties"
    }
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
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getEventsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
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
      const isOtherMonth = dayNumber < 1 || dayNumber > daysInMonth;
      
      // Only create date object for valid days
      let date = null;
      let isToday = false;
      let dayEvents = [];
      
      if (!isOtherMonth) {
        date = new Date(currentYear, currentMonth, dayNumber);
        isToday = date.toDateString() === today.toDateString();
        dayEvents = getEventsForDate(date);
      }
      
      calendar.push({
        day: dayNumber,
        date,
        isOtherMonth,
        isToday,
        events: dayEvents
      });
    }
    
    return calendar;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getEventTypeColor = (type) => {
    const colorMap = {
      'move-in': '#d1fae5',
      'move-out': '#fee2e2',
      'maintenance': '#fef3c7',
      'viewing': '#dbeafe',
      'payment': '#f3e8ff'
    };
    return colorMap[type] || '#d1fae5';
  };

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const calendarData = renderCalendar();

  return (
    <CalendarContainer>
      <Header userType="landlord" userInitials="LS" />
      
      <MainContent>
        <PageHeader>
          <PageTitle>Tenant Calendar</PageTitle>
          <CalendarControls>
            <CalendarNav>
              <NavButton onClick={() => navigateMonth(-1)}>←</NavButton>
              <CurrentMonth>{getMonthName(currentDate)}</CurrentMonth>
              <NavButton onClick={() => navigateMonth(1)}>→</NavButton>
            </CalendarNav>
            <ViewToggle>
              <ViewButton 
                isActive={viewMode === 'month'}
                onClick={() => setViewMode('month')}
              >
                Month
              </ViewButton>
              <ViewButton 
                isActive={viewMode === 'week'}
                onClick={() => setViewMode('week')}
              >
                Week
              </ViewButton>
            </ViewToggle>
          </CalendarControls>
        </PageHeader>

        <ContentGrid>
          <CalendarMain>
            <CalendarGrid>
              <CalendarHeaderCell>Sun</CalendarHeaderCell>
              <CalendarHeaderCell>Mon</CalendarHeaderCell>
              <CalendarHeaderCell>Tue</CalendarHeaderCell>
              <CalendarHeaderCell>Wed</CalendarHeaderCell>
              <CalendarHeaderCell>Thu</CalendarHeaderCell>
              <CalendarHeaderCell>Fri</CalendarHeaderCell>
              <CalendarHeaderCell>Sat</CalendarHeaderCell>
              
              {calendarData.map((cell, index) => (
                <CalendarCell
                  key={index}
                  isOtherMonth={cell.isOtherMonth}
                  isToday={cell.isToday}
                >
                  <CalendarDate isOtherMonth={cell.isOtherMonth}>
                    {cell.day > 0 ? cell.day : ''}
                  </CalendarDate>
                  <CalendarEvents>
                          {cell.events.map(event => (
                      <CalendarEvent
                              key={event.id}
                        color={getEventTypeColor(event.type)}
                              title={event.title}
                            >
                              {event.title}
                      </CalendarEvent>
                    ))}
                  </CalendarEvents>
                </CalendarCell>
              ))}
            </CalendarGrid>
          </CalendarMain>

          <CalendarSidebar>
            <SidebarTitle>Event Legend</SidebarTitle>
            <EventLegend>
              <LegendItem>
                <LegendColor color="#d1fae5" />
                <span>Move-in</span>
              </LegendItem>
              <LegendItem>
                <LegendColor color="#fee2e2" />
                <span>Move-out</span>
              </LegendItem>
              <LegendItem>
                <LegendColor color="#fef3c7" />
                <span>Maintenance</span>
              </LegendItem>
              <LegendItem>
                <LegendColor color="#dbeafe" />
                <span>Viewing</span>
              </LegendItem>
              <LegendItem>
                <LegendColor color="#f3e8ff" />
                <span>Payment</span>
              </LegendItem>
            </EventLegend>

            <SidebarTitle>Upcoming Events</SidebarTitle>
            <UpcomingEvents>
              {upcomingEvents.map(event => (
                <EventItem key={event.id}>
                  <EventTitle>{event.title}</EventTitle>
                  <EventDetails>
                    {new Date(event.date).toLocaleDateString()} • {event.property}
                  </EventDetails>
                  <EventActions>
                    <EventAction>View</EventAction>
                    <EventAction>Edit</EventAction>
                  </EventActions>
                </EventItem>
              ))}
            </UpcomingEvents>
          </CalendarSidebar>
        </ContentGrid>
      </MainContent>
    </CalendarContainer>
  );
};

export default LandlordTenantCalendar; 