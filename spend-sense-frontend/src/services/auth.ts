import api from "../lib/axios";
import type { User } from "../types/user";

// نوع پاسخ از سرور
type AuthResponse = {
  token: string;
  user: User;
};

// ثبت‌نام
export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/register", {
    name,
    email,
    password,
  });

  // ذخیره در localStorage
  localStorage.setItem("spendsense_token", data.token);
  localStorage.setItem("spendsense_user", JSON.stringify(data.user));

  return data;
}

// ورود
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/login", {
    email,
    password,
  });

  // ذخیره در localStorage
  localStorage.setItem("spendsense_token", data.token);
  localStorage.setItem("spendsense_user", JSON.stringify(data.user));

  return data;
}

// خروج
export function logout(): void {
  localStorage.removeItem("spendsense_token");
  localStorage.removeItem("spendsense_user");
}
