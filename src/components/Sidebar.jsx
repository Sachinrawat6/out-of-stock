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
  upload: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
  chevron: 'M15 19l-7-7 7-7',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 18L18 6M6 6l12 12',
};

// Links that show a product count
const PRODUCT_LINKS = [
  { to: '/active-products', label: 'Active', icon: 'active', countKey: 'active' },
  { to: '/draft-products', label: 'Draft', icon: 'draft', countKey: 'draft' },
  { to: '/exact-inventory', label: 'Exact Inventory', icon: 'zero', countKey: 'zeroInventory' },
  { to: '/out-of-stock', label: 'Out of Stock', icon: 'stock', countKey: 'outOfStock' },
];

// Links without a count
const IMPORT_LINKS = [
  { to: '/upload-sales', label: 'Upload Sales', icon: 'upload' },
  { to: '/upload-rack-space', label: 'Upload Rack Space', icon: 'upload' },
];

const COUNT_KEYS = PRODUCT_LINKS.map((link) => link.countKey);

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
  const { counts = {} } = useProductCounts();

  // Total of the product counts only (upload links have no count)
  const countsLoaded = COUNT_KEYS.every((key) => counts[key] !== undefined);
  const totalProducts = COUNT_KEYS.reduce((sum, key) => sum + (Number(counts[key]) || 0), 0);

  // Desktop: sidebar can be collapsed to icons (remembered in localStorage)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('sidebar-collapsed');
      if (saved !== null) return saved === 'true';
    } catch {
      /* ignore */
    }
    return typeof window !== 'undefined' && window.innerWidth < 1024;
  });

  // Mobile: sidebar is a drawer that slides in over the page
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('sidebar-collapsed', String(collapsed));
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  // Close the mobile drawer with the Escape key
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e) => e.key === 'Escape' && setMobileOpen(false);
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  // Text is hidden only on desktop when collapsed. The mobile drawer always shows text.
  const hideWhenCollapsed = collapsed ? 'md:hidden' : '';

  const renderLink = ({ to, label, icon, countKey }) => {
    const hasCount = Boolean(countKey);
    const value = hasCount ? counts[countKey] : undefined;
    const isPending = hasCount && value === undefined;
    const display = value === null ? '–' : value?.toLocaleString('en-IN');

    return (
      <NavLink
        key={to}
        to={to}
        onClick={() => setMobileOpen(false)}
        title={collapsed ? `${label}${hasCount && !isPending ? `: ${display}` : ''}` : undefined}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 ${
            collapsed ? 'md:justify-center' : ''
          } ${
            isActive
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`
        }
      >
        <Icon name={icon} />
        <span className={`flex-1 truncate ${hideWhenCollapsed}`}>{label}</span>

        {hasCount &&
          (isPending ? (
            <span
              className={`h-4 w-8 animate-pulse rounded bg-slate-200 ${hideWhenCollapsed}`}
              aria-label="Loading count"
            />
          ) : (
            <span
              className={`rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold tabular-nums text-slate-700 ${hideWhenCollapsed}`}
            >
              {display}
            </span>
          ))}
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile: button that opens the drawer */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        aria-expanded={mobileOpen}
        className="fixed left-3 top-3 z-30 rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-sm hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 md:hidden"
      >
        <Icon name="menu" />
      </button>

      {/* Mobile: dark overlay behind the drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-[transform,visibility] duration-300 ease-in-out md:sticky md:top-0 md:z-40 md:h-screen md:shrink-0 md:translate-x-0 md:self-start md:transition-[width] ${
          mobileOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full max-md:invisible'
        } ${collapsed ? 'md:w-16' : 'md:w-64'}`}
      >
        {/* Brand + toggle */}
        <div
          className={`flex h-16 items-center justify-between border-b border-slate-200 px-3 ${
            collapsed ? 'md:justify-center' : ''
          }`}
        >
          <span
            className={`truncate pl-1 text-lg font-semibold tracking-tight text-slate-900 ${hideWhenCollapsed}`}
          >
            Qurvii Admin
          </span>

          {/* Mobile: close the drawer */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 md:hidden"
          >
            <Icon name="close" />
          </button>

          {/* Desktop: collapse or expand */}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            className="hidden rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 md:inline-flex"
          >
            <Icon
              name="chevron"
              className={`h-5 w-5 transition-transform duration-300 ${
                collapsed ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-2" aria-label="Main">
          {PRODUCT_LINKS.map(renderLink)}

          {/* Import section */}
          <div className="my-2 border-t border-slate-200" />
          <p
            className={`px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400 ${hideWhenCollapsed}`}
          >
            Import
          </p>
          {IMPORT_LINKS.map(renderLink)}

          {/* Total products (hidden when the desktop sidebar is collapsed) */}
          <div className={`pt-3 ${hideWhenCollapsed}`}>
            <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Total Products
              </span>
              {countsLoaded ? (
                <span className="rounded-md bg-slate-900 px-2.5 py-0.5 text-sm font-semibold tabular-nums text-white">
                  {totalProducts.toLocaleString('en-IN')}
                </span>
              ) : (
                <span
                  className="h-5 w-10 animate-pulse rounded bg-slate-200"
                  aria-label="Loading total"
                />
              )}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
