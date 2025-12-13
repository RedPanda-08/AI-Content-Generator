'use client';
import { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Bell, BellOff, Plus, Loader2, 
  Calendar as CalendarIcon, Trash2, CheckCircle2, ChevronDown, Clock,
  Linkedin, Twitter, Instagram, Bot 
} from 'lucide-react';
import { useSupabase } from '../../../components/SupabaseProvider'; 
import { motion, AnimatePresence } from 'framer-motion';

// --- 1. Strong Types ---
interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO String (UTC)
  platform: string;
  notify: boolean;
  status?: string;
  user_id?: string;
  content?: string;
}

interface SupabaseContext {
  supabase: {
    channel: (name: string) => {
      on: (
        event: string, 
        config: { event: string; schema: string; table: string; filter: string }, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback: (payload: any) => void
      ) => { subscribe: () => void };
    };
    removeChannel: (channel: unknown) => void;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    from: (table: string) => any; 
  };
  session: { 
    user: { 
      id: string; 
      email?: string; 
    }; 
  } | null;
}

export default function CalendarPage() {
  const { supabase, session } = (useSupabase() as unknown as SupabaseContext) || { supabase: null, session: null };
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Helper: Get today's date in local YYYY-MM-DD format
  const getTodayString = () => new Date().toLocaleDateString('en-CA');

  const [selectedDate, setSelectedDate] = useState<string | null>(getTodayString()); 
  const [selectedTime, setSelectedTime] = useState('09:00'); 

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null); 
  
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventPlatform, setNewEventPlatform] = useState('linkedin');
  const [newEventNotify, setNewEventNotify] = useState(true); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

  const [savedDateTime, setSavedDateTime] = useState('');

  // --- FIX 1: REMOVED MANUAL MATH. Let browser handle Local Time ---
  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    // This automatically converts UTC -> IST (or your local time)
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // --- FIX 2: Check Date Match using Local Time ---
  const isEventOnDate = (eventDateIso: string, targetDateStr: string | null) => {
    if (!targetDateStr || !eventDateIso) return false;
    const eventDate = new Date(eventDateIso);
    // Convert event UTC -> Local YYYY-MM-DD
    const eventLocalStr = eventDate.toLocaleDateString('en-CA');
    return eventLocalStr === targetDateStr;
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!supabase || !session?.user?.id) return;

    const channel = supabase
      .channel('realtime-calendar')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'content_schedule',
          filter: `user_id=eq.${session.user.id}` 
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          const updatedRow = payload.new as CalendarEvent;
          setEvents((currentEvents) => 
            currentEvents.map((evt) => 
              evt.id === updatedRow.id ? { ...evt, status: updatedRow.status } : evt
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, session]);

  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      if (!isNaN(date.getTime())) {
        setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
      }
    }
  }, []); 

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/calendar');
      const data = await res.json();
      if (data.events) setEvents(data.events);
    } catch (e) {
      console.error("Failed to load events", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!newEventTitle || !selectedDate || !session?.user) return;
    setIsAdding(true);

    // Combine Date and Time into ISO string (Browser handles conversion to UTC)
    const finalDateTime = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();
    setSavedDateTime(finalDateTime);

    try {
      await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newEventTitle,
          date: finalDateTime, 
          platform: newEventPlatform,
          notify: newEventNotify,
          user_email: session.user.email,
          user_id: session.user.id
        })
      });
      
      setNewEventTitle('');
      fetchEvents();

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); 

    } catch (e) {
      console.error(e);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
        const res = await fetch(`/api/calendar?id=${id}`, {
            method: 'DELETE',
        });
        if (res.ok) {
            setEvents(events.filter(e => e.id !== id));
        }
    } catch (e) {
        console.error("Delete failed", e);
    } finally {
        setDeletingId(null);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  
  const { days, firstDay } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const getPlatformIcon = (p: string) => {
      if (p === 'linkedin') return <Linkedin className="w-4 h-4 text-blue-400" />;
      if (p === 'twitter') return <Twitter className="w-4 h-4 text-sky-400" />;
      if (p === 'instagram') return <Instagram className="w-4 h-4 text-pink-400" />;
      return <Bot className="w-4 h-4 text-gray-400" />;
  };

  const platforms = ['linkedin', 'twitter', 'instagram'];

  if (loading) {
      return (
        <div className="flex h-[100svh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      );
  }

  return (
    <div className="w-full min-h-[100svh] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent hover:scrollbar-thumb-neutral-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-6 sm:py-8 relative">
        
        {showSuccess && (
          <div className="fixed top-4 right-4 sm:top-24 sm:right-8 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md">
              <div className="p-1 bg-emerald-500/20 rounded-full flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="font-bold text-sm">Scheduled!</p>
                <p className="text-xs opacity-80">
                    {/* Shows Local Date and Time */}
                    {new Date(savedDateTime).toLocaleDateString()} at {formatTime(savedDateTime)}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
              <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              Content Calendar
            </h1>
            <p className="text-sm sm:text-base text-gray-400 mt-1">Plan and schedule your posts.</p>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-4 bg-white/5 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
            <button onClick={prevMonth} className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg text-white transition-colors">
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <span className="font-semibold text-base sm:text-lg min-w-[120px] sm:min-w-[140px] text-center select-none">
              {monthName} {year}
            </span>
            <button onClick={nextMonth} className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg text-white transition-colors">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* CALENDAR GRID */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl h-fit">
            <div className="grid grid-cols-7 mb-4 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-1">
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} className="aspect-square" />)}

              {[...Array(days)].map((_, i) => {
                const dayNum = i + 1;
                // Construct date string safely YYYY-MM-DD
                const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                
                // Use helper to check date match in local time
                const dayEvents = events.filter(e => isEventOnDate(e.date, dateStr));
                
                const isSelected = selectedDate === dateStr;
                const isToday = getTodayString() === dateStr;

                return (
                  <div 
                    key={dayNum}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`
                      aspect-square rounded-xl border transition-all cursor-pointer relative group flex flex-col items-center justify-start pt-2
                      ${isSelected ? 'border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/20' : 'border-white/5 hover:border-white/20 hover:bg-white/5'}
                      ${isToday ? 'bg-white/10' : ''}
                    `}
                  >
                    <span className={`text-xs sm:text-sm font-medium ${isToday ? 'text-orange-400 font-bold' : 'text-gray-400'}`}>
                      {dayNum}
                    </span>
                    <div className="flex gap-1 mt-1 sm:mt-2 flex-wrap justify-center px-1 w-full">
                      {dayEvents.slice(0, 3).map(evt => (
                        <div key={evt.id} className={`w-1.5 h-1.5 rounded-full ${evt.notify ? 'bg-green-500' : 'bg-orange-500'}`} />
                      ))}
                      {dayEvents.length > 3 && <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 flex flex-col h-full min-h-[400px]">
            
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-white">Manage Schedule</h2>
                {selectedDate && (
                    <p className="text-sm text-orange-400 mt-1 font-medium">
                        {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                )}
            </div>

            <div className="space-y-4 mb-8 border-b border-white/10 pb-8">
                {/* 1. DATE & TIME PICKER ROW */}
                <div className="flex gap-3">
                    <div className="space-y-1 flex-1">
                        <label className="text-xs text-gray-500 font-medium ml-1">Date</label>
                        <input 
                            type="date" 
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:border-orange-500 focus:outline-none [color-scheme:dark]"
                            value={selectedDate || ''}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1 w-1/3">
                        <label className="text-xs text-gray-500 font-medium ml-1">Time</label>
                        <input 
                            type="time" 
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-2 py-3 text-white text-sm focus:border-orange-500 focus:outline-none [color-scheme:dark] text-center"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                        />
                    </div>
                </div>

                {/* TITLE INPUT */}
                <div className="space-y-1">
                    <label className="text-xs text-gray-500 font-medium ml-1">Topic</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Launch Post" 
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-orange-500 focus:outline-none placeholder-gray-600"
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                    />
                </div>
              
                <div className="flex gap-3">
                    {/* CUSTOM PLATFORM DROPDOWN */}
                    <div className="relative flex-1">
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:border-orange-500 outline-none flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                {getPlatformIcon(newEventPlatform)}
                                <span className="capitalize">{newEventPlatform}</span>
                            </div>
                            <ChevronDown className="w-4 h-4 opacity-50" />
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                                    <motion.div 
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-[#18181b] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20"
                                    >
                                        {platforms.map(p => (
                                            <div 
                                                key={p}
                                                onClick={() => { setNewEventPlatform(p); setIsDropdownOpen(false); }}
                                                className="flex items-center gap-2 px-3 py-2.5 hover:bg-white/10 cursor-pointer text-sm text-gray-300"
                                            >
                                                {getPlatformIcon(p)}
                                                <span className="capitalize">{p}</span>
                                            </div>
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* NOTIFICATION TOGGLE */}
                    <button 
                        onClick={() => setNewEventNotify(!newEventNotify)}
                        className={`flex items-center justify-center w-12 rounded-xl border transition-all ${newEventNotify ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-black/50 border-white/10 text-gray-500 hover:text-gray-300'}`}
                        title={newEventNotify ? "Notifications Enabled" : "Notifications Disabled"}
                    >
                        {newEventNotify ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                    </button>
                </div>

                <button 
                    onClick={handleSave}
                    disabled={!newEventTitle || isAdding || !selectedDate}
                    className="w-full py-3 cursor-pointer bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl font-semibold text-white shadow-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                    {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Add Schedule
                </button>
            </div>

            {/* EVENTS LIST */}
            <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-neutral-700 pr-1 max-h-[300px] lg:max-h-none">
              
              {/* Use helper function to filter by local date */}
              {events.filter(e => isEventOnDate(e.date, selectedDate)).length === 0 && (
                <p className="text-sm text-gray-500 italic text-center py-4">No events for this date.</p>
              )}
              
              {events.filter(e => isEventOnDate(e.date, selectedDate)).map(evt => {
                const isDone = evt.status === 'notified';
                return (
                  <div key={evt.id} className={`p-3 rounded-xl border flex items-center justify-between group transition-all ${isDone ? 'bg-white/5 border-white/5 opacity-60' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                    <div className="flex-1 min-w-0 mr-2">
                      <div className="flex items-center gap-2">
                          <p className={`font-medium text-sm truncate ${isDone ? 'text-gray-500 line-through' : 'text-white'}`}>
                              {evt.title}
                          </p>
                          {isDone && <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded border border-green-500/30 font-medium">Done</span>}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500 capitalize bg-black/30 px-2 py-0.5 rounded flex items-center gap-1">
                          {getPlatformIcon(evt.platform)} {evt.platform}
                        </p>
                        
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(evt.date)}
                        </p>
                        
                        {evt.notify && <Bell className="w-3 h-3 text-green-500" />}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDelete(evt.id)}
                      disabled={deletingId === evt.id}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                      title="Delete Event"
                    >
                      {deletingId === evt.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}