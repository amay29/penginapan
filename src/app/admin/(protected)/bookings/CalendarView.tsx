"use client";

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useMemo } from 'react';
import './calendar-custom.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarView({ bookings }: { bookings: any[] }) {
  const events = useMemo(() => {
    return bookings.map(b => ({
      id: b.id,
      title: `${b.unit.name} - ${b.guestName}`,
      start: new Date(b.checkIn),
      end: new Date(b.checkOut),
      status: b.status,
      unitName: b.unit.name,
    }));
  }, [bookings]);

  const eventPropGetter = (event: any) => {
    let backgroundColor = '#333';
    
    if (event.status === 'CONFIRMED') backgroundColor = 'rgba(212, 175, 55, 0.2)'; // Gold-ish
    if (event.status === 'PENDING') backgroundColor = 'rgba(255, 255, 255, 0.1)';
    if (event.status === 'CANCELLED') backgroundColor = 'rgba(239, 68, 68, 0.2)'; // Red-ish

    return {
      style: {
        backgroundColor,
        border: `1px solid ${event.status === 'CONFIRMED' ? 'rgba(212, 175, 55, 0.5)' : 'rgba(255,255,255,0.2)'}`,
        color: event.status === 'CONFIRMED' ? '#d4af37' : '#fff',
        fontSize: '11px',
        borderRadius: '2px',
        padding: '2px 4px',
      }
    };
  };

  return (
    <div className="bg-surface-900 border border-surface-600/30 p-5 rounded-sm h-[600px] custom-calendar-wrapper">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        eventPropGetter={eventPropGetter}
        views={['month', 'week', 'day']}
        defaultView="month"
      />
    </div>
  );
}
