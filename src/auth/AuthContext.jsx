import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiUrl, parseApiResponse } from '../api';

const AuthContext = createContext(null);
const TOKEN_KEY = 'roadguard.jwt';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      if (token) await fetch(apiUrl('/api/auth/logout'), { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    } catch (_error) {
      // Local logout must still succeed if the API is unavailable.
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  }, []);

  const login = useCallback(async credentials => {
    const response = await fetch(apiUrl('/api/auth/login'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials)
    });
    const data = await parseApiResponse(response);
    if (!response.ok) throw new Error(data.error || 'Unable to sign in');
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async details => {
    const response = await fetch(apiUrl('/api/auth/register'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(details)
    });
    const data = await parseApiResponse(response);
    if (!response.ok) throw new Error(data.error || 'Unable to register');
    return data;
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) return setIsLoading(false);
      try {
        const response = await fetch(apiUrl('/api/auth/me'), { headers: { Authorization: `Bearer ${token}` } });
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem(TOKEN_KEY);
          return;
        }
        if (!response.ok) throw new Error(`Unable to restore session (${response.status})`);
        const data = await parseApiResponse(response);
        setUser(data.user);
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally { setIsLoading(false); }
    };
    restoreSession();
  }, []);

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
