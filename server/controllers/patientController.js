const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Get all patients with appointment metrics
// @route   GET /api/patients
// @access  Private/Admin
const getPatients = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = { role: 'patient' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const patients = await User.find(query).select('-password').sort({ createdAt: -1 });

    // Fetch appointment count for each patient
    const patientIds = patients.map((p) => p._id);
    const appointmentCounts = await Appointment.aggregate([
      { $match: { patient: { $in: patientIds } } },
      { $group: { _id: '$patient', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    appointmentCounts.forEach((item) => {
      countMap[item._id.toString()] = item.count;
    });

    const patientsWithMetrics = patients.map((p) => ({
      ...p.toObject(),
      appointmentCount: countMap[p._id.toString()] || 0,
    }));

    res.json(patientsWithMetrics);
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient details with history
// @route   GET /api/patients/:id
// @access  Private/Admin
const getPatientById = async (req, res, next) => {
  try {
    const patient = await User.findOne({ _id: req.params.id, role: 'patient' }).select('-password');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const appointments = await Appointment.find({ patient: patient._id })
      .populate('doctor', 'name specialization profileImage consultationFee')
      .populate('department', 'name')
      .sort({ appointmentDate: -1 });

    res.json({
      patient,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update patient profile
// @route   PUT /api/patients/:id
// @access  Private (Patient or Admin)
const updatePatientProfile = async (req, res, next) => {
  try {
    const userIdToUpdate = req.params.id;

    // Check authorization: user can edit own profile, or admin can edit any
    if (req.user.role !== 'admin' && req.user._id.toString() !== userIdToUpdate) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const user = await User.findById(userIdToUpdate);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, phone, dateOfBirth, gender, address } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (gender !== undefined) user.gender = gender;
    if (address !== undefined) user.address = address;

    // Prevent changing role/email via profile update
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      dateOfBirth: updatedUser.dateOfBirth,
      gender: updatedUser.gender,
      address: updatedUser.address,
      role: updatedUser.role,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPatients,
  getPatientById,
  updatePatientProfile,
};
