import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CalendarEvent } from '../types';
import {
  Calendar as CalendarIcon,
  Clock,
  FileText,
  Users,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface CalendarPageProps {
  onSelectTender: (tenderId: string) => void;
  onSelectConsortium: () => void;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({
  onSelectTender,
  onSelectConsortium,
}) => {
  const { calendarEvents } = useApp();
  const [viewMode, setViewMode] = useState<'list' | 'month'>('list');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredEvents = calendarEvents.filter(e => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  const getEventBadge = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'tender_deadline':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700">Tender Deadline</span>;
      case 'consortium_deadline':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">Consortium Cutoff</span>;
      case 'document_deadline':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800">Compliance & Docs</span>;
      case 'delivery_milestone':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800">Delivery Milestone</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-700 font-semibold tracking-wide">
            <span>OPERATIONAL TIMELINES</span>
            <span>·</span>
            <span>PROCUREMENT MILESTONES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Institutional Procurement & Contract Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track upcoming bid submission cutoffs, consortium invitation response windows, and legal compliance milestones.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Agenda List
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${viewMode === 'month' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Month Grid
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors font-medium ${filterType === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          All Deadlines ({calendarEvents.length})
        </button>
        <button
          onClick={() => setFilterType('tender_deadline')}
          className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors font-medium ${filterType === 'tender_deadline' ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          Tender Deadlines
        </button>
        <button
          onClick={() => setFilterType('consortium_deadline')}
          className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors font-medium ${filterType === 'consortium_deadline' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          Consortium Response Windows
        </button>
        <button
          onClick={() => setFilterType('document_deadline')}
          className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors font-medium ${filterType === 'document_deadline' ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          Document & Tax Clearance
        </button>
      </div>

      {/* Content based on ViewMode */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredEvents.map(event => (
            <div
              key={event.id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-teal-400 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-900 text-white flex flex-col items-center justify-center font-mono shrink-0 shadow-xs">
                  <span className="text-[10px] text-teal-400 uppercase tracking-wider">
                    {new Date(event.date).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="text-base font-bold leading-none">
                    {new Date(event.date).getDate()}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {getEventBadge(event.type)}
                    <span className="text-xs text-slate-400 font-mono">Date: {event.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {event.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {event.relatedTenderId && (
                  <button
                    onClick={() => onSelectTender(event.relatedTenderId!)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded cursor-pointer transition-colors"
                  >
                    View Tender Dossier
                  </button>
                )}
                {event.type === 'consortium_deadline' && (
                  <button
                    onClick={onSelectConsortium}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded cursor-pointer transition-colors"
                  >
                    Open Workspace
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Month Grid Visual View */
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-3">
            <span>April 2026 Procurement Calendar</span>
            <span className="text-slate-400 font-normal">Addis Ababa Standard Time</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500 py-2">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-xs">
            {Array.from({ length: 30 }).map((_, i) => {
              const day = i + 1;
              const dateStr = `2026-04-${day < 10 ? '0' + day : day}`;
              const dayEvents = calendarEvents.filter(e => e.date === dateStr);

              return (
                <div
                  key={i}
                  className={`min-h-[90px] p-2 rounded-lg border text-left flex flex-col justify-between transition-colors ${dayEvents.length > 0 ? 'bg-teal-50/50 border-teal-300' : 'bg-slate-50/60 border-slate-200'}`}
                >
                  <span className="font-bold text-slate-800 font-mono text-xs">{day}</span>
                  <div className="space-y-1 mt-1">
                    {dayEvents.map(ev => (
                      <div
                        key={ev.id}
                        className="text-[10px] p-1 bg-white border border-teal-200 rounded text-slate-800 font-medium truncate"
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
