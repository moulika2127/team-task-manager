import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tasksAPI, projectsAPI } from '../services/api';
import './Tasks.css';

const Tasks = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: projectId || '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = projectId ? { project: projectId } : {};
      const [tasksRes, projectsRes] = await Promise.all([
        tasksAPI.getAll(params),
        projectsAPI.getAll(),
      ]);
      setTasks(tasksRes.data.data);
      setProjects(projectsRes.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await tasksAPI.create(formData);
      setFormData({
        title: '',
        description: '',
        project: projectId || '',
        assignedTo: '',
        priority: 'medium',
        dueDate: '',
      });
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await tasksAPI.update(taskId, { status: newStatus });
      fetchData();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.delete(taskId);
        fetchData();
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  if (loading) return <div className="loading">Loading tasks...</div>;

  return (
    <div className="tasks-container">
      <h1>Tasks</h1>
      {error && <div className="error">{error}</div>}

      {user?.role === 'admin' && (
        <div className="create-task">
          <button
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Create Task'}
          </button>
          {showForm && (
            <form className="task-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Task Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                placeholder="Task Description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                required
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
              <button type="submit" className="btn-primary">
                Create
              </button>
            </form>
          )}
        </div>
      )}

      <div className="tasks-list">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} className="task-card">
              <div className="task-header">
                <h3>{task.title}</h3>
                <span className={`priority-badge ${task.priority}`}>
                  {task.priority}
                </span>
              </div>
              <p>{task.description || 'No description'}</p>
              <div className="task-details">
                <span className="project">{task.project?.name || 'Unknown'}</span>
                {task.dueDate && (
                  <span className="due-date">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="task-actions">
                <select
                  value={task.status}
                  onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                  className={`status-select ${task.status}`}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                {user?.role === 'admin' && (
                  <button
                    className="btn-danger"
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No tasks available</p>
        )}
      </div>
    </div>
  );
};

export default Tasks;
