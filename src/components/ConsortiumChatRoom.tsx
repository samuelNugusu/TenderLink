import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send, MessageSquare, CheckCircle, Clock, Users } from 'lucide-react';

interface ChatMessage {
  id: string;
  senderName: string;
  workshopName: string;
  text: string;
  timestamp: string;
  isLead?: boolean;
}

interface ConsortiumChatRoomProps {
  consortiumId: string;
  consortiumName: string;
}

export const ConsortiumChatRoom: React.FC<ConsortiumChatRoomProps> = ({
  consortiumId,
  consortiumName,
}) => {
  const { currentUser, currentWorkshop, activeRole } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      senderName: 'Alemayehu Tadesse',
      workshopName: 'Atlas Structural Metal Works',
      text: 'Greetings partners! The MoE sample prototype frame is welded. We tested the 1.5mm steel tubular section with powder coating. It passed tension inspection.',
      timestamp: 'Today at 09:15 AM',
      isLead: true,
    },
    {
      id: 'm2',
      senderName: 'Mulugeta Bekele',
      workshopName: 'Horn Precision Joinery',
      text: 'Excellent Alemayehu. We have prepared 200 beveled eucalyptus desktop panels with rounded pencil grooves ready for hardware fitting.',
      timestamp: 'Today at 10:30 AM',
      isLead: false,
    },
    {
      id: 'm3',
      senderName: 'Selamawit Desta',
      workshopName: 'Highland Craftsmen Cooperative',
      text: 'Our timber bench slats are treated with polyurethane lacquer. We are scheduling joint transport to the central inspection warehouse on Thursday.',
      timestamp: 'Today at 11:05 AM',
      isLead: false,
    },
  ]);

  const [inputMsg, setInputMsg] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderName: currentUser?.displayName || 'Workshop Member',
      workshopName: currentWorkshop?.businessName || 'Collaborating Workshop',
      text: inputMsg,
      timestamp: 'Just now',
      isLead: activeRole === 'admin' || (currentWorkshop ? currentWorkshop.workshopType.includes('Hybrid') : true),
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[400px] overflow-hidden text-xs">
      {/* Chat Header */}
      <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-teal-400" />
          <div>
            <span className="font-bold text-white text-xs block leading-tight">
              Consortium Collaboration & Logistics Channel
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {consortiumName}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-teal-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active Workshop Channel</span>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/60">
        {messages.map(msg => (
          <div key={msg.id} className="space-y-1">
            <div className="flex items-center gap-2 text-[11px]">
              <span className="font-bold text-slate-900">{msg.senderName}</span>
              <span className="text-slate-500">({msg.workshopName})</span>
              {msg.isLead && (
                <span className="px-1.5 py-0.2 rounded bg-slate-900 text-white text-[9px] font-bold">
                  Lead
                </span>
              )}
              <span className="text-slate-400 text-[10px] ml-auto font-mono">{msg.timestamp}</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs text-slate-800 leading-relaxed">
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type an update, delivery status, or coordination note..."
          value={inputMsg}
          onChange={e => setInputMsg(e.target.value)}
          className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 bg-white"
        />
        <button
          type="submit"
          disabled={!inputMsg.trim()}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium disabled:opacity-40 cursor-pointer transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Send className="w-3.5 h-3.5 text-teal-400" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};
