'use client';

import React, { useEffect, useState } from 'react';
import { useSocketStore } from '../../store/useSocketStore';
import { useAuthStore } from '../../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'EMERGENCY';
  title: string;
  message: string;
  timestamp: Date;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { connect, disconnect, socket } = useSocketStore();
  const { isAuthenticated } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      disconnect();
    }
    return () => disconnect();
  }, [isAuthenticated, connect, disconnect]);

  useEffect(() => {
    if (!socket) return;

    const handleNewComplaint = (data: any) => {
      addNotification({
        id: Math.random().toString(),
        type: 'INFO',
        title: 'New Complaint Received',
        message: `${data.title} (${data.category})`,
        timestamp: new Date()
      });
    };

    const handleStatusUpdated = (data: any) => {
      addNotification({
        id: Math.random().toString(),
        type: 'SUCCESS',
        title: 'Status Updated',
        message: `Your complaint is now: ${data.status}`,
        timestamp: new Date()
      });
    };

    const handleEmergencyAlert = (data: any) => {
      addNotification({
        id: Math.random().toString(),
        type: 'EMERGENCY',
        title: 'EMERGENCY ALERT',
        message: data.message || 'Critical incident reported!',
        timestamp: new Date()
      });
    };

    socket.on('NEW_COMPLAINT', handleNewComplaint);
    socket.on('STATUS_UPDATED', handleStatusUpdated);
    socket.on('COMPLAINT_UPDATED', handleStatusUpdated);
    socket.on('EMERGENCY_ALERT', handleEmergencyAlert);

    return () => {
      socket.off('NEW_COMPLAINT', handleNewComplaint);
      socket.off('STATUS_UPDATED', handleStatusUpdated);
      socket.off('COMPLAINT_UPDATED', handleStatusUpdated);
      socket.off('EMERGENCY_ALERT', handleEmergencyAlert);
    };
  }, [socket]);

  const addNotification = (notif: Notification) => {
    setNotifications(prev => [notif, ...prev].slice(0, 5)); // Keep last 5
    setTimeout(() => {
      removeNotification(notif.id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col space-y-2 pointer-events-none">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-start p-4 rounded-xl shadow-2xl backdrop-blur-md border w-80 ${
                notif.type === 'EMERGENCY' ? 'bg-red-950/90 border-red-500 shadow-red-500/20' :
                notif.type === 'SUCCESS' ? 'bg-emerald-950/90 border-emerald-500 shadow-emerald-500/20' :
                'bg-slate-900/90 border-slate-700 shadow-black/20'
              }`}
            >
              <div className="mr-3 mt-0.5">
                {notif.type === 'EMERGENCY' && <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />}
                {notif.type === 'SUCCESS' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                {notif.type === 'INFO' && <Bell className="w-5 h-5 text-blue-400" />}
              </div>
              <div className="flex-1">
                <h4 className={`text-sm font-bold ${
                  notif.type === 'EMERGENCY' ? 'text-red-400' : 'text-white'
                }`}>{notif.title}</h4>
                <p className="text-xs text-slate-300 mt-1">{notif.message}</p>
              </div>
              <button onClick={() => removeNotification(notif.id)} className="text-slate-400 hover:text-white ml-3">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
