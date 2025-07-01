import { createContext, useContext, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: "1",
    name: "Hunter Gillispie",
    email: "alex@builder.io",
    avatar: "https://bit.ly/sage-adebayo",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@builder.io",
    avatar: "https://bit.ly/dan-abramov",
  },
  {
    id: "3",
    name: "Mike Rodriguez",
    email: "mike@builder.io",
    avatar: "https://bit.ly/ryan-florence",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // For demo purposes, always return the first mock user as authenticated
  const user = mockUsers[0];

  const login = async (email: string, password: string) => {
    // Mock login - in real app would validate credentials
    console.log("Mock login:", email, password);
  };

  const logout = () => {
    // Mock logout - in real app would clear tokens/session
    console.log("Mock logout");
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: true, // Always authenticated for demo
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { mockUsers };
