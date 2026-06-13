import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import api from '../Services/api';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [form, setForm] = useState({ title: '', description: '' });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    const userId = JSON.parse(atob(token.split('.')[1]))['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
        } catch (_err) {
            setError('Failed to load projects.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
            setForm({ ...form, [e.target.name]: e.target.value });
        };

        const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.title.trim()) {
            setError('Title is required.');
            return;
        }
        if (!form.description.trim()) {
            setError('Description is required.');
            return;
        }

        try {
            if (editingId) {
                await api.put(`/projects/${editingId}`, { ...form, userId, projectId: editingId });
            } else {
                await api.post('/projects', { ...form, userId, createdAt: new Date().toISOString() });
            }
            setForm({ title: '', description: '' });
            setEditingId(null);
            fetchProjects();
        } catch (_err) {
            setError('Failed to save project.');
        }
    };

    const handleEdit = (project) => {
        setEditingId(project.projectId);
        setForm({ title: project.title, description: project.description });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project?')) return;
        try {
            await api.delete(`/projects/${id}`);
            fetchProjects();
        } catch (_err) {
            setError('Failed to delete project.');
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setForm({ title: '', description: '' });
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Projects</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">{editingId ? 'Edit Project' : 'New Project'}</h5>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                className="form-control"
                                value={form.description}
                                onChange={handleChange}
                                rows={3}
                                required
                            />
                        </div>
                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary">
                                {editingId ? 'Update' : 'Create'}
                            </button>
                            {editingId && (
                                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {loading ? (
                <div className="text-center">
                    <span className="spinner-border" />
                </div>
            ) : projects.length === 0 ? (
                <p className="text-muted">No projects yet. Create one above.</p>
            ) : (
                <div className="row">
                    {projects.map((project) => (
                        <div className="col-md-4 mb-3" key={project.projectId}>
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{project.title}</h5>
                                    <p className="card-text text-muted">{project.description}</p>
                                </div>
                                <div className="card-footer d-flex gap-2">
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => handleEdit(project)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(project.projectId)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Projects;
