"use client";

import { useEffect } from "react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-medium ${
          isSuccess
            ? "bg-emerald-900 text-white border-emerald-700 shadow-emerald-900/20"
            : isError
            ? "bg-rose-900 text-white border-rose-700 shadow-rose-900/20"
            : "bg-slate-900 text-white border-slate-700 shadow-slate-900/20"
        }`}
      >
        <div
          className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm ${
            isSuccess ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
          }`}
        >
          <i className={`fa-solid ${isSuccess ? "fa-check" : isError ? "fa-circle-exclamation" : "fa-info"}`}></i>
        </div>
        <span>{toast.message}</span>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 text-slate-400 hover:text-white transition-colors"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
}

