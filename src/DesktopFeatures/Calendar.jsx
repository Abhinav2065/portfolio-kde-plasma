import React, { useState, useEffect } from 'react';
import './Features.css';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Calendar = ({ onClose }) => {
  const [currentNow, setCurrentNow] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('days'); // 'days' | 'months' | 'years'
  const [newEventText, setNewEventText] = useState('');
  const [showAddEvent, setShowAddEvent] = useState(false);

  // Events stored in state (initialized with clean sample events)
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('kde_calendar_events');
      if (saved) return JSON.parse(saved);
    } catch {}
    const now = new Date();
    const todayKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    return {
      [todayKey]: ['Arch Linux & Hyprland setup', 'Portfolio project showcase']
    };
  });

  // Keep events synced with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kde_calendar_events', JSON.stringify(events));
    } catch {}
  }, [events]);

  // Live timer for exact clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  // Navigation handlers
  const handlePrev = (e) => {
    e.stopPropagation();
    if (viewMode === 'days') {
      setViewDate(new Date(viewYear, viewMonth - 1, 1));
    } else if (viewMode === 'months') {
      setViewDate(new Date(viewYear - 1, viewMonth, 1));
    } else if (viewMode === 'years') {
      setViewDate(new Date(viewYear - 10, viewMonth, 1));
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (viewMode === 'days') {
      setViewDate(new Date(viewYear, viewMonth + 1, 1));
    } else if (viewMode === 'months') {
      setViewDate(new Date(viewYear + 1, viewMonth, 1));
    } else if (viewMode === 'years') {
      setViewDate(new Date(viewYear + 10, viewMonth, 1));
    }
  };

  const handleTodayClick = (e) => {
    e.stopPropagation();
    const today = new Date();
    setViewDate(today);
    setSelectedDate(today);
    setViewMode('days');
  };

  // Generate 42 cells (6 rows x 7 days) for clean grid
  const generateDaysGrid = () => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    let startDay = firstDayOfMonth.getDay() - 1;
    if (startDay === -1) startDay = 6; // Sunday -> index 6

    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const cells = [];

    // Previous month trailing days
    for (let i = startDay - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const dateObj = new Date(viewYear, viewMonth - 1, dayNum);
      cells.push({
        day: dayNum,
        date: dateObj,
        isCurrentMonth: false,
        isPrevMonth: true
      });
    }

    // Current month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const dateObj = new Date(viewYear, viewMonth, d);
      cells.push({
        day: d,
        date: dateObj,
        isCurrentMonth: true
      });
    }

    // Next month leading days
    const remaining = 42 - cells.length;
    for (let n = 1; n <= remaining; n++) {
      const dateObj = new Date(viewYear, viewMonth + 1, n);
      cells.push({
        day: n,
        date: dateObj,
        isCurrentMonth: false,
        isNextMonth: true
      });
    }

    return cells;
  };

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const daysCells = generateDaysGrid();

  const selectedKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
  const selectedDayEvents = events[selectedKey] || [];

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventText.trim()) return;
    setEvents(prev => ({
      ...prev,
      [selectedKey]: [...(prev[selectedKey] || []), newEventText.trim()]
    }));
    setNewEventText('');
    setShowAddEvent(false);
  };

  const handleDeleteEvent = (index) => {
    setEvents(prev => {
      const list = [...(prev[selectedKey] || [])];
      list.splice(index, 1);
      if (list.length === 0) {
        const next = { ...prev };
        delete next[selectedKey];
        return next;
      }
      return { ...prev, [selectedKey]: list };
    });
  };

  const decadeStart = Math.floor(viewYear / 10) * 10;
  const decadeYears = Array.from({ length: 12 }, (_, i) => decadeStart - 1 + i);

  return (
    <div className="kde-calendar-window" onClick={(e) => e.stopPropagation()}>
      {/* Top Header Bar */}
      <div className="kde-cal-header">
        <div className="kde-cal-title-wrapper">
          {viewMode === 'days' && (
            <button
              type="button"
              className="kde-cal-title-btn"
              onClick={() => setViewMode('months')}
              title="Select Month"
            >
              {MONTH_NAMES[viewMonth]} {viewYear} <span className="kde-cal-chevron">▾</span>
            </button>
          )}
          {viewMode === 'months' && (
            <button
              type="button"
              className="kde-cal-title-btn"
              onClick={() => setViewMode('years')}
              title="Select Year"
            >
              {viewYear} <span className="kde-cal-chevron">▾</span>
            </button>
          )}
          {viewMode === 'years' && (
            <span className="kde-cal-decade-title">
              {decadeStart} – {decadeStart + 9}
            </span>
          )}
        </div>

        <div className="kde-cal-controls">
          <button
            type="button"
            className="kde-cal-btn-today"
            onClick={handleTodayClick}
            title="Today"
          >
            Today
          </button>
          <button
            type="button"
            className="kde-cal-nav-btn"
            onClick={handlePrev}
            title="Previous"
          >
            ‹
          </button>
          <button
            type="button"
            className="kde-cal-nav-btn"
            onClick={handleNext}
            title="Next"
          >
            ›
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="kde-cal-body">
        {viewMode === 'days' && (
          <>
            {/* Weekdays Header */}
            <div className="kde-cal-weekdays">
              {WEEKDAY_NAMES.map((name, i) => (
                <div key={i} className={`kde-cal-weekday ${i >= 5 ? 'weekend' : ''}`}>
                  {name}
                </div>
              ))}
            </div>

            {/* Days 7x6 Grid */}
            <div className="kde-cal-days-grid">
              {daysCells.map((cell, idx) => {
                const isToday = isSameDay(cell.date, currentNow);
                const isSelected = isSameDay(cell.date, selectedDate);
                const cellKey = `${cell.date.getFullYear()}-${cell.date.getMonth() + 1}-${cell.date.getDate()}`;
                const hasEvents = !!events[cellKey] && events[cellKey].length > 0;

                return (
                  <button
                    key={idx}
                    type="button"
                    className={`kde-cal-day ${!cell.isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedDate(cell.date);
                      if (!cell.isCurrentMonth) {
                        setViewDate(new Date(cell.date.getFullYear(), cell.date.getMonth(), 1));
                      }
                    }}
                  >
                    <span className="kde-cal-day-text">{cell.day}</span>
                    {hasEvents && <span className="kde-cal-event-dot" />}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {viewMode === 'months' && (
          <div className="kde-cal-picker-grid">
            {MONTH_SHORT.map((mName, mIdx) => {
              const isCurrent = currentNow.getFullYear() === viewYear && currentNow.getMonth() === mIdx;
              const isSelected = viewMonth === mIdx;
              return (
                <button
                  key={mIdx}
                  type="button"
                  className={`kde-cal-picker-tile ${isCurrent ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setViewDate(new Date(viewYear, mIdx, 1));
                    setViewMode('days');
                  }}
                >
                  {mName}
                </button>
              );
            })}
          </div>
        )}

        {viewMode === 'years' && (
          <div className="kde-cal-picker-grid">
            {decadeYears.map((yr, yIdx) => {
              const isCurrent = currentNow.getFullYear() === yr;
              const isSelected = viewYear === yr;
              const isOut = yIdx === 0 || yIdx === 11;
              return (
                <button
                  key={yIdx}
                  type="button"
                  className={`kde-cal-picker-tile ${isOut ? 'other-month' : ''} ${isCurrent ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setViewDate(new Date(yr, viewMonth, 1));
                    setViewMode('months');
                  }}
                >
                  {yr}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Events / Agenda Section */}
      <div className="kde-cal-agenda">
        <div className="kde-cal-agenda-header">
          <span className="kde-cal-agenda-date">
            {selectedDate.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <button
            type="button"
            className="kde-cal-add-btn"
            onClick={() => setShowAddEvent(prev => !prev)}
            title="Add Event"
          >
            {showAddEvent ? '✕' : '+ Add Event'}
          </button>
        </div>

        {showAddEvent && (
          <form className="kde-cal-event-form" onSubmit={handleAddEvent}>
            <input
              type="text"
              className="kde-cal-event-input"
              placeholder="Event description..."
              value={newEventText}
              onChange={(e) => setNewEventText(e.target.value)}
              autoFocus
            />
            <button type="submit" className="kde-cal-event-submit">Save</button>
          </form>
        )}

        <div className="kde-cal-events-list">
          {selectedDayEvents.length > 0 ? (
            selectedDayEvents.map((evt, idx) => (
              <div key={idx} className="kde-cal-event-item">
                <span className="kde-cal-event-badge" />
                <span className="kde-cal-event-title">{evt}</span>
                <button
                  type="button"
                  className="kde-cal-event-del"
                  onClick={() => handleDeleteEvent(idx)}
                  title="Remove event"
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <div className="kde-cal-no-events">No events scheduled</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
