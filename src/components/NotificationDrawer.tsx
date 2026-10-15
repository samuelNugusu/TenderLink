import React from 'react';
import { useApp } from '../context/AppContext';
import { NotificationItem } from '../types';
import { X, Bell, CheckCircle, Clock, Users, ArrowRight } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const { notifications, markNotificationAsRead, lang } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-teal-400" />
            <h3 className="font-bold text-sm text-white">
              {lang === 'am' ? 'ማሳወቂያዎች' : 'Platform Notifications'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-1">
              <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
              <p className="font-semibold text-slate-800">
                {lang === 'am' ? 'አዲስ ማሳወቂያ የለም' : 'No new notifications'}
              </p>
              <p className="text-[11px] text-slate-400">
                {lang === 'am' ? 'ሁሉንም መረጃዎች ተከታትለዋል' : 'You are up to date on all tender updates'}
              </p>
            </div>
          ) : (
            notifications.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  markNotificationAsRead(item.id);
                  if (item.actionUrl) {
                    onNavigateTab(item.actionUrl);
                    onClose();
                  }
                }}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${item.read ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-teal-50/60 border-teal-300 shadow-xs'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-slate-900 leading-snug">{item.title}</span>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">{item.message}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1 border-t border-slate-100">
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  <span className="text-teal-700 font-semibold flex items-center gap-0.5">
                    View <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          TenderLink Ethiopia Alert Center
        </div>
      </div>
    </div>
  );
};
