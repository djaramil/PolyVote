import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const appId = import.meta.env.VITE_PARSE_APP_ID;
  const jsKey = import.meta.env.VITE_PARSE_JS_KEY;
  const serverURL = import.meta.env.VITE_PARSE_SERVER_URL || 'https://parseapi.back4app.com';

  // Check for existing session on mount
  useEffect(() => {
    const sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken) {
      fetchCurrentUser(sessionToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (sessionToken) => {
    try {
      const res = await fetch(`${serverURL}/users/me`, {
        headers: {
          'X-Parse-Application-Id': appId,
          'X-Parse-JavaScript-Key': jsKey,
          'X-Parse-Session-Token': sessionToken,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUser({ ...data, sessionToken });
      } else {
        localStorage.removeItem('sessionToken');
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      localStorage.removeItem('sessionToken');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (username, email, password) => {
    const res = await fetch(`${serverURL}/users`, {
      method: 'POST',
      headers: {
        'X-Parse-Application-Id': appId,
        'X-Parse-JavaScript-Key': jsKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Sign up failed');
    }
    const sessionToken = data.sessionToken;
    localStorage.setItem('sessionToken', sessionToken);
    setUser({ ...data, sessionToken });
    return data;
  };

  const logIn = async (username, password) => {
    const res = await fetch(`${serverURL}/login`, {
      method: 'POST',
      headers: {
        'X-Parse-Application-Id': appId,
        'X-Parse-JavaScript-Key': jsKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Log in failed');
    }
    const sessionToken = data.sessionToken;
    localStorage.setItem('sessionToken', sessionToken);
    setUser({ ...data, sessionToken });
    return data;
  };

  const logOut = async () => {
    try {
      if (user?.sessionToken) {
        await fetch(`${serverURL}/logout`, {
          method: 'POST',
          headers: {
            'X-Parse-Application-Id': appId,
            'X-Parse-JavaScript-Key': jsKey,
            'X-Parse-Session-Token': user.sessionToken,
          },
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('sessionToken');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
