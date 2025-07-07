import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LandlordTenantCalendar.css';

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
      const date = new Date(currentYear, currentMonth, dayNumber);
      const isOtherMonth = dayNumber < 1 || dayNumber > daysInMonth;
      const isToday = date.toDateString() === today.toDateString();
      const dayEvents = isOtherMonth ? [] : getEventsForDate(date);
      
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

  const getEventTypeClass = (type) => {
    const typeMap = {
      'move-in': 'event-move-in',
      'move-out': 'event-move-out',
      'maintenance': 'event-maintenance',
      'viewing': 'event-viewing',
      'payment': 'event-payment'
    };
    return typeMap[type] || 'event-move-in';
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

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        <div className="header-content">
          <div className="logo">Wild Welcome</div>
          <nav className="landlord-nav">
            <Link to="/landlord/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/landlord/properties" className="nav-link">Properties</Link>
            <Link to="/landlord/calendar" className="nav-link active">Calendar</Link>
            <Link to="/landlord/bookings" className="nav-link">Bookings</Link>
            <Link to="/landlord/account" className="nav-link">Account</Link>
          </nav>
          <div className="user-menu">
            <div className="user-avatar">LS</div>
          </div>
        </div>
      </header>

      <div className="calendar-content">
        <div className="page-header">
          <h1 className="page-title">Tenant Calendar</h1>
          <div className="calendar-controls">
            <div className="calendar-nav">
              <button className="nav-button" onClick={() => navigateMonth(-1)}>
                ←
              </button>
              <span className="current-month">{getMonthName(currentDate)}</span>
              <button className="nav-button" onClick={() => navigateMonth(1)}>
                →
              </button>
            </div>
            <div className="view-toggle">
              <button 
                className={`view-button ${viewMode === 'month' ? 'active' : ''}`}
                onClick={() => setViewMode('month')}
              >
                Month
              </button>
              <button 
                className={`view-button ${viewMode === 'week' ? 'active' : ''}`}
                onClick={() => setViewMode('week')}
              >
                Week
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem' }}>
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
                        className={`calendar-cell ${cell.isOtherMonth ? 'other-month' : ''} ${cell.isToday ? 'today' : ''}`}
                      >
                        <div className="calendar-date">{cell.day}</div>
                        <div className="calendar-events">
                          {cell.events.map(event => (
                            <div 
                              key={event.id}
                              className={`calendar-event ${getEventTypeClass(event.type)}`}
                              title={event.title}
                            >
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
                <div className="legend-color" style={{ background: '#d1fae5' }}></div>
                <span>Move-in</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#fee2e2' }}></div>
                <span>Move-out</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#fef3c7' }}></div>
                <span>Maintenance</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#dbeafe' }}></div>
                <span>Viewing</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#f3e8ff' }}></div>
                <span>Payment</span>
              </div>
            </div>

            <h3 className="sidebar-title">Upcoming Events</h3>
            <div className="upcoming-events">
              {upcomingEvents.map(event => (
                <div key={event.id} className="event-item">
                  <div className="event-title">{event.title}</div>
                  <div className="event-details">
                    {new Date(event.date).toLocaleDateString()} • {event.property}
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
  );
};

export default LandlordTenantCalendar; 