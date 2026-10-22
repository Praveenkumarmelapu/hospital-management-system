const express = require('express');
const router = express.Router();
const {
  getAvailableSlots,
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/available-slots', getAvailableSlots);

router.route('/')
  .post(protect, bookAppointment)
  .get(protect, adminOnly, getAllAppointments);

router.get('/my', protect, getMyAppointments);

router.get('/:id', protect, getAppointmentById);
router.put('/:id/status', protect, adminOnly, updateAppointmentStatus);
router.put('/:id/cancel', protect, cancelAppointment);

module.exports = router;
