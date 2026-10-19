import { apiUrl } from "@/services/api";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'employee';
}

export interface LoginResponse {
  success: boolean;
  message: string;
  email?: string;
  needsOtp?: boolean;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: any;
}

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export async function register(data: RegisterData): Promise<{ success: boolean; message: string; user?: any }> {
  try {
    const role = data.role === 'admin' ? 'HR' : 'EMPLOYEE';
    const response = await fetch(apiUrl('/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: data.name, email: data.email, password: data.password, role }),
    });
    const result = await response.json();
    if (response.ok && result.success) return { success: true, message: result.message || 'Registration successful', user: result.user };
    return { success: false, message: result.message || 'Registration failed' };
  } catch (error) {
    console.error('Registration error', error);
    return { success: false, message: 'Network error - please check if server is running' };
  }
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(apiUrl('/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    if (result.success) return { success: true, message: result.message, email: result.email, needsOtp: !!result.needsOtp };
    return { success: false, message: result.message || 'Login failed' };
  } catch (error) {
    console.error('Login error', error);
    return { success: false, message: 'Network error - please check if server is running' };
  }
}

export async function verifyOtp(email: string, otp: string): Promise<VerifyOtpResponse> {
  try {
    const response = await fetch(apiUrl('/auth/verify-otp'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Verify OTP error', error);
    return { success: false, message: 'Network error - please check if server is running' };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('scolagest-auth-token');
    if (!token) return null;
    const response = await fetch(apiUrl('/auth/me'), { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
    if (!response.ok) return null;
    const result = await response.json();
    return result as User;
  } catch (error) {
    console.error('Get current user error', error);
    return null;
  }
}
