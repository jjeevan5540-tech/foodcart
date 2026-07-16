// Backend server base URL
// In production, set VITE_BACKEND_URL in your Railway frontend environment variables
const rawUrl = import.meta.env.VITE_BACKEND_URL || '';
export const BACKEND_URL = rawUrl === '/' ? '' : rawUrl.replace(/\/$/, '');

export const NOTIFICATION_CONFIG = {
    ownerEmail: 'jjeevan5540@gmail.com',
    ownerPhone: '8978925540',
    customerCarePhone: '8978925540',
    customerCareEmail: 'jjeevan5540@gmail.com',
    backendUrl: BACKEND_URL,
};
