import React, { useState, useEffect, createContext, useContext } from 'react';

interface User { id?: string; name?: string }

interface AuthContextType {
  isAuthenticated: boolean;
  user?: User | null;
  login: (username?: string, password?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const login = async (username?: string, password?: string) => {
    // Implement login logic here, e.g., call an API. For now set a simple dev user.
    setIsAuthenticated(true);
    setUser({ id: 'local', name: username || 'Local User' });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
