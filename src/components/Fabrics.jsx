import React from 'react';
import { fabricNumbers } from '../utils/fabrics';

const Fabrics = ({ styleNumber, stocks }) => {
  const fabrics = fabricNumbers(styleNumber, stocks);

  if (!fabrics?.length) return null;

  return (
    <div>
      <ul className="space-y-1.5">
        {fabrics.map((fab, i) => (
          <li
            key={`${fab.fabricNumber}-${i}`}
            className="flex items-center justify-between gap-3 rounded-md border border-slate-100 bg-slate-50/60 px-2.5 py-1.5 text-xs"
          >
            <span className="min-w-0 truncate text-slate-600">
              <span className="font-medium text-slate-400">#Fab-{i + 1}</span>
              <span className="mx-1 text-slate-300">:</span>
              <span className="font-medium text-slate-800">{fab.fabricName}</span>
              <span className="ml-1 text-slate-500">({fab.fabricNumber})</span>
            </span>
            <span className="shrink-0 whitespace-nowrap font-medium tabular-nums text-slate-700">
              {fab.availableStock?.toFixed(2)} Mtr
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Fabrics;
