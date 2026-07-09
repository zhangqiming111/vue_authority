import { STORAGE_KEYS } from '@/constants/storage';

export function getToken() {
  return sessionStorage.getItem(STORAGE_KEYS.TOKEN);
}

export function setAuthSession({ token, userId, userType, permissions = [] }) {
  sessionStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.LOGIN_ID, userId);
  localStorage.setItem(STORAGE_KEYS.USER_TYPE, userType);
  localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(permissions));
}

export function clearAuthSession() {
  sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.LOGIN_ID);
  localStorage.removeItem(STORAGE_KEYS.USER_TYPE);
  localStorage.removeItem(STORAGE_KEYS.PERMISSIONS);
}

export function getPermissions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PERMISSIONS) || '[]');
  } catch {
    return [];
  }
}
