import { STATUS_OPTIONS } from '../constants/config';

export default function ProductFilters({ search, onSearch, status, onStatus }) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row">
      <input
        type="search"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search by style number or title"
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 sm:flex-1"
      />
    </div>
  );
}
