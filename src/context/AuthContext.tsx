import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AppRole = "admin" | "enseignant" | "eleve";

export type AppUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AppRole;
  name: string;
  studentId?: number;
};

type LoginResult = {
  success: boolean;
  needsOtp?: boolean;
  message?: string;
  user?: AppUser;
};

export type CheckEmailResult = {
  found: boolean;
  type?: "STUDENT" | "TEACHER" | "ADMIN";
  fullName?: string;
  alreadyRegistered?: boolean;
};

// Base URL of the Spring Boot backend. Use relative path so Vite dev proxy can forward requests.
const API_BASE_URL = import.meta.env['VITE_API_BASE_URL'] ?? "/api/auth";

const USER_STORAGE_KEY = "scolagest-auth-user";
const TOKEN_STORAGE_KEY = "scolagest-auth-token";

function mapBackendRole(role: string | undefined): AppRole {
  const value = (role ?? "").trim().toUpperCase().replace(/^ROLE_/, "");
  if (value === "ADMIN" || value === "ADMINISTRATOR" || value === "ADMINISTRATEUR") return "admin";
  if (value === "TEACHER" || value === "TITULAIRE" || value === "ENSEIGNANT") return "enseignant";
  return "eleve";
}

// Read the role out of a JWT payload without verifying the signature.
// Used as a fallback when the backend does not return a user object.
function decodeJwtPayload(token: string | undefined | null): Record<string, any> | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function mapApiUserToAppUser(apiUser: Record<string, any> | undefined | null): AppUser {
  const role = mapBackendRole(apiUser?.['role']);
  const firstName: string = apiUser?.['firstName'] ?? "";
  const lastName: string  = apiUser?.['lastName']  ?? "";
  const apiFull: string   = apiUser?.['fullName']  ?? "";

  const fullName = `${firstName} ${lastName}`.trim() || apiFull;

  const idVal       = String(apiUser?.['id'] ?? apiUser?.['studentId'] ?? apiUser?.['username'] ?? apiUser?.['email'] ?? "");
  const emailVal    = apiUser?.['email'] ?? apiUser?.['username'] ?? "";
  const usernameVal = apiUser?.['username'] ?? undefined;

  return {
    id: idVal,
    studentId: apiUser?.['studentId'] != null ? Number(apiUser['studentId']) : undefined,
    email: emailVal,
    firstName: firstName || apiFull.split(' ')[0] || "",
    lastName:  lastName  || apiFull.split(' ').slice(1).join(' ') || "",
    role,
    name: fullName || usernameVal || emailVal || "",
  };
}

function readStoredUser(): AppUser | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AppUser;
  } catch {
    return null;
  }
}

function persistUser(user: AppUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return;
  }
  window.localStorage.removeItem(USER_STORAGE_KEY);
}

async function apiRequest<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers ?? {}),
    },
  };

  let response: Response;

  try {
    console.log(`Making ${config.method || 'GET'} request to: ${API_BASE_URL}${path}`);
    response = await fetch(`${API_BASE_URL}${path}`, config);
  } catch (error) {
    console.error("Network error:", error);
    throw new Error("Unable to reach the server. Please check your connection and try again.");
  }

  const text = await response.text().catch(() => "");
  console.log(`Response status: ${response.status}`);
  console.log(`Response body:`, text);

  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || "Empty response from server" };
  }

  if (!response.ok) {
    const message = data?.message ?? data?.error ?? text ?? `HTTP ${response.status}`;
    const err = new Error(message) as Error & { status?: number; body?: any };
    err.status = response.status;
    err.body = data;
    throw err;
  }

  return data as T;
}

