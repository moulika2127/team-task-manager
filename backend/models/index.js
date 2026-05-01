const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');

// Project associations
Project.belongsTo(User, { as: 'admin', foreignKey: 'adminId' });
User.hasMany(Project, { as: 'projectsAsAdmin', foreignKey: 'adminId' });

// ProjectMember associations (many-to-many)
const ProjectMember = require('./ProjectMember');
Project.belongsToMany(User, {
  through: ProjectMember,
  as: 'members',
  foreignKey: 'projectId',
  otherKey: 'userId',
});
User.belongsToMany(Project, {
  through: ProjectMember,
  as: 'projectsAsMember',
  foreignKey: 'userId',
  otherKey: 'projectId',
});

// Task associations
Task.belongsTo(Project, { as: 'project', foreignKey: 'projectId' });
Project.hasMany(Task, { as: 'tasks', foreignKey: 'projectId' });

Task.belongsTo(User, { as: 'assignedTo', foreignKey: 'assignedToId' });
User.hasMany(Task, { as: 'tasksAssigned', foreignKey: 'assignedToId' });

Task.belongsTo(User, { as: 'createdBy', foreignKey: 'createdById' });
User.hasMany(Task, { as: 'tasksCreated', foreignKey: 'createdById' });

module.exports = { User, Project, Task, ProjectMember };
