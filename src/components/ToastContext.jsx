import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((message, opts = {}) => {
    const id = Date.now() + Math.random();
    const t = { id, message, ...opts };
    setToasts((s) => [t, ...s]);
    if (!opts.persistent) setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), opts.duration || 4000);
  }, []);

  const remove = useCallback((id) => setToasts((s) => s.filter((t) => t.id !== id)), []);

  return (
    <ToastContext.Provider value={{ add, remove }}>
      {children}
      <div className="fixed right-4 bottom-4 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <div key={t.id} className={`max-w-sm w-full p-3 rounded-lg shadow-lg flex items-start gap-3 ${t.type === 'error' ? 'bg-red-50 border border-red-200' : t.type === 'success' ? 'bg-emerald-50 border border-emerald-200' : 'bg-white border'}`}>
            <div className="flex-1 text-sm text-slate-800">{t.message}</div>
            <div className="text-xs text-slate-400 mt-0.5">{t.type || 'info'}</div>
            <button onClick={() => remove(t.id)} className="text-xs text-slate-500 ml-2">Dismiss</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
