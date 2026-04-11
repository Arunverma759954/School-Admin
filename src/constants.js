export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';
export const API_IMAGE_URL = import.meta.env.VITE_API_IMAGE_URL || 'http://127.0.0.1:5000';

console.log('Final API_BASE_URL resolved to:', API_BASE_URL);
