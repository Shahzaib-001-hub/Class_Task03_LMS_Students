"use client";

import { useEffect } from "react";

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, student }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mx-auto mb-4">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Student</h3>
        <p className="text-sm text-slate-600 mb-4">
          Are you sure you want to remove <strong className="text-slate-900">{student.name}</strong> (ID: #{student.id}) from the system? This action cannot be undone.
        </p>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-6 text-left text-xs text-slate-600 flex items-center justify-between">
          <div>
            <span className="font-semibold text-slate-800">{student.name}</span>
            <span className="text-slate-400"> • {student.gender}, {student.age} yrs</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full font-semibold ${
              student.status === "Active"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {student.status}
          </span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(student.id)}
            className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm shadow-md shadow-rose-200 flex items-center justify-center gap-2 transition-colors"
          >
            <i className="fa-solid fa-trash-can"></i>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

