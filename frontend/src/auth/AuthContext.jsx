import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, endSession, mightHaveSession, refreshSession, setSessionListener, startSession, tokenClaims } from '../api/client.js';

/*
 * Prisijungusio naudotojo būsena visai programai (React Context).
 * Bet kuris komponentas gali gauti: const { user, isAdmin, login, logout } = useAuth();
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
    const claims = user ? tokenClaims() : null;

    return {
      user,
      ready,
      // Rolė paimama iš JWT žetono (claim "role")
      isAdmin: claims?.role === 'admin',

      // Grąžina { two_factor_required, two_factor_token }, jei reikia 2FA kodo
      async login(email, password) {
        const data = await api('/auth/login', { method: 'POST', body: { email, password } });
        if (!data.two_factor_required) startSession(data);
        return data;
      },

      async completeTwoFactor(twoFactorToken, code) {
        const data = await api('/auth/two-factor/challenge', {
          method: 'POST',
          body: { two_factor_token: twoFactorToken, code },
        });
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

      // Po profilio redagavimo / 2FA įjungimo atnaujiname naudotojo duomenis
      updateUser(changes) {
        setUser((current) => (current ? { ...current, ...changes } : current));
      },
    };
  }, [user, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
