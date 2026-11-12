import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, endSession, mightHaveSession, refreshSession, setSessionListener, startSession } from '../api/client.js';

/*
 * Prisijungusio naudotojo būsena visai programai (React Context).
 * Bet kuris komponentas gali gauti: const { user, login, logout } = useAuth();
 * Ką naudotojas gali daryti, sąsaja sprendžia ne pagal rolę, o pagal API atsiųstas _links nuorodas.
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // ready – ar jau pabandėme atkurti sesiją po puslapio perkrovimo (svečiui nieko atkurti nereikia)
  const [ready, setReady] = useState(() => !mightHaveSession());

  useEffect(() => {
    // client.js praneša, kai žetonas gaunamas, atnaujinamas ar sesija baigiasi
    setSessionListener((session) => setUser(session ? session.user : null));

    // Puslapio užkrovimas: access žetono atmintyje nebėra, bet gal yra refresh slapukas
    if (mightHaveSession()) {
      refreshSession().finally(() => setReady(true));
    }
  }, []);

  const value = useMemo(() => {
    return {
      user,
      ready,

      async login(email, password) {
        const data = await api('/auth/login', { method: 'POST', body: { email, password } });
        startSession(data);
        return data;
      },

      async register(form) {
        const data = await api('/auth/register', { method: 'POST', body: form });
        startSession(data);
        return data;
      },

      async logout() {
        try {
          await api('/auth/logout', { method: 'POST' });
        } finally {
          endSession();
        }
      },
    };
  }, [user, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
