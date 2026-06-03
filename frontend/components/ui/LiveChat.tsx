'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User } from 'lucide-react';
import { useSocketStore } from '../../store/useSocketStore';
import { useAuthStore } from '../../store/useAuthStore';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isSelf: boolean;
}

export function LiveChat({ recipientId, complaintId }: { recipientId?: string, complaintId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const { socket } = useSocketStore();
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    if (!socket) return;

    const handleReceive = (data: any) => {
      // Only process messages for this complaint context if complaintId is provided
      if (complaintId && data.complaintId !== complaintId) return;
      
      setMessages(prev => [...prev, {
        id: data.id,
        senderId: data.senderId,
        text: data.text,
        timestamp: new Date(data.timestamp),
        isSelf: false
      }]);
      
      // Auto-open chat if a new message arrives
      if (!isOpen) setIsOpen(true);
    };

    socket.on('RECEIVE_MESSAGE', handleReceive);
    return () => {
      socket.off('RECEIVE_MESSAGE', handleReceive);
    };
  }, [socket, complaintId, isOpen]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !socket || !user) return;
    
    // Optimistic UI update
    const newMsg: Message = {
      id: Math.random().toString(),
      senderId: user._id || user.id || 'self',
      text: inputText,
      timestamp: new Date(),
      isSelf: true
    };
    setMessages(prev => [...prev, newMsg]);

    socket.emit('SEND_MESSAGE', {
      recipientId: recipientId || 'system', // Target officer or citizen ID
      text: inputText,
      complaintId: complaintId || 'general'
    });

    setInputText('');
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center z-40 transition-colors"
      >
        <MessageSquare className="w-6 h-6" />
        {messages.length > 0 && !isOpen && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span className="font-bold">Live Support</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
                  <p className="text-sm">No messages yet. Say hi!</p>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isSelf ? 'justify-end' : 'justify-start'}`}>
                  {!msg.isSelf && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex flex-shrink-0 items-center justify-center mr-2">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    msg.isSelf 
                      ? 'bg-blue-600 text-white rounded-br-sm' 
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-bl-sm shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <form onSubmit={sendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                />
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2 rounded-xl transition-colors flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
