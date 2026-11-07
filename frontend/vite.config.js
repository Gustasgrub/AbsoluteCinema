import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Kūrimo (dev) serveris. Užklausos į /api persiunčiamos Laravel serveriui (php artisan serve),
// todėl naršyklei frontend ir API yra tas pats domenas – refresh slapukas veikia be CORS.
const backend = 'http://127.0.0.1:8000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': backend,
      '/docs': backend,
      '/openapi.yaml': backend,
    },
  },
});
