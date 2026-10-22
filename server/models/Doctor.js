const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  startTime: {
    type: String,
    default: '09:00 AM',
  },
  endTime: {
    type: String,
    default: '01:00 PM',
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Doctor email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    profileImage: {
      type: String,
      default: '',
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department reference is required'],
    },
    qualification: {
      type: String,
      required: [true, 'Qualification is required'],
    },
    experience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: 0,
    },
    about: {
      type: String,
      default: '',
    },
    consultationFee: {
      type: Number,
      required: [true, 'Consultation fee is required'],
    },
    availability: [availabilitySchema],
    slotDuration: {
      type: Number,
      default: 30, // in minutes
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Doctor', doctorSchema);
