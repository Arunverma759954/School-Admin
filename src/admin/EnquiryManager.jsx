import React, { useState, useEffect } from 'react';
import { 
    MessageSquare, 
    User, 
    Mail, 
    Phone, 
    Calendar,
    CheckCircle,
    Clock,
    Search,
    Filter
} from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';

import { API_BASE_URL } from '../constants';

const EnquiryManager = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const API_URL = `${API_BASE_URL}/enquiries`;

    useEffect(() => {
        const fetchEnquiries = async () => {
            try {
                const res = await fetch(API_URL, {
                    headers: { 'Authorization': `Bearer ${user?.token}` }
                });
                const data = await res.json();
                setEnquiries(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch enquiries:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEnquiries();
    }, [user]);

    const filtered = enquiries.filter(enq => 
        (enq.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (enq.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (enq.parentName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Admissions Enquiry</h1>
                    <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">Manage incoming institutional requests</p>
                </div>
                
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-sky-600 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search by name/email..."
                        className="pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-sky-600 transition-all text-sm font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20 animate-spin">
                    <Clock size={40} className="text-sky-600" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <MessageSquare size={60} className="mx-auto text-slate-200 mb-6" />
                    <p className="text-slate-400 font-black uppercase tracking-widest">No enquiries found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filtered.map((enq) => (
                        <div key={enq._id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 dark:bg-sky-900/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-sky-100 transition-colors" />
                            
                            <div className="flex items-start gap-6 relative z-10">
                                <div className="h-16 w-16 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-sky-600 shrink-0 border-b-4 border-slate-200 dark:border-slate-700">
                                    <User size={30} />
                                </div>
                                
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase leading-tight tracking-tighter">
                                            {enq.studentName}
                                        </h3>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            enq.status === 'New' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                                        }`}>
                                            {enq.status}
                                        </span>
                                    </div>
                                    
                                    <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest mb-4">
                                        Parent: <span className="text-slate-500">{enq.parentName}</span> • Class: <span className="text-slate-500">{enq.classApplying}</span>
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-4 mb-4">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Mail size={14} className="text-sky-600" />
                                            <span className="text-xs font-bold">{enq.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Phone size={14} className="text-sky-600" />
                                            <span className="text-xs font-bold">{enq.phone || 'N/A'}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Inquiry Message</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">"{enq.message}"</p>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Clock size={12} />
                                            <span className="text-[10px] uppercase font-bold tracking-widest">Received: {new Date(enq.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <button className="text-sky-600 text-[10px] font-black uppercase tracking-widest hover:underline px-4 py-2 bg-sky-50 dark:bg-sky-900/20 rounded-xl transition-all">
                                            Mark as Responded
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EnquiryManager;
