export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_IMAGE_URL = import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:5000';
export const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL || window.location.origin.replace('admin-', 'web-').replace('admin.', 'www.');

console.log('Final API_BASE_URL resolved to:', API_BASE_URL);
