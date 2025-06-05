import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('hotelUser');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('hotelUser');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call
    // For demo purposes, we'll just check if the credentials match
    // In a real app, this would be an API call
    let userData: User | null = null;

    if (email === 'admin@hotel.com' && password === 'password') {
      userData = {
        id: '1',
        name: 'Admin User',
        email: 'admin@hotel.com',
        role: 'admin',
      };
    } else if (email === 'owner@hotel.com' && password === 'password') {
      userData = {
        id: '2',
        name: 'Owner User',
        email: 'owner@hotel.com',
        role: 'owner',
      };
    } else if (email === 'attendant@hotel.com' && password === 'password') {
      userData = {
        id: '3',
        name: 'Attendant User',
        email: 'attendant@hotel.com',
        role: 'attendant',
      };
    }
    
    if (userData) {
      setUser(userData);
      localStorage.setItem('hotelUser', JSON.stringify(userData));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hotelUser');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};