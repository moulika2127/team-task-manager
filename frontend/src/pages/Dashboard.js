import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { tasksAPI, projectsAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, projectsRes, tasksRes] = await Promise.all([
        tasksAPI.getDashboard(),
        projectsAPI.getAll(),
        tasksAPI.getAll(),
      ]);
      setStats(statsRes.data.data);
      setProjects(projectsRes.data.data);
      setTasks(tasksRes.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      {user?.role === 'admin' ? (
        <>
          <div className="admin-header">
            <div>
              <h1>Admin Dashboard</h1>
              <p className="header-subtitle">Complete overview of your team's progress</p>
            </div>
          </div>
          {error && <div className="error">{error}</div>}
          
          {/* Key Metrics */}
          {stats && (
            <>
              <div className="admin-metrics">
                <div className="metric-card metric-total">
                  <div className="metric-icon">📊</div>
                  <div className="metric-content">
                    <p className="metric-label">Total Tasks</p>
                    <p className="metric-value">{stats.totalTasks}</p>
                    <p className="metric-subtext">All tasks</p>
                  </div>
                </div>

                <div className="metric-card metric-completed">
                  <div className="metric-icon">✅</div>
                  <div className="metric-content">
                    <p className="metric-label">Completed</p>
                    <p className="metric-value">{stats.completedTasks}</p>
                    <p className="metric-percentage">
                      {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}% Done
                    </p>
                  </div>
                </div>

                <div className="metric-card metric-inprogress">
                  <div className="metric-icon">⚙️</div>
                  <div className="metric-content">
                    <p className="metric-label">In Progress</p>
                    <p className="metric-value">{stats.inProgressTasks}</p>
                    <p className="metric-subtext">Being worked on</p>
                  </div>
                </div>

                <div className="metric-card metric-pending">
                  <div className="metric-icon">⏳</div>
                  <div className="metric-content">
                    <p className="metric-label">Pending</p>
                    <p className="metric-value">{stats.pendingTasks}</p>
                    <p className="metric-subtext">Not started</p>
                  </div>
                </div>

                <div className="metric-card metric-overdue">
                  <div className="metric-icon">🚨</div>
                  <div className="metric-content">
                    <p className="metric-label">Overdue</p>
                    <p className="metric-value">{stats.overdueTasks}</p>
                    <p className="metric-subtext">Action needed</p>
                  </div>
                </div>

                <div className="metric-card metric-projects">
                  <div className="metric-icon">📁</div>
                  <div className="metric-content">
                    <p className="metric-label">Total Projects</p>
                    <p className="metric-value">{stats.totalProjects}</p>
                    <p className="metric-subtext">Active projects</p>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="admin-main-container">
                {/* Projects Section */}
                <div className="admin-projects-section">
                  <div className="section-header">
                    <h2>📁 Projects Overview</h2>
                    <p className="section-subtext">{projects.length} projects</p>
                  </div>
                  {projects.length > 0 ? (
                    <div className="admin-projects-grid">
                      {projects.map((project) => (
                        <div key={project._id} className="admin-project-card">
                          <div className="project-card-header">
                            <h3>{project.name}</h3>
                            <span className="project-tag">Active</span>
                          </div>
                          <p className="project-description">{project.description || 'No description provided'}</p>
                          <div className="project-stats">
                            <div className="project-stat">
                              <span className="stat-icon">👥</span>
                              <span className="stat-text">{project.members?.length || 0} members</span>
                            </div>
                            <div className="project-stat">
                              <span className="stat-icon">📋</span>
                              <span className="stat-text">{tasks.filter(t => t.projectId === project._id).length} tasks</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>📭 No projects yet. Create your first project to get started!</p>
                    </div>
                  )}
                </div>

                {/* Recent Tasks Section */}
                <div className="admin-tasks-section">
                  <div className="section-header">
                    <h2>📋 Recent Tasks</h2>
                    <p className="section-subtext">Latest activity</p>
                  </div>
                  {tasks.length > 0 ? (
                    <div className="admin-tasks-list">
                      {tasks.slice(0, 6).map((task) => (
                        <div key={task._id} className="admin-task-row">
                          <div className="task-row-left">
                            <div className="task-icon">📌</div>
                            <div className="task-info">
                              <h4>{task.title}</h4>
                              <p>{task.description || 'No description'}</p>
                            </div>
                          </div>
                          <div className="task-row-right">
                            <span className={`task-status ${task.status?.toLowerCase()}`}>
                              {task.status}
                            </span>
                            <span className={`task-priority ${task.priority?.toLowerCase()}`}>
                              {task.priority || 'Normal'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>📭 No tasks yet</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="member-header">
            <div>
              <h1>My Tasks</h1>
              <p className="header-subtitle">Track and manage your assigned tasks</p>
            </div>
          </div>
          {error && <div className="error">{error}</div>}
          
          {stats && (
            <>
              {/* Summary Cards */}
              <div className="summary-cards">
                <div className="summary-card total">
                  <div className="card-icon">📋</div>
                  <div className="card-content">
                    <p className="card-label">Total Tasks</p>
                    <p className="card-value">{stats.totalTasks}</p>
                  </div>
                </div>
                <div className="summary-card completed">
                  <div className="card-icon">✅</div>
                  <div className="card-content">
                    <p className="card-label">Completed</p>
                    <p className="card-value">{stats.completedTasks}</p>
                    <p className="card-percentage">
                      {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                    </p>
                  </div>
                </div>
                <div className="summary-card inprogress">
                  <div className="card-icon">⚙️</div>
                  <div className="card-content">
                    <p className="card-label">In Progress</p>
                    <p className="card-value">{stats.inProgressTasks}</p>
                  </div>
                </div>
                <div className="summary-card pending">
                  <div className="card-icon">⏳</div>
                  <div className="card-content">
                    <p className="card-label">Pending</p>
                    <p className="card-value">{stats.pendingTasks}</p>
                  </div>
                </div>
                <div className="summary-card overdue">
                  <div className="card-icon">🚨</div>
                  <div className="card-content">
                    <p className="card-label">Overdue</p>
                    <p className="card-value">{stats.overdueTasks}</p>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="member-dashboard-container">
                {/* Tasks List */}
                <div className="tasks-main-section">
                  <div className="section-header">
                    <h2>Recent Tasks</h2>
                  </div>
                  {tasks.length > 0 ? (
                    <div className="tasks-table-list">
                      {tasks.map((task) => (
                        <div key={task._id} className="task-row">
                          <div className="task-row-left">
                            <div className="task-icon">📌</div>
                            <div className="task-details">
                              <h4 className="task-title">{task.title}</h4>
                              <p className="task-desc">{task.description || 'No description'}</p>
                            </div>
                          </div>
                          <div className="task-row-right">
                            <span className={`task-status ${task.status.toLowerCase()}`}>
                              {task.status}
                            </span>
                            <span className={`task-priority ${task.priority?.toLowerCase()}`}>
                              {task.priority || 'Normal'}
                            </span>
                            {task.dueDate && (
                              <span className="task-due">
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>No tasks assigned yet</p>
                    </div>
                  )}
                </div>

                {/* Projects Sidebar */}
                <div className="projects-sidebar">
                  <div className="section-header">
                    <h2>Your Projects</h2>
                  </div>
                  {projects.length > 0 ? (
                    <div className="projects-list-vertical">
                      {projects.map((project) => (
                        <div key={project._id} className="project-card">
                          <div className="project-icon">📁</div>
                          <div className="project-info">
                            <h4>{project.name}</h4>
                            <p>{project.description || 'No description'}</p>
                            <span className="project-members">👥 {project.members?.length || 0} members</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>No projects yet</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
