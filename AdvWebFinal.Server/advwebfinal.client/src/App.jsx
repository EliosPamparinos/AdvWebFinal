import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Projects from './pages/Projects';
import ProtectedRoute from './components/ProtectedRoute';
import Tasks from './pages/Tasks';

const App = () => {
    return (
        <>
        <Navbar />
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/projects" element={
                <ProtectedRoute>
                    <Projects />
                </ProtectedRoute>
            } />
            <Route path="/tasks" element={
                <ProtectedRoute>
                    <Tasks />
                </ProtectedRoute>
            } />
        </Routes>
        </>
    );
};

export default App;