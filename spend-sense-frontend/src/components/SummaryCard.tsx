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
      <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg shadow-gray-400/30 relative overflow-hidden">
        <div
          className={`absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 ${color} rounded-bl-full`}
        ></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between relative z-10">
          <div className="mb-4 sm:mb-0">
            <div className="text-sm sm:text-base text-slate-400">{title}</div>
            <div className="text-xl sm:text-2xl font-extrabold mt-1 sm:mt-2">
              {value}
            </div>
            {subtitle && (
              <div className="text-xs sm:text-sm text-slate-400 mt-1 sm:mt-2">
                {subtitle}
              </div>
            )}
          </div>

          {icon && (
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl pulse-badge flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SummaryCard;
