import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
}

export function DataTable<T>({ columns, data, keyExtractor, onRowClick, isLoading }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={`px-6 py-4 whitespace-nowrap ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500">
                <div className="flex justify-center items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce"></div>
                  <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr 
                key={keyExtractor(row)} 
                onClick={() => onRowClick?.(row)}
                className={`group transition-colors ${onRowClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50' : ''}`}
              >
                {columns.map((col, i) => (
                  <td key={i} className={`px-6 py-4 ${col.className || ''}`}>
                    {typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
