import React from "react";
import { motion } from "framer-motion";

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 * 0.1 }}
    >
      <div className="p-6 bg-white rounded-xl shadow-lg shadow-gray-400/30 relative overflow-hidden">
        <div
          className={`absolute top-0 right-0 w-20 h-20 ${color} rounded-bl-full`}
        ></div>
        <div className="flex items-start justify-between relative z-10">
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
    </motion.div>
  );
};

export default SummaryCard;
