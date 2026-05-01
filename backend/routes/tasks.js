const express = require('express');
const { body } = require('express-validator');
const taskController = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All task routes are protected
router.use(protect);

// Create task (Admin only)
router.post(
  '/',
  authorize('admin'),
  [
    body('title', 'Task title is required').notEmpty(),
    body('project', 'Project ID is required').notEmpty(),
    body('assignedTo', 'Assigned user ID is required').notEmpty(),
  ],
  taskController.createTask
);

// Get tasks
router.get('/', taskController.getTasks);

// Get single task
router.get('/:id', taskController.getTask);

// Update task
router.put(
  '/:id',
  [body('status', 'Invalid status').optional().isIn(['pending', 'in-progress', 'completed'])],
  taskController.updateTask
);

// Delete task (Admin only)
router.delete('/:id', authorize('admin'), taskController.deleteTask);

// Get dashboard stats
router.get('/dashboard/stats', taskController.getDashboard);

module.exports = router;
