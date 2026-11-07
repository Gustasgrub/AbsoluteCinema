import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.jsx';

/**
 * Duomenų gavimas iš API (GET):
 *   const { data, loading, error, reload } = useApi('/studios?page=1');
 *
 * Užklausa kartojama, kai pasikeičia adresas, prisijungęs naudotojas (kiti _links) arba iškviečiamas reload().
 * Kol kraunasi nauji duomenys, rodomi seni (data) – puslapis "nemirksi".
 */
export function useApi(path) {
  const { ready, user } = useAuth();
  const [reloadCount, setReloadCount] = useState(0);
  const [result, setResult] = useState({ key: null, data: null, error: null });

  // Unikalus užklausos raktas: adresas + naudotojas + perkrovimų skaičius
  const key = ready && path ? `${path}|${user?.id ?? 'guest'}|${reloadCount}` : null;

  useEffect(() => {
    if (!key) return undefined;
    let active = true; // jei komponentas išnyko ar adresas pasikeitė – seno atsakymo nenaudojame

    api(path).then(
      (data) => active && setResult({ key, data, error: null }),
      (error) => active && setResult({ key, data: null, error }),
    );

    return () => {
      active = false;
    };
  }, [key, path]);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);
  const loading = result.key !== key;

  return { data: result.data, error: loading ? null : result.error, loading, reload };
}
