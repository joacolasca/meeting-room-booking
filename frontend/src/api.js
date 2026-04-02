const viteApi = import.meta.env.VITE_API_URL;
const trimmed = typeof viteApi === 'string' ? viteApi.trim().replace(/\/$/, '') : '';

export const API = trimmed || 'http://localhost:3001/api';

if (import.meta.env.PROD && !trimmed) {
  console.error(
    '[API] VITE_API_URL no estaba definida al compilar. El frontend sigue usando localhost. ' +
      'En Vercel: Settings → Environment Variables → VITE_API_URL = https://<tu-servicio>.onrender.com/api ' +
      '(Production y Preview), luego Redeploy. Las variables Vite solo se aplican en un build nuevo.'
  );
}
