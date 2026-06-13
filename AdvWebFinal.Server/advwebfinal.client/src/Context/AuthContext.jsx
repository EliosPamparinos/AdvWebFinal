import { createContext, useContext, useState, useMemo } from 'react';

const AuthContext = createContext(null);

const getRole = (tkn) => {
    if (!tkn) return null;
    return JSON.parse(atob(tkn.split('.')[1]))['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    const role = useMemo(() => getRole(token), [token]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, role }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);