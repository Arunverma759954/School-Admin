export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://school-backend-3-8r1j.onrender.com/api';
export const API_IMAGE_URL = import.meta.env.VITE_API_IMAGE_URL || 'https://school-backend-3-8r1j.onrender.com';
export const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL || 'https://school-web-sandy.vercel.app';

export const getImageUrl = (src) => {
    if (!src) return '';
    if (src.startsWith('http') || src.startsWith('data:')) return src;
    
    let path = src;
    
    // Normalize path: if it starts with /uploads/Gallery/, it's a website static asset
    if (path.startsWith('/uploads/Gallery/')) {
        path = path.replace('/uploads/Gallery/', '/Gallery/');
    }

    // Rule 1: Static Gallery images are on the Website domain
    if (path.startsWith('/Gallery/')) {
        return `${WEBSITE_URL}${path}`;
    }

    // Rule 2: Uploaded files are on the Backend domain
    if (path.startsWith('/uploads/')) {
        return `${API_IMAGE_URL}${path}`;
    }

    // Rule 3: Fallback for filename only
    return `${WEBSITE_URL}/Gallery/${path}`;
};

console.log('Final API_BASE_URL resolved to:', API_BASE_URL);
