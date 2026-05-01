const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'projects',
      key: 'id',
    },
  },
  assignedToId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
    defaultValue: 'pending',
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  createdById: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  timestamps: true,
  tableName: 'tasks',
});

module.exports = Task;
