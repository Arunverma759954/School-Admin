export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://school-backend-3-8r1j.onrender.com/api';
export const API_IMAGE_URL = import.meta.env.VITE_API_IMAGE_URL || 'https://school-backend-3-8r1j.onrender.com';
export const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL || 'https://school-web-rho-drab.vercel.app';

export const getImageUrl = (src) => {
    if (!src) return '';
    if (src.startsWith('http') || src.startsWith('data:')) return src;
    
    let path = src;
    
    // Normalize path: everything in the database should be treated as arriving from the backend's /uploads
    // If it already has /uploads/, leave it. If not, add it.
    if (!path.startsWith('/uploads/')) {
        path = `/uploads${path.startsWith('/') ? '' : '/'}${path}`;
    }

    return `${API_IMAGE_URL}${path}`;
};

console.log('Final API_BASE_URL resolved to:', API_BASE_URL);
