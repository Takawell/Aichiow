// lib/userStorage.ts

export type UserData = {
  isLoggedIn: boolean;
  avatar?: string; // base64 image string
};

const STORAGE_KEY = "aichiow_user";

export function saveUserData(data: UserData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getUserData(): UserData | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearUserData() {
  localStorage.removeItem(STORAGE_KEY);
}