type AuthContextValue = {
  user: AppUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  loginStudent: (fullName: string, password: string) => Promise<LoginResult>;
  verifyOtp: (email: string, otp: string) => Promise<LoginResult>;
  checkEmail: (email: string) => Promise<CheckEmailResult>;
  register: (payload: { email: string; password: string }) => Promise<LoginResult>;
  forgotPassword: (email: string) => Promise<LoginResult>;
  validateResetToken: (token: string) => Promise<{ success: boolean; email?: string; message?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<LoginResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(readStoredUser);

  useEffect(() => {
    persistUser(user);
  }, [user]);

  // In AuthContext.tsx - Update the login function

const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
  const normalizedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();

  if (!normalizedEmail || !trimmedPassword) {
    return { success: false, message: "Please enter your email and password." };
  }

  try {
    const payload = { 
      email: normalizedEmail, 
      password: trimmedPassword 
    };
    
    console.log("Auth.login: sending payload", payload);
    
    const data = await apiRequest("/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    console.log("Auth.login: received response", data);

    // If the backend indicates an OTP step is required, respect it even if a token
    // was included by mistake. We won't persist tokens until OTP is verified.
    const otpRequired = Boolean(data?.needsOtp || data?.requiresOtp || data?.otpRequired);
    if (otpRequired) {
      return { success: true, needsOtp: true, message: data.message || "OTP required" };
    }

    // If login was successful and a token is present, persist user + token.
    if (data.success === true && data.token) {
      const resolvedUser = mapApiUserToAppUser(data.user);
      setUser(resolvedUser);

      // Store token
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(resolvedUser));

      return {
        success: true,
        user: resolvedUser,
        message: data.message || "Login successful",
      };
    }

    // If the response doesn't have success=true but has a token, still try to log in
    if (data.token && data.user) {
      const resolvedUser = mapApiUserToAppUser(data.user);
      setUser(resolvedUser);
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(resolvedUser));

      return {
        success: true,
        user: resolvedUser,
        message: data.message || "Login successful",
      };
    }

    return {
      success: false,
      message: data.message || "Login failed. Please check your credentials.",
    };
  } catch (error: any) {
    console.error("Login error:", error);
    
    // Handle specific HTTP status codes
    if (error?.status === 401) {
      return { success: false, message: "Invalid email or password. Please try again." };
    }
    if (error?.status === 403) {
      return { success: false, message: "Access denied. Please check your credentials." };
    }
    if (error?.status === 415) {
      return { success: false, message: "Server error: Unsupported content type. Please contact support." };
    }
    if (error?.status === 500) {
      return { success: false, message: "Server error. Please try again later." };
    }
    
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Login failed. Please try again." 
    };
  }
}, []);

  const verifyOtp = useCallback(async (email: string, otp: string): Promise<LoginResult> => {
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedOtp = otp.trim();

    if (!normalizedEmail || !/^[0-9]{4,6}$/.test(trimmedOtp)) {
      return { success: false, message: "Invalid verification code." };
    }

    try {
      const data = await apiRequest("/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email: normalizedEmail, otp: trimmedOtp }),
      });

      if (!data.success) return { success: false, message: data.message ?? "Verification failed." };

      if (data.token && typeof window !== "undefined") {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      }

      if (data.user) {
        const resolvedUser = mapApiUserToAppUser(data.user);
        setUser(resolvedUser);
        return { success: true, user: resolvedUser, message: data.message };
      }

      return { success: true, message: data.message };
    } catch (error: any) {
      return { success: false, message: error instanceof Error ? error.message : "Verification failed." };
    }
  }, []);

  const checkEmail = useCallback(async (email: string): Promise<CheckEmailResult> => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return { found: false };
    }

    try {
      const data = await apiRequest(`/check-email?email=${encodeURIComponent(normalizedEmail)}`, {
        method: "GET",
      });

      return {
        found: Boolean(data.found),
        type: data.type,
        fullName: data.fullName,
        alreadyRegistered: Boolean(data.alreadyRegistered),
      };
    } catch (error) {
      console.error("Check email error:", error);
      return { found: false };
    }
  }, []);

  const register = useCallback(
    async (payload: { email: string; password: string }): Promise<LoginResult> => {
      const email = payload.email.trim().toLowerCase();
      const password = payload.password.trim();

      if (!email || !password) return { success: false, message: "Please provide email and password." };

      try {
        const data = await apiRequest("/register", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        if (!data.success) return { success: false, message: data.message ?? "Registration failed." };

        // Some backends return user/token on register Ã¢â‚¬â€ handle that
        if (data.token && typeof window !== "undefined") {
          window.localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
        }
        if (data.user) {
          const resolvedUser = mapApiUserToAppUser(data.user);
          setUser(resolvedUser);
          return { success: true, user: resolvedUser, message: data.message };
        }

        return { success: true, message: data.message ?? "Registration successful." };
      } catch (error: any) {
        return { success: false, message: error instanceof Error ? error.message : "Registration failed." };
      }
    },
    [],
  );

  const forgotPassword = useCallback(async (email: string): Promise<LoginResult> => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return { success: false, message: "Please enter your email." };

    try {
      const data = await apiRequest("/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: normalizedEmail }),
      });

      return { success: Boolean(data.success), message: data.message };
    } catch (error: any) {
      return { success: false, message: error instanceof Error ? error.message : "Could not send the reset link." };
    }
  }, []);

  const validateResetToken = useCallback(async (token: string) => {
    if (!token || token.length < 8) return { success: false, message: "This reset link is invalid or expired." };

    try {
      const data = await apiRequest("/validate-reset-token", {
        method: "POST",
        body: JSON.stringify({ token }),
      });

      return { success: Boolean(data.success), email: data.email, message: data.message };
    } catch (error: any) {
      return { success: false, message: error instanceof Error ? error.message : "This reset link is invalid or expired." };
    }
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string): Promise<LoginResult> => {
    if (!token || token.length < 8) return { success: false, message: "Invalid reset token." };
    if (!newPassword || newPassword.trim().length < 6) return { success: false, message: "The new password must be at least 6 characters long." };

    try {
      const data = await apiRequest("/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password: newPassword.trim() }),
      });

      // If the backend returns user/token after reset, persist them
      if (data.token && typeof window !== "undefined") {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      }
      if (data.user) {
        const resolvedUser = mapApiUserToAppUser(data.user);
        setUser(resolvedUser);
        return { success: true, user: resolvedUser, message: data.message };
      }

      return { success: Boolean(data.success), message: data.message };
    } catch (error: any) {
      return { success: false, message: error instanceof Error ? error.message : "Could not reset the password." };
    }
  }, []);

  const loginStudent = useCallback(
    async (fullName: string, password: string): Promise<LoginResult> => {
      const trimmedName = fullName.trim();
      const trimmedPass = password.trim();

      if (!trimmedName || !trimmedPass) {
        return { success: false, message: 'Entrez votre nom complet et mot de passe.' };
      }

      try {
        const data = await apiRequest('/student/login', {
          method: 'POST',
          body: JSON.stringify({ fullName: trimmedName, password: trimmedPass }),
        });

        if (data.success && data.user) {
          const resolvedUser = mapApiUserToAppUser(data.user);
          setUser(resolvedUser);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(resolvedUser));
          if (data.token) localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          return { success: true, user: resolvedUser, message: data.message || 'Connexion rÃ©ussie' };
        }

        return { success: false, message: data.message || 'Identifiants invalides.' };
      } catch (error: any) {
        if (error?.status === 401) return { success: false, message: 'Nom ou mot de passe incorrect.' };
        return { success: false, message: error instanceof Error ? error.message : 'Ã‰chec de connexion.' };
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(USER_STORAGE_KEY);
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, []);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      loginStudent,
      verifyOtp,
      checkEmail,
      register,
      forgotPassword,
      validateResetToken,
      resetPassword,
      logout,
    }),
    [user, login,
      loginStudent, verifyOtp, checkEmail, register, forgotPassword, validateResetToken, resetPassword, logout],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
