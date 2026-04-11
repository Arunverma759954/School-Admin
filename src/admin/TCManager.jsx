import React, { useState, useEffect } from 'react';
import { 
    FileText,
    Plus,
    Trash2,
    Search,
    User,
    GraduationCap,
    Clock,
    X,
    CheckCircle2,
    Edit,
    Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';

import { API_BASE_URL, API_IMAGE_URL } from '../constants';

const TCManager = () => {
    const [tcs, setTcs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [newTC, setNewTC] = useState({ studentName: '', admissionNo: '', issueDate: '', className: '', tcNumber: '' });
    const [editTC, setEditTC] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [tcPreview, setTcPreview] = useState(null);
    const { user } = useAuth();
    const API_URL = `${API_BASE_URL}/tc`;

    useEffect(() => {
        fetchTCs();
    }, [user]);

    const fetchTCs = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setTcs(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch TCs:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(newTC).forEach(key => formData.append(key, newTC[key]));
            if (selectedFile) formData.append('image', selectedFile);

            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${user?.token}`
                },
                body: formData
            });
            if (res.ok) {
                const data = await res.json();
                setTcs(prev => [...prev, data]);
                closeModal();
            }
        } catch (err) {
            console.error("Failed to create TC:", err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(editTC).forEach(key => {
                if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
                    formData.append(key, editTC[key]);
                }
            });
            if (selectedFile) formData.append('image', selectedFile);

            const res = await fetch(`${API_URL}/${editTC._id}`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${user?.token}`
                },
                body: formData
            });
            if (res.ok) {
                const data = await res.json();
                setTcs(prev => prev.map(tc => tc._id === data._id ? data : tc));
                closeModal();
            }
        } catch (err) {
            console.error("Failed to update TC:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this TC record permanently?')) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            if (res.ok) {
                setTcs(prev => prev.filter(tc => tc._id !== id));
            }
        } catch (err) {
            console.error("Failed to delete TC:", err);
        }
    };

    const openEditModal = (tc) => {
        setEditTC({
            ...tc,
            issueDate: tc.issueDate ? new Date(tc.issueDate).toISOString().split('T')[0] : ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditTC(null);
        setSelectedFile(null);
        setTcPreview(null);
        setNewTC({ studentName: '', admissionNo: '', issueDate: '', className: '', tcNumber: '' });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setTcPreview(URL.createObjectURL(file));
        }
    };

    const filteredTCs = tcs.filter(tc => 
        tc.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        tc.admissionNo.includes(searchQuery)
    );

    return (
        <div className="p-6">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Academic Certs</h1>
                    <p className="text-slate-500 text-xs mt-2 uppercase tracking-[0.3em] font-black italic">Transfer Certificate Registry</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Admission No or Name..."
                            className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] pl-16 pr-8 py-4 font-bold outline-none focus:border-sky-600 transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#8B0000] hover:bg-red-900 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 border-b-4 border-red-950"
                    >
                        <Plus size={16} /> Issue New TC
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20 animate-pulse text-indigo-200">
                    <FileText size={80} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTCs.map((tc) => (
                        <div key={tc._id} className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 relative overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-500">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 dark:bg-rose-900/10 rounded-full blur-[80px] -mr-16 -mt-16" />
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-14 w-14 rounded-xl bg-rose-50 dark:bg-rose-950 flex items-center justify-center text-[#8B0000] font-black overflow-hidden border border-rose-100">
                                        {tc.imageFile ? (
                                            <img 
                                                src={tc.imageFile.startsWith('http') ? tc.imageFile : `${API_IMAGE_URL}${tc.imageFile.startsWith('/') ? '' : '/'}${tc.imageFile}`} 
                                                className="w-full h-full object-cover" 
                                                alt={tc.studentName}
                                            />
                                        ) : (
                                            <FileText size={24} />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-rose-400 uppercase tracking-widest leading-none mb-1">RECORD V1.0</p>
                                        <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">{tc.tcNumber || 'TC-RECORD'}</p>
                                    </div>
                                </div>
                                
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase leading-tight mb-6 tracking-tight">
                                    {tc.studentName}
                                </h3>
                                
                                <div className="space-y-4 mb-10">
                                    <div className="flex items-center justify-between text-xs font-bold p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                        <span className="text-slate-400 uppercase tracking-widest">Adm No</span>
                                        <span className="text-slate-900 dark:text-white font-black">{tc.admissionNo}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-bold p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                        <span className="text-slate-400 uppercase tracking-widest">Class</span>
                                        <span className="text-indigo-600 font-black">{tc.className}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-bold p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                        <span className="text-slate-400 uppercase tracking-widest">Issued On</span>
                                        <span className="text-slate-600">{new Date(tc.issueDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                
                                <div className="pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => openEditModal(tc)}
                                            className="text-[#8B0000] hover:text-red-900 transition-all p-3 hover:bg-red-50 rounded-2xl"
                                        >
                                            <Edit size={20} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(tc._id)}
                                            className="text-rose-500 hover:text-rose-700 transition-all p-3 hover:bg-rose-50 rounded-2xl"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                    <span className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                                        <CheckCircle2 size={14} /> Verified Record
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {filteredTCs.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-800/30 rounded-[3rem] border border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold uppercase tracking-widest">No certificate records found matching your search</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3.5rem] p-12 shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-500">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-red-200/50 rounded-full blur-[120px] -mr-40 -mt-40" />
                        
                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                {editTC ? 'Update Certificate' : 'Issue Certificate'}
                            </h2>
                            <button onClick={closeModal} className="p-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-3xl transition-all"><X /></button>
                        </div>

                        <form onSubmit={editTC ? handleUpdate : handleCreate} className="space-y-8 relative z-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Student Photo (Optional)</label>
                                <div className="flex items-center gap-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                                    <div className="h-20 w-20 rounded-2xl bg-white dark:bg-slate-900 border overflow-hidden flex items-center justify-center text-slate-300">
                                        {tcPreview ? (
                                            <img src={tcPreview} className="w-full h-full object-cover" />
                                        ) : (editTC?.imageFile) ? (
                                            <img 
                                                src={editTC.imageFile.startsWith('http') ? editTC.imageFile : `${API_IMAGE_URL}${editTC.imageFile.startsWith('/') ? '' : '/'}${editTC.imageFile}`} 
                                                className="w-full h-full object-cover" 
                                            />
                                        ) : (
                                            <ImageIcon size={32} />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleFileChange}
                                            className="hidden" 
                                            id="studentPhoto" 
                                        />
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById('studentPhoto')?.click()}
                                            className="px-6 py-2.5 border-2 border-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                        >
                                            Select Photo
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Full Student Name</label>
                                 <input 
                                     type="text" 
                                     className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] p-6 font-bold outline-none focus:border-indigo-600 transition-all shadow-inner"
                                     placeholder="Enter full name..."
                                     value={editTC ? editTC.studentName : newTC.studentName}
                                     onChange={(e) => editTC ? setEditTC({...editTC, studentName: e.target.value}) : setNewTC({...newTC, studentName: e.target.value})}
                                     required
                                 />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Admission No</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] p-6 font-bold outline-none focus:border-indigo-600"
                                        placeholder="ADM-001"
                                        value={editTC ? editTC.admissionNo : newTC.admissionNo}
                                        onChange={(e) => editTC ? setEditTC({...editTC, admissionNo: e.target.value}) : setNewTC({...newTC, admissionNo: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Current Class</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] p-6 font-bold outline-none focus:border-indigo-600"
                                        placeholder="e.g. Class 10-A"
                                        value={editTC ? editTC.className : newTC.className}
                                        onChange={(e) => editTC ? setEditTC({...editTC, className: e.target.value}) : setNewTC({...newTC, className: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Issue Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] p-6 font-bold outline-none focus:border-indigo-600"
                                        value={editTC ? editTC.issueDate : newTC.issueDate}
                                        onChange={(e) => editTC ? setEditTC({...editTC, issueDate: e.target.value}) : setNewTC({...newTC, issueDate: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">TC Serial Number</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] p-6 font-bold outline-none focus:border-indigo-600"
                                        placeholder="TC/2026/001"
                                        value={editTC ? editTC.tcNumber : newTC.tcNumber}
                                        onChange={(e) => editTC ? setEditTC({...editTC, tcNumber: e.target.value}) : setNewTC({...newTC, tcNumber: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white font-black uppercase tracking-[0.3em] py-6 rounded-[1.5rem] shadow-2xl shadow-indigo-200 transition-all hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] border-b-8 border-indigo-800 text-xs">
                                {editTC ? 'Update Institutional Record' : 'Generate Institutional Record'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TCManager;
