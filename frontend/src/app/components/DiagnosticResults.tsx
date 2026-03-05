import { motion } from "motion/react";
import { Shield, Clock, FileText, Download, RotateCcw, Activity } from "lucide-react";
import { ConfidenceBar } from "./ConfidenceBar";

interface DiagnosticResult {
  disease: string;
  confidence: number;
}

interface DiagnosticResultsProps {
  imagePreview: string;
  results: DiagnosticResult[];
  onReset: () => void;
}

export function DiagnosticResults({ imagePreview, results, onReset }: DiagnosticResultsProps) {
  const sortedResults = [...results].sort((a, b) => b.confidence - a.confidence);
  const highRiskCount = sortedResults.filter(r => r.confidence >= 90).length;
  const timestamp = new Date().toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="w-full" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Summary banner */}
      {highRiskCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-red-800" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              {highRiskCount} High-Confidence Finding{highRiskCount > 1 ? "s" : ""} Detected
            </p>
            <p className="text-red-600" style={{ fontSize: '0.8125rem' }}>
              Review findings below. AI-generated results require clinical validation.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#0EA5E9]" />
                <span className="text-[#334155]" style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Chest X-Ray</span>
              </div>
              <span className="text-[#94a3b8]" style={{ fontSize: '0.6875rem' }}>PA View</span>
            </div>
            <div className="bg-black/95 flex items-center justify-center p-6" style={{ minHeight: 360 }}>
              <img src={imagePreview} alt="Chest X-Ray" className="max-h-[340px] w-full object-contain rounded" />
            </div>
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[#94a3b8]" style={{ fontSize: '0.6875rem', fontWeight: 500 }}>Scan ID</p>
                  <p className="text-[#334155]" style={{ fontSize: '0.8125rem', fontWeight: 500 }}>#MDS-{Math.floor(Math.random() * 90000 + 10000)}</p>
                </div>
                <div>
                  <p className="text-[#94a3b8]" style={{ fontSize: '0.6875rem', fontWeight: 500 }}>Analyzed</p>
                  <p className="text-[#334155] flex items-center gap-1" style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                    <Clock className="w-3 h-3" /> {timestamp}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={onReset}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-300 text-[#64748b] hover:bg-slate-50 transition-colors"
              style={{ fontSize: '0.8125rem', fontWeight: 500 }}
            >
              <RotateCcw className="w-4 h-4" /> New Scan
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0EA5E9] text-white hover:bg-[#0284c7] transition-colors shadow-lg shadow-[#0EA5E9]/25"
              style={{ fontSize: '0.8125rem', fontWeight: 500 }}
            >
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>
        </motion.div>

        {/* Right Column - Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0EA5E9]" />
                <span className="text-[#334155]" style={{ fontSize: '0.9375rem', fontWeight: 600 }}>AI Diagnostic Findings</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700" style={{ fontSize: '0.625rem', fontWeight: 600 }}>
                COMPLETE
              </span>
            </div>

            <div className="p-5 space-y-3 bg-white">
              {sortedResults.map((result, index) => (
                <ConfidenceBar
                  key={result.disease}
                  disease={result.disease}
                  confidence={result.confidence}
                  index={index}
                />
              ))}
            </div>

            {/* Disclaimer */}
            <div className="mx-5 mb-5 p-3 rounded-lg bg-slate-100 border border-slate-200">
              <p className="text-[#94a3b8]" style={{ fontSize: '0.6875rem', lineHeight: 1.6 }}>
                <span style={{ fontWeight: 600 }} className="text-[#64748b]">Disclaimer:</span> These results are AI-generated predictions and should not be used as a sole basis for clinical diagnosis. All findings must be reviewed by a qualified radiologist.
              </p>
            </div>
          </div>

          {/* Model info cards */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: "Model", value: "DenseNet-v3.2", icon: "🧠" },
              { label: "Inference", value: "1.4s", icon: "⚡" },
              { label: "Accuracy", value: "97.8%", icon: "📊" },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-3 text-center">
                <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                <p className="text-[#334155] mt-1" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{item.value}</p>
                <p className="text-[#94a3b8]" style={{ fontSize: '0.6875rem' }}>{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
