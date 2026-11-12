
import { useState, type ReactNode } from "react";

import type {
  AuthUser,
  LoginCredentials,
} from "../types/auth.types";

import { loginUser } from "../services/authService";
import { AuthContext } from "./AuthContextValue";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const savedUser = sessionStorage.getItem("supportdesk_user");

      return savedUser
        ? (JSON.parse(savedUser) as AuthUser)
        : null;
    } catch {
      sessionStorage.removeItem("supportdesk_user");
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);

    try {
      const authenticatedUser = await loginUser(credentials);

      sessionStorage.setItem(
        "supportdesk_user",
        JSON.stringify(authenticatedUser)
      );

      setUser(authenticatedUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("supportdesk_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
