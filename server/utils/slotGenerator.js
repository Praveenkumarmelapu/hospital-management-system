const Appointment = require('../models/Appointment');

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Helper to convert time string "09:00 AM" to minutes from midnight
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

// Helper to convert minutes from midnight back to "09:00 AM"
const minutesToTime = (totalMinutes) => {
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  if (hours === 0) hours = 12;

  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return `${formattedHours}:${formattedMinutes} ${period}`;
};

/**
 * Generate available slots for a doctor on a specific date YYYY-MM-DD
 */
const generateAvailableSlots = async (doctor, dateStr) => {
  if (!doctor || !dateStr) {
    return { available: false, message: 'Doctor and date are required', slots: [] };
  }

  // Parse day of week
  const dateObj = new Date(dateStr + 'T00:00:00');
  if (isNaN(dateObj.getTime())) {
    return { available: false, message: 'Invalid date format', slots: [] };
  }

  const dayName = DAYS_OF_WEEK[dateObj.getDay()];

  // Find schedule for this day
  const daySchedule = doctor.availability ? doctor.availability.find((item) => item.day === dayName) : null;

  if (!daySchedule || !daySchedule.isAvailable) {
    return {
      available: false,
      dayName,
      message: `Doctor is not available on ${dayName}s.`,
      slots: [],
    };
  }

  const startMins = timeToMinutes(daySchedule.startTime || '09:00 AM');
  const endMins = timeToMinutes(daySchedule.endTime || '01:00 PM');
  const slotDuration = doctor.slotDuration || 30;

  const allSlots = [];
  for (let current = startMins; current + slotDuration <= endMins; current += slotDuration) {
    allSlots.push(minutesToTime(current));
  }

  // Query database for existing active/confirmed/pending appointments for this doctor & date
  const bookedAppointments = await Appointment.find({
    doctor: doctor._id,
    appointmentDate: dateStr,
    status: { $ne: 'Cancelled' },
  }).select('appointmentTime');

  const bookedTimeSet = new Set(bookedAppointments.map((app) => app.appointmentTime));

  const slots = allSlots.map((timeStr) => ({
    time: timeStr,
    isBooked: bookedTimeSet.has(timeStr),
  }));

  return {
    available: true,
    dayName,
    workingHours: `${daySchedule.startTime} - ${daySchedule.endTime}`,
    slots,
  };
};

module.exports = {
  generateAvailableSlots,
  timeToMinutes,
  minutesToTime,
};
