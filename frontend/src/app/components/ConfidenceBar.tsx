import { AlertTriangle, TrendingDown, Minus } from "lucide-react";
import { motion } from "motion/react";

interface ConfidenceBarProps {
  disease: string;
  confidence: number;
  index: number;
}

function getConfidenceConfig(confidence: number) {
  if (confidence >= 90) {
    return {
      barColor: "bg-gradient-to-r from-[#ef4444] to-[#f97316]",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-[#dc2626]",
      badgeColor: "bg-red-100 text-red-700",
      label: "HIGH RISK",
      icon: AlertTriangle,
    };
  }
  if (confidence >= 40) {
    return {
      barColor: "bg-gradient-to-r from-[#f59e0b] to-[#eab308]",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-[#d97706]",
      badgeColor: "bg-amber-100 text-amber-700",
      label: "MODERATE",
      icon: Minus,
    };
  }
  return {
    barColor: "bg-gradient-to-r from-[#94a3b8] to-[#cbd5e1]",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    textColor: "text-[#64748b]",
    badgeColor: "bg-slate-100 text-slate-600",
    label: "LOW RISK",
    icon: TrendingDown,
  };
}

export function ConfidenceBar({ disease, confidence, index }: ConfidenceBarProps) {
  const config = getConfidenceConfig(confidence);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
      className={`p-4 rounded-xl border ${config.bgColor} ${config.borderColor}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${config.textColor}`} />
          <span className="text-[#334155]" style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{disease}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full ${config.badgeColor}`} style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.05em' }}>
            {config.label}
          </span>
          <span className={`${config.textColor}`} style={{ fontSize: '1.125rem', fontWeight: 700 }}>
            {confidence.toFixed(2)}%
          </span>
        </div>
      </div>
      <div className="w-full h-2.5 bg-white rounded-full overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${config.barColor}`}
        />
      </div>
    </motion.div>
  );
}
