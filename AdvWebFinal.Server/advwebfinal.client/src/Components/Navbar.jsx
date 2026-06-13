import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Navbar = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
            <Link className="navbar-brand" to="/">AdvWebFinal</Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto">
                    {token && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/projects">Projects</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/tasks">Tasks</Link>
                            </li>
                        </>
                    )}
                </ul>
                <div className="d-flex gap-2">
                    {token ? (
                        <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline-light">Login</Link>
                            <Link to="/register" className="btn btn-light">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
