const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deactivateDoctor,
} = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.route('/')
  .get(getDoctors)
  .post(protect, adminOnly, createDoctor);

router.route('/:id')
  .get(getDoctorById)
  .put(protect, adminOnly, updateDoctor)
  .delete(protect, adminOnly, deactivateDoctor);

module.exports = router;
