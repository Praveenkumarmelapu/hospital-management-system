const Department = require('../models/Department');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
const getDepartments = async (req, res, next) => {
  try {
    const { includeInactive } = req.query;
    const filter = includeInactive === 'true' ? {} : { status: 'active' };

    const departments = await Department.find(filter).sort({ name: 1 });
    res.json(departments);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single department by ID
// @route   GET /api/departments/:id
// @access  Public
const getDepartmentById = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new department
// @route   POST /api/departments
// @access  Private/Admin
const createDepartment = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const existing = await Department.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ message: 'Department with this name already exists' });
    }

    const department = await Department.create({
      name,
      description,
      image: image || '',
      status: 'active',
    });

    res.status(201).json(department);
  } catch (error) {
    next(error);
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private/Admin
const updateDepartment = async (req, res, next) => {
  try {
    const { name, description, image, status } = req.body;

    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    if (name) department.name = name;
    if (description) department.description = description;
    if (image !== undefined) department.image = image;
    if (status) department.status = status;

    const updated = await department.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate/Delete department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    department.status = 'inactive';
    await department.save();

    res.json({ message: 'Department deactivated successfully', id: department._id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
