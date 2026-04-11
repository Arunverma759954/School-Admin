import React, { useState, useEffect } from 'react';
import { 
    Calendar,
    Plus,
    Trash2,
    MapPin,
    Clock,
    X,
    CheckCircle2,
    Edit
} from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';

import { API_BASE_URL } from '../constants';

const EventManager = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editEvent, setEditEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({ title: '', date: '', location: 'School Campus', description: '', category: 'General' });
    const { user } = useAuth();
    const API_URL = `${API_BASE_URL}/events`;

    useEffect(() => {
        fetchEvents();
    }, [user]);

    const fetchEvents = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setEvents(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch events:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(newEvent)
            });
            if (res.ok) {
                const data = await res.json();
                setEvents(prev => [...prev, data]);
                setIsModalOpen(false);
                setNewEvent({ title: '', date: '', location: 'School Campus', description: '', category: 'General' });
            }
        } catch (err) {
            console.error("Failed to create event:", err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/${editEvent._id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(editEvent)
            });
            if (res.ok) {
                const data = await res.json();
                setEvents(prev => prev.map(ev => ev._id === data._id ? data : ev));
                setIsModalOpen(false);
                setEditEvent(null);
            }
        } catch (err) {
            console.error("Failed to update event:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this event permanently?')) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            if (res.ok) {
                setEvents(prev => prev.filter(event => event._id !== id));
            }
        } catch (err) {
            console.error("Failed to delete event:", err);
        }
    };

    const openEditModal = (event) => {
        setEditEvent({
            ...event,
            date: event.date ? new Date(event.date).toISOString().split('T')[0] : ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditEvent(null);
        setNewEvent({ title: '', date: '', location: 'School Campus', description: '', category: 'General' });
    };

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Events Calendar</h1>
                    <p className="text-slate-500 text-xs mt-2 uppercase tracking-[0.3em] font-black italic">Institutional Lifecycle Management</p>
                </div>
                
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-[#8B0000] hover:bg-red-950 text-white px-8 py-3.5 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 border-b-4 border-red-950"
                >
                    <Plus size={16} /> Schedule Event
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20 animate-pulse text-sky-200">
                    <Calendar size={80} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div key={event._id} className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 border border-slate-100 dark:border-slate-800 relative overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-sky-50 dark:bg-sky-900/10 rounded-full blur-[100px] -mr-24 -mt-24 group-hover:bg-sky-100 transition-colors" />
                            
                            <div className="relative z-10">
                                <span className="inline-block px-4 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-[#8B0000] text-[9px] font-black uppercase tracking-[0.2em] mb-6 border-b-2 border-rose-100 dark:border-rose-800">
                                    {event.category}
                                </span>
                                
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase leading-tight mb-4 tracking-tight group-hover:text-[#8B0000] transition-colors">
                                    {event.title}
                                </h3>
                                
                                <div className="space-y-4 mb-10">
                                    <div className="flex items-center gap-4 text-slate-400">
                                        <div className="h-10 w-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-sky-600"><Clock size={18} /></div>
                                        <span className="text-xs font-black uppercase tracking-widest">{new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-400">
                                        <div className="h-10 w-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-sky-600"><MapPin size={18} /></div>
                                        <span className="text-xs font-bold">{event.location}</span>
                                    </div>
                                </div>
                                
                                <div className="pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => openEditModal(event)}
                                            className="text-sky-500 hover:text-sky-700 transition-all p-3 hover:bg-sky-50 dark:hover:bg-sky-950/30 rounded-2xl"
                                            title="Edit Event"
                                        >
                                            <Edit size={20} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(event._id)}
                                            className="text-rose-500 hover:text-rose-700 transition-all p-3 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-2xl"
                                            title="Delete Event"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                                        <CheckCircle2 size={14} /> LIVE FEED
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3.5rem] p-12 shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-500">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-200/50 rounded-full blur-[120px] -mr-40 -mt-40" />
                        
                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                {editEvent ? 'Update Record' : 'Schedule Record'}
                            </h2>
                            <button onClick={closeModal} className="p-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-3xl transition-all"><X /></button>
                        </div>

                        <form onSubmit={editEvent ? handleUpdate : handleCreate} className="space-y-8 relative z-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Institutional Event Title</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] p-6 font-bold outline-none focus:border-sky-600 transition-all shadow-inner"
                                    placeholder="e.g. Annual Sports Meet 2026"
                                    value={editEvent ? editEvent.title : newEvent.title}
                                    onChange={(e) => editEvent ? setEditEvent({...editEvent, title: e.target.value}) : setNewEvent({...newEvent, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Target Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] p-6 font-bold outline-none focus:border-sky-600 transition-all font-sans"
                                        value={editEvent ? editEvent.date : newEvent.date}
                                        onChange={(e) => editEvent ? setEditEvent({...editEvent, date: e.target.value}) : setNewEvent({...newEvent, date: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Category</label>
                                    <select 
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] p-6 font-bold outline-none focus:border-sky-600 transition-all appearance-none"
                                        value={editEvent ? editEvent.category : newEvent.category}
                                        onChange={(e) => editEvent ? setEditEvent({...editEvent, category: e.target.value}) : setNewEvent({...newEvent, category: e.target.value})}
                                    >
                                        <option>General</option>
                                        <option>Academic</option>
                                        <option>Sports</option>
                                        <option>Cultural</option>
                                        <option>Holiday</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Event Location</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] p-6 font-bold outline-none focus:border-sky-600 transition-all"
                                    placeholder="e.g. School Main Ground"
                                    value={editEvent ? editEvent.location : newEvent.location}
                                    onChange={(e) => editEvent ? setEditEvent({...editEvent, location: e.target.value}) : setNewEvent({...newEvent, location: e.target.value})}
                                />
                            </div>
                            <button type="submit" className="w-full bg-[#8B0000] text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl transition-all hover:bg-red-950 hover:scale-[1.01] active:scale-[0.98] border-b-4 border-red-950 text-[10px]">
                                {editEvent ? 'Update Event Record' : 'Publish to Live Website'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventManager;
