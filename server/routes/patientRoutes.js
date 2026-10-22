const express = require('express');
const router = express.Router();
const {
  getPatients,
  getPatientById,
  updatePatientProfile,
} = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', protect, adminOnly, getPatients);
router.get('/:id', protect, adminOnly, getPatientById);
router.put('/:id', protect, updatePatientProfile);

module.exports = router;
