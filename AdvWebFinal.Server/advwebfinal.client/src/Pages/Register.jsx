import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../Services/api';
import { useAuth } from '../Context/AuthContext';

const Register = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.username.trim()) {
            setError('Username is required.');
            return;
        }
        if (form.username.length < 3) {
            setError('Username must be at least 3 characters.');
            return;
        }
        if (!form.email.trim()) {
            setError('Email is required.');
            return;
        }
        if (!form.password.trim()) {
            setError('Password is required.');
            return;
        }
        if (form.password.trim().length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
                try {
            await api.post('/auth/register', form);
            const res = await api.post('/auth/login', {
                email: form.email,
                password: form.password
            });
            login(res.data.token);
            navigate('/projects');
        } catch (err) {
            setError(err.response?.data || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <h2 className="mb-4">Register</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="form-control"
                                value={form.username}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={form.email}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                value={form.password}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Registering...
                                </>
                            ) : 'Register'}
                        </button>
                    </form>
                    <p className="mt-3 text-center">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
