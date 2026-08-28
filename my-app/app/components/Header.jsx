"use client";

import { useEffect, useState } from "react";

export default function Header({ dbStatus }) {
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateTime(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo and System Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <i className="fa-solid fa-graduation-cap text-lg sm:text-xl"></i>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 font-sans uppercase">
                  Student Dashboard
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  LMS v2.0
                </span>
                {dbStatus === "connected" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    MongoDB Active
                  </span>
                )}
                {dbStatus === "error" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Local Cache
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
                MongoDB backed student enrollments, statuses, and profiles
              </p>
            </div>
          </div>

          {/* Right section: Live Time & Admin Profile */}
          <div className="flex items-center gap-3 sm:gap-6">
            {currentDateTime && (
              <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200">
                <i className="fa-regular fa-clock text-indigo-500"></i>
                <span>{currentDateTime}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pl-3 sm:border-l sm:border-slate-200">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-indigo-500/30">
                <i className="fa-solid fa-user-tie"></i>
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-semibold text-slate-800 leading-tight">Admin Portal</div>
                <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Online
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


