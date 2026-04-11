import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Maximize2, 
  X, 
  Upload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock
} from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';

import { API_BASE_URL, API_IMAGE_URL } from '../constants';

const GalleryManager = () => {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImg, setSelectedImg] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const { user } = useAuth();
    
    // Upload Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newImageData, setNewImageData] = useState({ alt: '', category: 'General' });
    const [previewUrl, setPreviewUrl] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    const API_URL = `${API_BASE_URL}/gallery`;

    const categories = [
        'All', 'Annual Function', 'Competition', 'Sports', 'Yoga', 
        'Campus Life', 'Student Activities', 'Training', 'PTA', 
        'Teacher Picnic', 'Republic Day', 'General'
    ];

    const fetchImages = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setImages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch gallery:", error);
            addNotification('Connection to database failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const addNotification = (message, type = 'success') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this media permanently from the database?')) return;
        
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            
            if (res.ok) {
                setImages(prev => prev.filter(img => img._id !== id));
                addNotification('Media removed successfully');
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            addNotification('Delete operation failed', 'error');
        }
    };

    const triggerFileSelect = () => {
        document.getElementById('gallery-file-input').click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
            setNewImageData({ ...newImageData, alt: file.name.split('.')[0] });
            setIsModalOpen(true);
        }
    };

    const handlePublish = async () => {
        setIsUploading(true);
        
        try {
            const fileInput = document.getElementById('gallery-file-input');
            const file = fileInput.files[0];
            
            if (!file) {
                addNotification('Please select a file first', 'error');
                setIsUploading(false);
                return;
            }

            const formData = new FormData();
            formData.append('image', file);
            formData.append('alt', newImageData.alt || 'School Media');
            formData.append('category', newImageData.category || 'General');

            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${user?.token}`
                    // Do NOT set Content-Type header when using FormData
                },
                body: formData
            });

            const data = await res.json();
            
            setIsUploading(false);
            if (res.ok) {
                setImages(prev => [data, ...prev]);
                setIsModalOpen(false);
                setPreviewUrl('');
                setNewImageData({ alt: '', category: 'General' });
                fileInput.value = ''; // Reset input
                addNotification('Media published to live website gallery');
            } else {
                addNotification(data.message || 'Upload failed', 'error');
            }
        } catch (error) {
            console.error("Upload failed:", error);
            setIsUploading(false);
            addNotification('Network error during upload', 'error');
        }
    };

    const filteredImages = filterCategory === 'All' 
        ? images 
        : images.filter(img => img.category === filterCategory);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
                <div className="relative">
                    <RefreshCw className="w-16 h-16 text-[#8B0000] animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 bg-[#8B0000] rounded-full animate-ping"></div>
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-slate-900 dark:text-white font-black text-xl uppercase tracking-widest leading-none">Initialising Database</p>
                    <p className="text-slate-500 font-black uppercase tracking-widest text-[9px] mt-4">Establishing secure connection to school servers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
            {/* Hidden Input */}
            <input 
                type="file" 
                id="gallery-file-input" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
            />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-emerald-200/50">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Database Live
                        </span>
                        <span className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-900/30 text-[#8B0000] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-rose-200/50">
                            Professional API v2.0
                        </span>
                    </div>
                    <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Gallery Records</h2>
                    <p className="text-slate-500 font-medium mt-1">Manage institutional media with professional-grade cloud synchronization.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchImages}
                        className="p-4 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-slate-800 shadow-sm"
                        title="Refresh Data"
                    >
                        <RefreshCw size={24} />
                    </button>
                    <button 
                        onClick={triggerFileSelect}
                        disabled={isUploading}
                        className="flex items-center gap-3 bg-sky-600 hover:bg-sky-700 text-white px-10 py-5 rounded-3xl font-black shadow-xl shadow-sky-100 transition-all active:scale-95 disabled:opacity-70 group border-b-8 border-sky-800"
                    >
                        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                        PUBLISH MEDIA
                    </button>
                </div>
            </div>

            {/* Filtering & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats Summary */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-6 group hover:border-sky-200 transition-all">
                        <div className="bg-sky-50 dark:bg-sky-900/20 p-5 rounded-2xl text-sky-600 group-hover:scale-110 transition-transform"><ImageIcon size={32} /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Cloud Assets</p>
                            <p className="text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tight">{images.length}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-6">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-2xl text-emerald-600"><CheckCircle2 size={32} /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Active View</p>
                            <p className="text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tight">{filterCategory}</p>
                        </div>
                    </div>
                </div>

                {/* Filter Controls */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-3 flex items-center gap-2">
                        <RefreshCw size={12} />
                        Filter Category
                    </label>
                    <div className="relative group">
                        <select 
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-50 dark:border-slate-800 rounded-2xl px-6 py-4.5 font-bold text-slate-900 dark:text-white focus:border-sky-500 focus:bg-white transition-all outline-none cursor-pointer appearance-none shadow-inner"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat.toUpperCase()} {cat !== 'All' ? `(${images.filter(i => i.category === cat).length})` : ''}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-sky-600 transition-colors">
                            <Maximize2 size={16} className="rotate-45" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredImages.map((img) => (
                    <div 
                        key={img._id} 
                        className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                    >
                        <div className="aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                            <img 
                                src={img.src && img.src.startsWith('/') ? `${API_IMAGE_URL}${img.src}` : img.src} 
                                alt={img.alt} 
                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                loading="lazy"
                                onError={(e) => {
                                    console.log('Image load error:', img.src);
                                    e.target.src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop';
                                }}
                            />
                            
                            {/* Overlay Badge */}
                            <div className="absolute top-5 left-5">
                                <span className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.15em] border border-white/20 shadow-xl">
                                    {img.category}
                                </span>
                            </div>

                            {/* Action Buttons Layer */}
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                <button 
                                    onClick={() => setSelectedImg(img)}
                                    className="p-4 bg-white text-sky-600 rounded-2xl hover:bg-sky-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-[50ms]"
                                >
                                    <Maximize2 size={24} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(img._id)}
                                    className="p-4 bg-white text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-[100ms]"
                                >
                                    <Trash2 size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="p-8">
                            <h4 className="font-black text-slate-900 dark:text-white truncate text-xl uppercase tracking-tight" title={img.alt}>
                                {img.alt || 'Untitled Media'}
                            </h4>
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Clock size={12} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        {new Date(img.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase">
                                    ID: {img._id.slice(-6)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty State / Add Card */}
                <button 
                    onClick={triggerFileSelect}
                    className="aspect-[4/5] border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] flex flex-col items-center justify-center gap-6 text-slate-400 hover:text-sky-600 hover:border-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/10 transition-all group"
                >
                    <div className="p-10 bg-slate-50 dark:bg-slate-800 rounded-3xl group-hover:bg-sky-100 dark:group-hover:bg-sky-900/30 transition-all shadow-sm group-hover:shadow-2xl group-hover:-translate-y-3 duration-500 border border-slate-100 dark:border-slate-700">
                        <Upload size={56} className="group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="text-center">
                        <span className="font-black text-[12px] uppercase tracking-[0.4em] group-hover:text-sky-700 block mb-1">Upload Media</span>
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-sky-600/70">JPG, PNG up to 10MB</span>
                    </div>
                </button>
            </div>

            {/* Upload Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-500"
                        onClick={() => setIsModalOpen(false)}
                    ></div>
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in slide-in-from-bottom-20 duration-500 border border-white/10">
                        {/* Modal Header */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-12 py-10 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                                <span className="p-3.5 bg-sky-100 dark:bg-sky-900/30 rounded-2xl text-sky-600"><Upload size={32} /></span>
                                Publish New Records
                            </h3>
                            <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-[10px]">Verify Information before live deployment</p>
                        </div>

                        {/* Modal Body */}
                        <div className="p-12 space-y-10">
                            {/* Preview */}
                            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 shadow-inner group">
                                <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="bg-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">Selected Image Preview</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                                        <Plus size={12} /> Media Title / Description
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="Ex: Annual Sports Day 2026"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-800 rounded-2xl px-8 py-5 font-bold text-slate-900 dark:text-white placeholder:text-slate-300 focus:border-sky-500 focus:bg-white focus:ring-8 ring-sky-50 dark:ring-sky-900/10 transition-all outline-none"
                                        value={newImageData.alt}
                                        onChange={(e) => setNewImageData({...newImageData, alt: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                                        <Clock size={12} /> Target Category
                                    </label>
                                    <div className="relative">
                                        <select 
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-800 rounded-2xl px-8 py-5 font-bold text-slate-900 dark:text-white focus:border-sky-500 focus:bg-white transition-all outline-none cursor-pointer appearance-none"
                                            value={newImageData.category}
                                            onChange={(e) => setNewImageData({...newImageData, category: e.target.value})}
                                        >
                                            {categories.filter(c => c !== 'All').map(cat => (
                                                <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <Maximize2 size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-12 py-10 bg-slate-50 dark:bg-slate-800/50 flex gap-6 border-t border-slate-100 dark:border-slate-800">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 bg-white dark:bg-slate-900 text-slate-500 font-black py-5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700 tracking-widest text-[10px]"
                            >
                                DISCARD
                            </button>
                            <button 
                                onClick={handlePublish}
                                disabled={isUploading || !newImageData.alt}
                                className="flex-[2] bg-sky-600 hover:bg-sky-700 text-white font-black py-5 rounded-2xl shadow-2xl shadow-sky-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-4 border-b-8 border-sky-800 tracking-widest text-[10px]"
                            >
                                {isUploading ? (
                                    <>
                                        <RefreshCw className="animate-spin" size={20} />
                                        SYNCHRONIZING...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={20} />
                                        LIVE DEPLOYMENT
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox */}
            {selectedImg && (
                <div className="fixed inset-0 z-[150] bg-slate-950/98 flex items-center justify-center p-4 sm:p-20 animate-in fade-in duration-500">
                    <button 
                        onClick={() => setSelectedImg(null)}
                        className="absolute top-10 right-10 p-6 bg-white/5 hover:bg-white/10 text-white rounded-3xl transition-all shadow-2xl backdrop-blur-xl border border-white/10 hover:scale-110 active:scale-90"
                    >
                        <X size={32} />
                    </button>
                    <div className="max-w-7xl w-full h-full flex flex-col items-center justify-center gap-10">
                        <img 
                            src={selectedImg.src && selectedImg.src.startsWith('/') ? `${API_IMAGE_URL}${selectedImg.src}` : selectedImg.src} 
                            alt={selectedImg.alt} 
                            className="max-h-[75%] max-w-full rounded-[3rem] shadow-2xl object-contain border-4 border-white/10 animate-in zoom-in duration-700"
                        />
                        <div className="text-center">
                            <span className="bg-sky-600 text-white text-[10px] font-black px-8 py-3 rounded-full uppercase tracking-[0.3em] shadow-2xl shadow-sky-500/40 border border-sky-400/30">
                                {selectedImg.category}
                            </span>
                            <h3 className="text-5xl font-black text-white mt-10 tracking-tight uppercase max-w-3xl">{selectedImg.alt}</h3>
                        </div>
                    </div>
                </div>
            )}

            {/* Notifications */}
            <div className="fixed bottom-12 right-12 z-[200] flex flex-col gap-4">
                {notifications.map(n => (
                    <div 
                        key={n.id} 
                        className={`flex items-center gap-5 px-10 py-6 rounded-[2.5rem] shadow-2xl text-white font-black text-xs animate-in slide-in-from-right duration-500 border-l-[12px] backdrop-blur-xl ${
                            n.type === 'success' ? 'bg-emerald-600/90 border-emerald-400' : 'bg-rose-600/90 border-rose-400'
                        }`}
                    >
                        {n.type === 'success' ? <CheckCircle2 size={28} /> : <AlertCircle size={28} />}
                        <span className="tracking-widest uppercase">{n.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GalleryManager;
