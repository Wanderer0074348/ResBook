"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";

interface UserProfile {
  id: string;
  githubUsername: string;
  completedWorkflows: string[];
  savedItems: Array<{ type: string; slug: string; savedAt: string }>;
  endorsements: Record<string, number>;
  createdAt: string;
}

const STORAGE_KEY = "resbook-user-profile";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadUser = () => {
    if (typeof window === "undefined") return;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  const login = (githubUsername: string) => {
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      githubUsername,
      completedWorkflows: [],
      savedItems: [],
      endorsements: {},
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    router.refresh();
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    router.refresh();
  };

  const addCompletedWorkflow = (workflowSlug: string) => {
    if (!user) return;
    if (user.completedWorkflows.includes(workflowSlug)) return;
    
    const updated = {
      ...user,
      completedWorkflows: [...user.completedWorkflows, workflowSlug],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setUser(updated);
  };

  const addEndorsement = (slug: string) => {
    if (!user) return;
    
    const current = user.endorsements[slug] || 0;
    const updated = {
      ...user,
      endorsements: {
        ...user.endorsements,
        [slug]: current + 1,
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        loadUser,
        addCompletedWorkflow,
        addEndorsement,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

import { createContext, useContext } from "react";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (githubUsername: string) => void;
  logout: () => void;
  loadUser: () => void;
  addCompletedWorkflow: (workflowSlug: string) => void;
  addEndorsement: (slug: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function AuthButton() {
  const { user, login, logout } = useAuth();
  const [username, setUsername] = useState("");

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          @{user.githubUsername}
        </span>
        <span className="text-xs text-gray-500">
          {user.completedWorkflows.length} workflows
        </span>
        <button
          onClick={logout}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="GitHub username"
        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-black"
      />
      <button
        onClick={() => username && login(username)}
        disabled={!username}
        className="px-3 py-2 text-sm bg-gray-900 dark:bg-white text-white dark:text-black disabled:opacity-50"
      >
        <User className="w-4 h-4" />
      </button>
    </div>
  );
}
