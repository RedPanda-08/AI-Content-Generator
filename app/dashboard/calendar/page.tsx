'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Bell, BellOff, Plus, Loader2, Calendar as CalendarIcon, Trash2,CheckCircle2 } from 'lucide-react';
import { useSupabase } from '../../../components/SupabaseProvider';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  platform: string;
  notify: boolean;
}

export default function CalendarPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null); 
  
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventPlatform, setNewEventPlatform] = useState('linkedin');
  const [newEventNotify, setNewEventNotify] = useState(false);

  useEffect(() => {
    fetchEvents();
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
    if (!newEventTitle || !selectedDate) return;
    setIsAdding(true);

    try {
      await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newEventTitle,
          date: selectedDate,
          platform: newEventPlatform,
          notify: newEventNotify
        })
      });
      
      setNewEventTitle('');
      setNewEventNotify(false);
      fetchEvents();

       setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); 

    } catch (e) {
      console.error(e);
    } finally {
      setIsAdding(false);
    }
  };

  // NEW: Handle Delete Logic
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
        const res = await fetch(`/api/calendar?id=${id}`, {
            method: 'DELETE',
        });
        if (res.ok) {
            // Optimistic update: remove from list immediately
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

  if (loading) {
      return (
        <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      );
  }

  return (
    <div className="max-w-6xl  p-6 h-full flex flex-col">
        <div className="h-[calc(100vh-2rem)] flex flex-col w-full max-w-[1600px] mx-auto p-6 relative">
        {showSuccess && (
        <div className="absolute top-6 right-6 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md">
             <div className="p-1 bg-emerald-500/20 rounded-full">
               <CheckCircle2 className="w-4 h-4 text-emerald-400" />
             </div>
             <div>
               <p className="font-bold text-sm">Event Scheduled</p>
               <p className="text-xs opacity-80">We&apos;ve saved your reminder.</p>
             </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-orange-500" />
            Content Calendar
          </h1>
          <p className="text-gray-400 mt-1">Plan and schedule your posts.</p>
        </div>

        <div className="flex items-center gap-4 bg-white/5 p-1 rounded-xl border border-white/10">
          <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-lg min-w-[140px] text-center select-none">
            {monthName} {year}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow h-full">
        
        {/* CALENDAR GRID */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="grid grid-cols-7 mb-4 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} className="aspect-square" />)}

            {[...Array(days)].map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayEvents = events.filter(e => e.date === dateStr);
              const isSelected = selectedDate === dateStr;
              const isToday = new Date().toISOString().split('T')[0] === dateStr;

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
                  <span className={`text-sm font-medium ${isToday ? 'text-orange-400 font-bold' : 'text-gray-400'}`}>
                    {dayNum}
                  </span>
                  <div className="flex gap-1 mt-2 flex-wrap justify-center px-1 w-full">
                    {dayEvents.map(evt => (
                      <div key={evt.id} className={`w-1.5 h-1.5 rounded-full ${evt.notify ? 'bg-green-500' : 'bg-orange-500'}`} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ADD EVENT SIDEBAR */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 flex flex-col h-full">
          <h2 className="text-xl font-semibold text-white mb-6">
            {selectedDate ? new Date(selectedDate).toDateString() : 'Select a Date'}
          </h2>

          {!selectedDate ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500 text-center">
              <p>Click a day on the grid to add content.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8 border-b border-white/10 pb-8">
                <input 
                  type="text" 
                  placeholder="Content Title (e.g. Launch Post)" 
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                />
                
                <div className="flex gap-3">
                  <select 
                    className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 focus:border-orange-500 outline-none flex-1"
                    value={newEventPlatform}
                    onChange={(e) => setNewEventPlatform(e.target.value)}
                  >
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter</option>
                    <option value="instagram">Instagram</option>
                  </select>

                  <button 
                    onClick={() => setNewEventNotify(!newEventNotify)}
                    className={`flex items-center justify-center w-12 rounded-xl border transition-all ${newEventNotify ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-black/50 border-white/10 text-gray-500'}`}
                  >
                    {newEventNotify ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                  </button>
                </div>

                <button 
                  onClick={handleSave}
                  disabled={!newEventTitle || isAdding}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl font-semibold text-white shadow-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Add Schedule
                </button>
              </div>

              {/* EVENTS LIST WITH DELETE */}
              <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
                {events.filter(e => e.date === selectedDate).length === 0 && (
                  <p className="text-sm text-gray-500 italic text-center py-4">No events scheduled.</p>
                )}
                
                {events.filter(e => e.date === selectedDate).map(evt => (
                   <div key={evt.id} className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all">
                      <div className="flex-1 min-w-0 mr-2">
                        <p className="text-white font-medium text-sm truncate">{evt.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                           <p className="text-xs text-gray-500 capitalize bg-black/30 px-1.5 py-0.5 rounded">{evt.platform}</p>
                           {evt.notify && <Bell className="w-3 h-3 text-green-500" />}
                        </div>
                      </div>
                      
                      {/* DELETE BUTTON */}
                      <button 
                        onClick={() => handleDelete(evt.id)}
                        disabled={deletingId === evt.id}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Event"
                      >
                        {deletingId === evt.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                   </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}