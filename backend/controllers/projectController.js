const Project = require('../models/Project');
const User = require('../models/User');
const ProjectMember = require('../models/ProjectMember');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

// @route   POST /api/projects
// @desc    Create a new project (Admin only)
// @access  Private/Admin
exports.createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      adminId: req.user.id,
    });

    // Add admin as a member
    await ProjectMember.create({
      projectId: project.id,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/projects
// @desc    Get all projects for admin or assigned projects for member
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.role === 'admin') {
      projects = await Project.findAll({
        where: { adminId: req.user.id },
        include: [
          { model: User, as: 'admin', attributes: ['id', 'name', 'email'] },
          { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } },
        ],
      });
    } else {
      // For members: get projects where they are members
      const memberProjects = await ProjectMember.findAll({
        where: { userId: req.user.id },
        attributes: ['projectId'],
      });
      const projectIds = memberProjects.map(pm => pm.projectId);
      
      projects = await Project.findAll({
        where: { id: { [Op.in]: projectIds } },
        include: [
          { model: User, as: 'admin', attributes: ['id', 'name', 'email'] },
          { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } },
        ],
      });
    }

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/projects/:id
// @desc    Get a single project
// @access  Private
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'admin', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } },
      ],
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user is admin or member
    const isMember = project.members.some((member) => member.id === req.user.id);
    if (project.adminId !== req.user.id && !isMember) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/projects/:id
// @desc    Update a project (Admin only)
// @access  Private/Admin
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.adminId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await project.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/projects/:id
// @desc    Delete a project (Admin only)
// @access  Private/Admin
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.adminId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await project.destroy();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/projects/:id/members
// @desc    Add a team member to project (Admin only)
// @access  Private/Admin
exports.addMember = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { memberId } = req.body;
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.adminId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const existingMember = await ProjectMember.findOne({
      where: { projectId: req.params.id, userId: memberId },
    });

    if (existingMember) {
      return res.status(400).json({ success: false, message: 'Member already in project' });
    }

    await ProjectMember.create({
      projectId: req.params.id,
      userId: memberId,
    });

    const updatedProject = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'admin', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } },
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Member added successfully',
      data: updatedProject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/projects/:id/members/:memberId
// @desc    Remove a team member from project (Admin only)
// @access  Private/Admin
exports.removeMember = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.adminId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await ProjectMember.destroy({
      where: { projectId: req.params.id, userId: req.params.memberId },
    });

    const updatedProject = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'admin', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } },
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      data: updatedProject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
