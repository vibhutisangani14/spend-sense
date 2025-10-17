import api from "../lib/axios";
import type { User } from "../types/user";

type AuthResponse = {
  token: string;
  user: User;
};

export async function register(
  name: string,
  email: string,
  password: string
): Promise<User> {
  const { data } = await api.post<AuthResponse>("/api/auth/register", {
    name,
    email,
    password,
  });
  localStorage.setItem("spendsense_token", data.token);
  localStorage.setItem("spendsense_user", JSON.stringify(data.user));
  return data.user;
}

export async function login(email: string, password: string): Promise<User> {
  const { data } = await api.post<AuthResponse>("/api/auth/login", {
    email,
    password,
  });
  localStorage.setItem("spendsense_token", data.token);
  localStorage.setItem("spendsense_user", JSON.stringify(data.user));
  return data.user;
}

export function logout(): void {
  localStorage.removeItem("spendsense_token");
  localStorage.removeItem("spendsense_user");
}
