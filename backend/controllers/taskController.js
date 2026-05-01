const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

// @route   POST /api/tasks
// @desc    Create a new task (Admin only)
// @access  Private/Admin
exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { title, description, project, assignedTo, priority, dueDate } = req.body;

    // Check if user is admin of the project
    const projectDoc = await Project.findByPk(project);
    if (!projectDoc || projectDoc.adminId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const task = await Task.create({
      title,
      description,
      projectId: project,
      assignedToId: assignedTo,
      priority,
      dueDate,
      createdById: req.user.id,
    });

    const populatedTask = await Task.findByPk(task.id, {
      include: [
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name'] },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: populatedTask,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/tasks
// @desc    Get all tasks for project or user
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const { project } = req.query;
    let where = {};

    if (project) {
      // Check if user has access to project
      const projectDoc = await Project.findByPk(project);
      if (!projectDoc || (projectDoc.adminId !== req.user.id)) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
      where.projectId = project;
    }

    if (req.user.role === 'member') {
      where.assignedToId = req.user.id;
    }

    const tasks = await Task.findAll({
      where,
      include: [
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/tasks/:id
// @desc    Get a single task
// @access  Private
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name'] },
      ],
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check authorization
    const projectDoc = await Project.findByPk(task.projectId);
    if (
      projectDoc.adminId !== req.user.id &&
      task.assignedToId !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/tasks/:id
// @desc    Update a task (Admin can edit all, Member can only update status)
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check authorization
    const projectDoc = await Project.findByPk(task.projectId);

    if (req.user.role === 'admin') {
      if (projectDoc.adminId !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    } else {
      // Member can only update status of assigned tasks
      if (task.assignedToId !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
      if (req.body.status === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Members can only update task status',
        });
      }
      // Only allow status update for members
      req.body = { status: req.body.status };
    }

    await task.update(req.body);

    const updatedTask = await Task.findByPk(req.params.id, {
      include: [
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name'] },
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/tasks/:id
// @desc    Delete a task (Admin only)
// @access  Private/Admin
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const projectDoc = await Project.findByPk(task.projectId);
    if (projectDoc.adminId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await task.destroy();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/dashboard
// @desc    Get dashboard statistics
// @access  Private/Admin
exports.getDashboard = async (req, res) => {
  try {
    let taskWhere = {};
    let projectIds = [];

    if (req.user.role === 'admin') {
      // For admin: get all tasks from their projects
      const projects = await Project.findAll({ where: { adminId: req.user.id } });
      projectIds = projects.map((p) => p.id);
      taskWhere = { projectId: { [Op.in]: projectIds } };
    } else {
      // For member: get only their assigned tasks
      taskWhere = { assignedToId: req.user.id };
    }

    const totalTasks = await Task.count({ where: taskWhere });

    const completedTasks = await Task.count({
      where: {
        ...taskWhere,
        status: 'completed',
      },
    });

    const pendingTasks = await Task.count({
      where: {
        ...taskWhere,
        status: 'pending',
      },
    });

    const inProgressTasks = await Task.count({
      where: {
        ...taskWhere,
        status: 'in-progress',
      },
    });

    const overdueTasks = await Task.count({
      where: {
        ...taskWhere,
        dueDate: { [Op.lt]: new Date() },
        status: { [Op.ne]: 'completed' },
      },
    });

    const projects = req.user.role === 'admin' 
      ? await Project.findAll({ where: { adminId: req.user.id } })
      : [];

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        overdueTasks,
        totalProjects: projects.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
