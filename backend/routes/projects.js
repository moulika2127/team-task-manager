const express = require('express');
const { body, query } = require('express-validator');
const projectController = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All project routes are protected
router.use(protect);

// Create project (Admin only)
router.post(
  '/',
  authorize('admin'),
  [body('name', 'Project name is required').notEmpty()],
  projectController.createProject
);

// Get all projects
router.get('/', projectController.getProjects);

// Get single project
router.get('/:id', projectController.getProject);

// Update project (Admin only)
router.put(
  '/:id',
  authorize('admin'),
  [body('name', 'Project name is required').notEmpty()],
  projectController.updateProject
);

// Delete project (Admin only)
router.delete('/:id', authorize('admin'), projectController.deleteProject);

// Add member (Admin only)
router.post(
  '/:id/members',
  authorize('admin'),
  [body('memberId', 'Member ID is required').notEmpty()],
  projectController.addMember
);

// Remove member (Admin only)
router.delete('/:id/members/:memberId', authorize('admin'), projectController.removeMember);

module.exports = router;
