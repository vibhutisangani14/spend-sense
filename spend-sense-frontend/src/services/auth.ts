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
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/register", {
    name,
    email,
    password,
  });

  localStorage.setItem("spendsense_token", data.token);
  localStorage.setItem("spendsense_user", JSON.stringify(data.user));
  return data;
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });

  localStorage.setItem("spendsense_token", data.token);
  localStorage.setItem("spendsense_user", JSON.stringify(data.user));
  return data;
}

export async function logout(): Promise<AuthResponse> {
  const { data } = await api.delete<AuthResponse>("/auth/logout", {});

  return data;
}
