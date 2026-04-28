const ADMIN_SESSION_KEY = 'luchem_admin_authenticated';

export const isAdminSession = () => {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
};

export const setAdminSession = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
  }
};

export const clearAdminSession = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }
};
