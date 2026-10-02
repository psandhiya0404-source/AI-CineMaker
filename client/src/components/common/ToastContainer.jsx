import React from 'react';
import { useGeneration } from '../../context/GenerationContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useGeneration();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border transition-all animate-bounce-in max-w-md ${
            toast.type === 'success'
              ? 'bg-cine-900/95 border-emerald-500/30 text-emerald-300'
              : toast.type === 'error'
              ? 'bg-cine-900/95 border-rose-500/30 text-rose-300'
              : 'bg-cine-900/95 border-cine-gold/30 text-cine-gold-light'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-cine-gold flex-shrink-0" />}
          <span className="text-sm font-medium flex-1 text-slate-100">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white transition p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
