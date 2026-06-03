import React from 'react';

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  isCompleted?: boolean;
}

interface ActivityTimelineProps {
  events: TimelineEvent[];
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  return (
    <div className="relative pl-4 space-y-6">
      <div className="absolute top-2 bottom-2 left-5 w-px bg-slate-200 dark:bg-slate-800"></div>
      {events.map((event, index) => (
        <div key={event.id} className="relative flex items-start group">
          <div className="absolute -left-1 flex items-center justify-center">
            <div className={`w-3 h-3 rounded-full ring-4 ring-white dark:ring-slate-900 ${event.isCompleted ? 'bg-blue-600 dark:bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
          </div>
          <div className="ml-6">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{event.title}</p>
            {event.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{event.description}</p>
            )}
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">{event.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
