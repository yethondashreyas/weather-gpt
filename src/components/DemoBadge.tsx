import React from "react";

export const DemoBadge: React.FC<{ label?: string }> = ({ label = "SIMULATED DATA" }) => {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
      {label}
    </span>
  );
};
