const Doctor = require('../models/Doctor');
const Department = require('../models/Department');

// Default schedule template for 7 days
const getDefaultAvailability = () => [
  { day: 'Monday', startTime: '09:00 AM', endTime: '01:00 PM', isAvailable: true },
  { day: 'Tuesday', startTime: '09:00 AM', endTime: '01:00 PM', isAvailable: true },
  { day: 'Wednesday', startTime: '09:00 AM', endTime: '01:00 PM', isAvailable: true },
  { day: 'Thursday', startTime: '02:00 PM', endTime: '06:00 PM', isAvailable: true },
  { day: 'Friday', startTime: '09:00 AM', endTime: '01:00 PM', isAvailable: true },
  { day: 'Saturday', startTime: '10:00 AM', endTime: '02:00 PM', isAvailable: true },
  { day: 'Sunday', startTime: '09:00 AM', endTime: '01:00 PM', isAvailable: false },
];

// @desc    Get all doctors (with search & filters)
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res, next) => {
  try {
    const { department, specialization, search, minExperience, includeInactive } = req.query;

    const query = {};

    if (includeInactive !== 'true') {
      query.status = 'active';
    }

    if (department) {
      query.department = department;
    }

    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    if (minExperience) {
      query.experience = { $gte: Number(minExperience) };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { qualification: { $regex: search, $options: 'i' } },
      ];
    }

    const doctors = await Doctor.find(query)
      .populate('department', 'name image description status')
      .sort({ createdAt: -1 });

    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('department', 'name image description');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new doctor
// @route   POST /api/doctors
// @access  Private/Admin
const createDoctor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      profileImage,
      specialization,
      department,
      qualification,
      experience,
      about,
      consultationFee,
      availability,
      slotDuration,
    } = req.body;

    if (!name || !email || !phone || !specialization || !department || !qualification || !consultationFee) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const deptExists = await Department.findById(department);
    if (!deptExists) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }

    const doctorExists = await Doctor.findOne({ email: email.toLowerCase() });
    if (doctorExists) {
      return res.status(400).json({ message: 'Doctor with this email already exists' });
    }

    const doctor = await Doctor.create({
      name,
      email: email.toLowerCase(),
      phone,
      profileImage: profileImage || '',
      specialization,
      department,
      qualification,
      experience: Number(experience) || 0,
      about: about || '',
      consultationFee: Number(consultationFee),
      availability: availability && availability.length ? availability : getDefaultAvailability(),
      slotDuration: Number(slotDuration) || 30,
      status: 'active',
    });

    const populatedDoctor = await Doctor.findById(doctor._id).populate('department', 'name');
    res.status(201).json(populatedDoctor);
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor details
// @route   PUT /api/doctors/:id
// @access  Private/Admin
const updateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const fieldsToUpdate = [
      'name',
      'email',
      'phone',
      'profileImage',
      'specialization',
      'department',
      'qualification',
      'experience',
      'about',
      'consultationFee',
      'availability',
      'slotDuration',
      'status',
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        doctor[field] = req.body[field];
      }
    });

    const updatedDoctor = await doctor.save();
    const populated = await Doctor.findById(updatedDoctor._id).populate('department', 'name');
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate doctor
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
const deactivateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.status = 'inactive';
    await doctor.save();

    res.json({ message: 'Doctor deactivated successfully. Appointment history preserved.', id: doctor._id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deactivateDoctor,
};
