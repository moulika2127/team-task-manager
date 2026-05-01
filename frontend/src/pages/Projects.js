import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectsAPI } from '../services/api';
import './Projects.css';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll();
      setProjects(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load projects');
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
      await projectsAPI.create(formData);
      setFormData({ name: '', description: '' });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      setError('Failed to create project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsAPI.delete(id);
        fetchProjects();
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  if (loading) return <div className="loading">Loading projects...</div>;

  return (
    <div className="projects-container">
      <h1>Projects</h1>
      {error && <div className="error">{error}</div>}

      {user?.role === 'admin' && (
        <div className="create-project">
          <button
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Create Project'}
          </button>
          {showForm && (
            <form className="project-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Project Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                placeholder="Project Description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
              <button type="submit" className="btn-primary">
                Create
              </button>
            </form>
          )}
        </div>
      )}

      <div className="projects-grid">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project._id} className="project-card">
              <h3>{project.name}</h3>
              <p>{project.description || 'No description'}</p>
              <div className="project-info">
                <span>Admin: {project.admin.name}</span>
                <span>Members: {project.members.length}</span>
              </div>
              {user?.role === 'admin' && project.admin._id === user.id && (
                <div className="project-actions">
                  <button className="btn-secondary">Edit</button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDeleteProject(project._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No projects available</p>
        )}
      </div>
    </div>
  );
};

export default Projects;
