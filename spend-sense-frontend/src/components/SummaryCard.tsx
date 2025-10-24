import React from "react";

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  subtitle,
  icon,
}) => {
  return (
    <div className="p-6 bg-white rounded-xl card-shadow">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-400">{title}</div>
          <div className="text-2xl font-extrabold mt-2">{value}</div>
          {subtitle && (
            <div className="text-xs text-slate-400 mt-2">{subtitle}</div>
          )}
        </div>
        <div className="w-14 h-14 rounded-xl pulse-badge flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
