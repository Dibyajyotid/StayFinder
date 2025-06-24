import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export interface User {
  _id: string;
  userName: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (avatar: string) => Promise<void>;
  loading: boolean;
  isUpdatingProfile: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get<User>(
        "http://localhost:2000/api/auth/check",
        { withCredentials: true }
      );
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      setUser(null);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setLoading(false);
  };

  const updateProfile = async (avatar: string) => {
    setIsUpdatingProfile(true);

    try {
      await axios.patch(
        "http://localhost:2000/api/auth/avatar",
        { avatar },
        {
          withCredentials: true,
        }
      );

      // setUser(res.data);
      await checkAuth();
      toast.success("Avataar updated successfully");
      // localStorage.setItem("user", JSON.stringify(res.data));
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:2000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("user");
      setUser(null);
      navigate("/");
      // await checkAuth();
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("user");
      setUser(null);
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, isUpdatingProfile, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
