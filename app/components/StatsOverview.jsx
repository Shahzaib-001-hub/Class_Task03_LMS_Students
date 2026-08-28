"use client";

export default function StatsOverview({ total, active, inactive, selectedFilter, onSelectFilter }) {
  const activePercentage = total > 0 ? Math.round((active / total) * 100) : 0;
  const inactivePercentage = total > 0 ? Math.round((inactive / total) * 100) : 0;

  const cards = [
    {
      id: "ALL",
      title: "Total Students",
      count: total,
      meta: "100% of directory",
      icon: "fa-solid fa-users",
      iconBg: "bg-blue-500/10 text-blue-600 border border-blue-200/50",
      accentBorder: "hover:border-blue-400",
      activeRing: selectedFilter === "ALL" ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50/40" : "border-slate-200 bg-white",
      badge: "Total Base",
      badgeStyle: "bg-blue-100 text-blue-700",
    },
    {
      id: "Active",
      title: "Active Students",
      count: active,
      meta: `${activePercentage}% active rate`,
      icon: "fa-solid fa-user-check",
      iconBg: "bg-emerald-500/10 text-emerald-600 border border-emerald-200/50",
      accentBorder: "hover:border-emerald-400",
      activeRing: selectedFilter === "Active" ? "ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/40" : "border-slate-200 bg-white",
      badge: "Enrolled & Active",
      badgeStyle: "bg-emerald-100 text-emerald-700",
    },
    {
      id: "Inactive",
      title: "Inactive Students",
      count: inactive,
      meta: `${inactivePercentage}% inactive`,
      icon: "fa-solid fa-user-xmark",
      iconBg: "bg-amber-500/10 text-amber-600 border border-amber-200/50",
      accentBorder: "hover:border-amber-400",
      activeRing: selectedFilter === "Inactive" ? "ring-2 ring-amber-500 border-amber-500 bg-amber-50/40" : "border-slate-200 bg-white",
      badge: "Paused / Inactive",
      badgeStyle: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {cards.map((card) => {
          const isSelected = selectedFilter === card.id;

          return (
            <div
              key={card.id}
              onClick={() => onSelectFilter(card.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onSelectFilter(card.id);
                }
              }}
              className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md border ${card.activeRing} ${card.accentBorder}`}
            >
              {/* Header inside card */}
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${card.iconBg}`}>
                  <i className={card.icon}></i>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${card.badgeStyle}`}>
                  {card.badge}
                </span>
              </div>

              {/* Stat number & Label */}
              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-mono">
                  {card.count}
                </div>
                <div className="text-sm font-semibold text-slate-700 mt-1 flex items-center justify-between">
                  <span>{card.title}</span>
                  {isSelected && (
                    <span className="text-xs font-medium text-indigo-600 flex items-center gap-1">
                      <i className="fa-solid fa-check"></i> Filter applied
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{card.meta}</p>
              </div>

              {/* Bottom decorative bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Click to filter table</span>
                <i className="fa-solid fa-arrow-down-short-wide text-slate-400"></i>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


