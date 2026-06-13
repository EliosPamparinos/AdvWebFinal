import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Navbar from './Components/Navbar';
import Projects from './Pages/Projects';
import ProtectedRoute from './Pomponents/ProtectedRoute';
import Tasks from './Pages/Tasks';

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
