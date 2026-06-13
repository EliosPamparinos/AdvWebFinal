import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [form, setForm] = useState({ title: '', status: 'Pending', dueDate: '', projectId: '' });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    const userId = JSON.parse(atob(token.split('.')[1]))['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

    useEffect(() => {
        fetchTasks();
        fetchProjects();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (_err) {
            setError('Failed to load tasks.');
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
        } catch (_err) {
            setError('Failed to load projects.');
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
        if (!form.projectId) {
            setError('Please select a project.');
            return;
        }
        if (!form.dueDate) {
            setError('Due date is required.');
            return;
        }

        try {
            if (editingId) {
                await api.put(`/tasks/${editingId}`, {
                    ...form,
                    userId: parseInt(userId),
                    taskId: editingId,
                    projectId: parseInt(form.projectId)
                });
            } else {
                await api.post('/tasks', {
                    ...form,
                    userId: parseInt(userId),
                    projectId: parseInt(form.projectId)
                });
            }
            setForm({ title: '', status: 'Pending', dueDate: '', projectId: '' });
            setEditingId(null);
            fetchTasks();
        } catch (_err) {
            setError('Failed to save task.');
        }
    };

    const handleEdit = (task) => {
        setEditingId(task.taskId);
        setForm({
            title: task.title,
            status: task.status,
            dueDate: task.dueDate?.split('T')[0],
            projectId: task.projectId
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (_err) {
            setError('Failed to delete task.');
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setForm({ title: '', status: 'Pending', dueDate: '', projectId: '' });
    };

    const getProjectTitle = (projectId) => {
        const project = projects.find(p => p.projectId === projectId);
        return project ? project.title : 'Unknown';
    };

    const statusBadge = (status) => {
        const map = {
            'Pending': 'warning',
            'In Progress': 'primary',
            'Done': 'success'
        };
        return map[status] || 'secondary';
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Tasks</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">{editingId ? 'Edit Task' : 'New Task'}</h5>
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
                            <label className="form-label">Project</label>
                            <select
                                name="projectId"
                                className="form-select"
                                value={form.projectId}
                                onChange={handleChange}
                            >
                                <option value="">Select a project</option>
                                {projects.map(p => (
                                    <option key={p.projectId} value={p.projectId}>{p.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Status</label>
                            <select
                                name="status"
                                className="form-select"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                className="form-control"
                                value={form.dueDate}
                                onChange={handleChange}
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
            ) : tasks.length === 0 ? (
                <p className="text-muted">No tasks yet. Create one above.</p>
            ) : (
                <div className="row">
                    {tasks.map((task) => (
                        <div className="col-md-4 mb-3" key={task.taskId}>
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{task.title}</h5>
                                    <p className="card-text text-muted mb-1">
                                        Project: {getProjectTitle(task.projectId)}
                                    </p>
                                    <p className="card-text text-muted mb-2">
                                        Due: {task.dueDate?.split('T')[0]}
                                    </p>
                                    <span className={`badge bg-${statusBadge(task.status)}`}>
                                        {task.status}
                                    </span>
                                </div>
                                <div className="card-footer d-flex gap-2">
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => handleEdit(task)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(task.taskId)}
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

export default Tasks;