import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function NotificationToast({ toast }) {
  if (!toast || !toast.show) return null;

  const isError = toast.type === 'error';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 999,
        background: isError ? 'rgba(239, 68, 68, 0.95)' : 'rgba(16, 185, 129, 0.95)',
        color: 'white',
        padding: '0.85rem 1.5rem',
        borderRadius: 'var(--radius-full)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontWeight: '600',
        fontSize: '0.9rem',
        backdropFilter: 'blur(8px)',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {isError ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
      <span>{toast.message}</span>
    </div>
  );
}
