import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import useProductCounts from '../hooks/useProductCounts';
const ICONS = {
  stock:
    'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  active: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  draft:
    'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  zero: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  chevron: 'M15 19l-7-7 7-7',
};

const LINKS = [
  { to: '/active-products', label: 'Active', icon: 'active', countKey: 'active' },
  { to: '/draft-products', label: 'Draft', icon: 'draft', countKey: 'draft' },
  { to: '/exact-inventory', label: 'Exact Inventory', icon: 'zero', countKey: 'zeroInventory' },
  { to: '/out-of-stock', label: 'Out of Stock', icon: 'stock', countKey: 'outOfStock' },
];

function Icon({ name, className = 'h-5 w-5' }) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={ICONS[name]} />
    </svg>
  );
}

export default function Sidebar() {
  const { counts } = useProductCounts();
  let totalProducts = 0;
  LINKS.map((link) => {
    totalProducts += counts[link.countKey];
  });

  const [collapsed, setCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('sidebar-collapsed');
      if (saved !== null) return saved === 'true';
    } catch {
      /* ignore */
    }
    return typeof window !== 'undefined' && window.innerWidth < 768;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sidebar-collapsed', String(collapsed));
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  return (
    <aside
      className={`sticky top-0 z-40 flex h-screen shrink-0 flex-col self-start border-r border-slate-200 bg-white transition-[width] duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand + toggle */}
      <div
        className={`flex h-16 items-center border-b border-slate-200 px-3 ${
          collapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        {!collapsed && (
          <span className="truncate pl-1 text-lg font-semibold tracking-tight text-slate-900">
            Qurvii Admin
          </span>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-800"
        >
          <Icon
            name="chevron"
            className={`h-5 w-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-2" aria-label="Main">
        {LINKS.map(({ to, label, icon, countKey }) => {
          const value = counts[countKey];
          const isPending = value === undefined;
          const display = value === null ? '–' : value?.toLocaleString('en-IN');

          return (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? `${label}${!isPending ? `: ${display}` : ''}` : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 ${
                  collapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon name={icon} />

              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{label}</span>
                  {isPending ? (
                    <span
                      className="h-4 w-8 animate-pulse rounded bg-slate-200"
                      aria-label="Loading count"
                    />
                  ) : (
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold tabular-nums text-slate-700">
                      {display}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
        <div className="px-4">
          <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 ">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Total Products
            </span>
            <span className="rounded-md bg-slate-900 px-2.5 py-0.5 text-sm font-semibold tabular-nums text-white">
              {Number(totalProducts ?? 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </nav>
    </aside>
  );
}
