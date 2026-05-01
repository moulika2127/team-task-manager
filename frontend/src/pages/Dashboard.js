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
          <h1>Admin Dashboard</h1>
          {error && <div className="error">{error}</div>}
          <div className="dashboard-container">
            <div className="stats-section">
              {stats && (
                <>
                  <h2>Task Statistics</h2>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <h3>Total Tasks</h3>
                      <p className="stat-number">{stats.totalTasks}</p>
                    </div>
                    <div className="stat-card">
                      <h3>Completed</h3>
                      <p className="stat-number completed">{stats.completedTasks}</p>
                    </div>
                    <div className="stat-card">
                      <h3>In Progress</h3>
                      <p className="stat-number in-progress">{stats.inProgressTasks}</p>
                    </div>
                    <div className="stat-card">
                      <h3>Pending</h3>
                      <p className="stat-number pending">{stats.pendingTasks}</p>
                    </div>
                    <div className="stat-card">
                      <h3>Overdue</h3>
                      <p className="stat-number overdue">{stats.overdueTasks}</p>
                    </div>
                    <div className="stat-card">
                      <h3>Total Projects</h3>
                      <p className="stat-number">{stats.totalProjects}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="tasks-section">
              <div className="dashboard-section">
                <h2>Projects Overview</h2>
                {projects.length > 0 ? (
                  <div className="projects-list">
                    {projects.map((project) => (
                      <div key={project._id} className="project-item">
                        <h3>{project.name}</h3>
                        <p>{project.description || 'No description'}</p>
                        <span className="member-count">Members: {project.members.length}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No projects yet</p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1>Member Dashboard</h1>
          {error && <div className="error">{error}</div>}
          <div className="dashboard-container">
            <div className="stats-section">
              {stats && (
                <>
                  <h2>Task Statistics</h2>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <h3>Total Tasks</h3>
                      <p className="stat-number">{stats.totalTasks}</p>
                    </div>
                    <div className="stat-card">
                      <h3>Completed</h3>
                      <p className="stat-number completed">{stats.completedTasks}</p>
                    </div>
                    <div className="stat-card">
                      <h3>In Progress</h3>
                      <p className="stat-number in-progress">{stats.inProgressTasks}</p>
                    </div>
                    <div className="stat-card">
                      <h3>Pending</h3>
                      <p className="stat-number pending">{stats.pendingTasks}</p>
                    </div>
                    <div className="stat-card">
                      <h3>Overdue</h3>
                      <p className="stat-number overdue">{stats.overdueTasks}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="tasks-section">
              <div className="dashboard-section">
                <h2>Your Assigned Tasks</h2>
                {tasks.length > 0 ? (
                  <div className="tasks-list">
                    {tasks.map((task) => (
                      <div key={task._id} className="task-item">
                        <h3>{task.title}</h3>
                        <p>{task.description || 'No description'}</p>
                        <div className="task-meta">
                          <span className={`status ${task.status}`}>{task.status}</span>
                          <span className={`priority ${task.priority}`}>{task.priority}</span>
                          {task.dueDate && (
                            <span className="due-date">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No tasks assigned yet</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
