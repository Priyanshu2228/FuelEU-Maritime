import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Auth: React.FC = () => {
    const { login, logout, isAuthenticated } = useAuth();

    const handleLogin = () => {
        login();
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="auth-container">
            <h1>{isAuthenticated ? 'Welcome Back!' : 'Please Log In'}</h1>
            {isAuthenticated ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
                <button onClick={handleLogin}>Login</button>
            )}
        </div>
    );
};

export default Auth;
