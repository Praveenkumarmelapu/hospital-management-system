const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Department = require('../models/Department');
const User = require('../models/User');
const { generateAvailableSlots } = require('../utils/slotGenerator');

// @desc    Get available time slots for doctor & date
// @route   GET /api/appointments/available-slots
// @access  Public
const getAvailableSlots = async (req, res, next) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({ message: 'doctorId and date query parameters are required' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (doctor.status === 'inactive') {
      return res.status(400).json({ message: 'Doctor is currently inactive and not accepting new appointments' });
    }

    const result = await generateAvailableSlots(doctor, date);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Book a new appointment (With Server-Side Double-Booking Prevention)
// @route   POST /api/appointments
// @access  Private (Patient or Admin)
const bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, departmentId, appointmentDate, appointmentTime, reason, patientId } = req.body;

    if (!doctorId || !departmentId || !appointmentDate || !appointmentTime || !reason) {
      return res.status(400).json({ message: 'Please provide all required appointment fields' });
    }

    // Determine target patient: patient booking for self, or admin booking for a patient
    let targetPatientId = req.user._id;
    if (req.user.role === 'admin' && patientId) {
      targetPatientId = patientId;
    }

    // Validate Doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    if (doctor.status === 'inactive') {
      return res.status(400).json({ message: 'Selected doctor is inactive and cannot be booked.' });
    }

    // Validate Department
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    if (department.status === 'inactive') {
      return res.status(400).json({ message: 'Selected department is inactive.' });
    }

    // Date validation - past date check
    const todayStr = new Date().toISOString().split('T')[0];
    if (appointmentDate < todayStr) {
      return res.status(400).json({ message: 'Cannot book appointments for past dates' });
    }

    // CRITICAL DOUBLE-BOOKING PREVENTION
    // Check if slot is already booked for this doctor, date, and time
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate,
      appointmentTime,
      status: { $ne: 'Cancelled' },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: 'This appointment slot is no longer available. Please select another time slot.',
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient: targetPatientId,
      doctor: doctorId,
      department: departmentId,
      appointmentDate,
      appointmentTime,
      reason,
      status: 'Pending',
    });

    const populated = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone')
      .populate({
        path: 'doctor',
        select: 'name specialization profileImage consultationFee phone department',
        populate: { path: 'department', select: 'name' },
      })
      .populate('department', 'name');

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's appointments (Patient)
// @route   GET /api/appointments/my
// @access  Private (Patient)
const getMyAppointments = async (req, res, next) => {
  try {
    const { status, type } = req.query; // type: 'upcoming' or 'history'
    const query = { patient: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    if (type === 'upcoming') {
      query.appointmentDate = { $gte: todayStr };
      query.status = { $in: ['Pending', 'Confirmed'] };
    } else if (type === 'history') {
      query.$or = [
        { appointmentDate: { $lt: todayStr } },
        { status: { $in: ['Completed', 'Cancelled'] } },
      ];
    }

    const appointments = await Appointment.find(query)
      .populate({
        path: 'doctor',
        select: 'name specialization profileImage qualification consultationFee phone',
        populate: { path: 'department', select: 'name' },
      })
      .populate('department', 'name description')
      .sort({ appointmentDate: -1, appointmentTime: 1 });

    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments
// @access  Private/Admin
const getAllAppointments = async (req, res, next) => {
  try {
    const { status, doctor, patient, department, date } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }
    if (doctor) {
      query.doctor = doctor;
    }
    if (patient) {
      query.patient = patient;
    }
    if (department) {
      query.department = department;
    }
    if (date) {
      query.appointmentDate = date;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone gender dateOfBirth')
      .populate({
        path: 'doctor',
        select: 'name specialization profileImage qualification consultationFee phone status',
        populate: { path: 'department', select: 'name' },
      })
      .populate('department', 'name')
      .sort({ appointmentDate: -1, createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone gender dateOfBirth address')
      .populate({
        path: 'doctor',
        select: 'name specialization profileImage qualification consultationFee phone about availability',
        populate: { path: 'department', select: 'name' },
      })
      .populate('department', 'name description');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check ownership or admin
    if (
      req.user.role !== 'admin' &&
      appointment.patient._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this appointment' });
    }

    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (Admin)
// @route   PUT /api/appointments/:id/status
// @access  Private/Admin
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Please provide a valid status (Pending, Confirmed, Completed, Cancelled)' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    const populated = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .populate('department', 'name');

    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel appointment (Patient)
// @route   PUT /api/appointments/:id/cancel
// @access  Private (Patient or Admin)
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify patient ownership or admin
    if (
      req.user.role !== 'admin' &&
      appointment.patient.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    if (appointment.status === 'Completed') {
      return res.status(400).json({ message: 'Completed appointments cannot be cancelled' });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAvailableSlots,
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
};
