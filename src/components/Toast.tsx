'use client';

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const icons: Record<ToastType, ReactNode> = {
  success: <CheckCircle size={18} className="text-[#22C55E]" />,
  error: <AlertCircle size={18} className="text-[#EF4444]" />,
  warning: <AlertTriangle size={18} className="text-[#F59E0B]" />,
  info: <Info size={18} className="text-[#EE6B8D]" />,
};

const bgBorders: Record<ToastType, string> = {
  success: "border-l-[#22C55E]",
  error: "border-l-[#EF4444]",
  warning: "border-l-[#F59E0B]",
  info: "border-l-[#EE6B8D]",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const idRef = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto animate-slide-in-right bg-white rounded-xl shadow-xl border border-gray-100 border-l-4 ${bgBorders[toast.type]} px-4 py-3 flex items-center gap-3 min-w-[280px] max-w-[380px]`}
          >
            {icons[toast.type]}
            <p className="font-lato text-sm text-[#2E2422] flex-1 leading-tight">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-0.5 hover:bg-gray-100 rounded-full transition-colors shrink-0"
            >
              <X size={14} className="text-gray-400" />
            </button>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </ToastContext.Provider>
  );
}
