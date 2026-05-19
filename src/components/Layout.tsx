import { Link, NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-emerald-50/30">
      {/* Header — refined with brand mark + subtle gradient underline */}
      <header className="sticky top-0 z-50 bg-white/75 backdrop-blur-md border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            {/* Mountain mark — references Yunnan terrain */}
            <span className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-amber-400 flex items-center justify-center shadow-sm shadow-emerald-500/30 group-hover:shadow-md group-hover:shadow-emerald-500/40 transition-shadow">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 19l5-9 4 6 3-4 6 7H3z" />
                <circle cx="17" cy="7" r="2" fill="currentColor" stroke="none" />
              </svg>
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-base font-extrabold text-slate-800 tracking-tight">
                云南探索
              </span>
              <span className="text-[10px] text-slate-400 tracking-[0.2em] uppercase">
                Yunnan · Explorer
              </span>
            </span>
          </Link>

          <nav className="flex items-center gap-1 text-sm">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`
              }
            >
              目的地
            </NavLink>
            <a
              href="#yunnan-map"
              className="hidden sm:inline-block px-3 py-1.5 rounded-lg font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              地图
            </a>
            <span className="hidden sm:inline-block ml-2 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
              86 景点
            </span>
          </nav>
        </div>
        {/* gradient underline */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-slate-200/70 bg-white/60 backdrop-blur mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            云南探索 — 发现秘境云南
          </div>
          <div className="text-xs text-slate-400">
            数据来源于公开信息整理，仅供参考。Made with care.
          </div>
        </div>
      </footer>
    </div>
  );
}
