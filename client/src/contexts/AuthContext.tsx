import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

import { User } from '../types';
import { apiClient } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (
    token: string,
    user: User
  ) => void;

  logout: () => void;

  updateUser: (
    user: User
  ) => void;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  // =========================================================
  // INITIAL USER
  // =========================================================

  const [user, setUser] =
    useState<User | null>(() => {

      try {

        const storedUser =
          localStorage.getItem('user');

        if (!storedUser) {
          return null;
        }

        return JSON.parse(
          storedUser
        ) as User;

      } catch (error) {

        console.warn(
          '[AuthContext] Invalid stored user. Clearing it.'
        );

        localStorage.removeItem(
          'user'
        );

        return null;
      }
    });

  // =========================================================
  // INITIAL TOKEN
  // =========================================================

  const [token, setToken] =
    useState<string | null>(() => {

      return localStorage.getItem(
        'token'
      );
    });

  const [loading, setLoading] =
    useState(true);

  // =========================================================
  // GET CURRENT USER FROM BACKEND
  // =========================================================

  useEffect(() => {

    const fetchCurrentUser =
      async () => {

        // No token = no authenticated session
        if (!token) {

          setUser(null);
          setLoading(false);

          return;
        }

        try {

          console.log(
            '[AuthContext] Validating current session...'
          );

          const res =
            await apiClient.get(
              '/auth/me'
            );

          if (
            res.data?.success &&
            res.data?.user
          ) {

            const currentUser =
              res.data.user as User;

            // IMPORTANT:
            // Always use the backend's current user.
            setUser(
              currentUser
            );

            localStorage.setItem(
              'user',
              JSON.stringify(
                currentUser
              )
            );

            console.log(
              '[AuthContext] Current logged-in user:',
              currentUser
            );

          } else {

            throw new Error(
              'Invalid /auth/me response'
            );
          }

        } catch (error) {

          console.warn(
            '[AuthContext] Session validation failed. Logging out.',
            error
          );

          setUser(null);
          setToken(null);

          localStorage.removeItem(
            'token'
          );

          localStorage.removeItem(
            'user'
          );

        } finally {

          setLoading(false);
        }
      };

    fetchCurrentUser();

  }, [token]);

  // =========================================================
  // LOGIN
  // =========================================================

  const login = (
    newToken: string,
    newUser: User
  ) => {

    console.log(
      '[AuthContext] Logging in user:',
      newUser
    );

    // Update React state
    setToken(
      newToken
    );

    setUser(
      newUser
    );

    // IMPORTANT:
    // Completely overwrite old login data.
    localStorage.setItem(
      'token',
      newToken
    );

    localStorage.setItem(
      'user',
      JSON.stringify(
        newUser
      )
    );
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {

    console.log(
      '[AuthContext] Logging out'
    );

    setToken(null);
    setUser(null);

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'user'
    );
  };

  // =========================================================
  // UPDATE USER
  // =========================================================

  const updateUser = (
    updatedUser: User
  ) => {

    setUser(
      updatedUser
    );

    localStorage.setItem(
      'user',
      JSON.stringify(
        updatedUser
      )
    );
  };

  // =========================================================
  // PROVIDER
  // =========================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ===========================================================
// HOOK
// ===========================================================

export const useAuth =
  () => {

    const context =
      useContext(
        AuthContext
      );

    if (!context) {

      throw new Error(
        'useAuth must be used within an AuthProvider'
      );
    }

    return context;
  };