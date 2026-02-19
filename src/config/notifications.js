// Backend server base URL
// In production, set VITE_BACKEND_URL in your Railway frontend environment variables
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5002';

export const NOTIFICATION_CONFIG = {
    ownerEmail: 'gowda2003pooja@gmail.com',
    ownerPhone: '8978925540',
    customerCarePhone: '8978925540',
    customerCareEmail: 'gowda2003pooja@gmail.com',
    backendUrl: BACKEND_URL,
};
