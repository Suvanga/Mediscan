import { motion } from "motion/react";
import { Cpu } from "lucide-react";

interface ProcessingOverlayProps {
  imagePreview: string;
  progress: number;
}

export function ProcessingOverlay({ imagePreview, progress }: ProcessingOverlayProps) {
  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-200"
      >
        {/* X-Ray Image */}
        <div className="relative bg-black/95 flex items-center justify-center" style={{ height: 400 }}>
          <img src={imagePreview} alt="X-Ray" className="max-h-full object-contain opacity-70" />

          {/* Scanning line */}
          <motion.div
            className="absolute left-0 right-0 h-1 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, #0EA5E9, transparent)",
              boxShadow: "0 0 30px 10px rgba(14, 165, 233, 0.3), 0 0 60px 20px rgba(14, 165, 233, 0.15)",
            }}
            animate={{
              top: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Scan grid overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(14,165,233,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(14,165,233,0.3) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Corner markers */}
          {[
            "top-4 left-4 border-t-2 border-l-2",
            "top-4 right-4 border-t-2 border-r-2",
            "bottom-4 left-4 border-b-2 border-l-2",
            "bottom-4 right-4 border-b-2 border-r-2",
          ].map((pos, i) => (
            <motion.div
              key={i}
              className={`absolute w-6 h-6 border-[#0EA5E9] ${pos}`}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}

          {/* Center label */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="bg-black/60 backdrop-blur-sm rounded-xl px-6 py-4 flex flex-col items-center gap-3 border border-[#0EA5E9]/30">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Cpu className="w-8 h-8 text-[#0EA5E9]" />
              </motion.div>
              <div className="text-center">
                <p className="text-white" style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Analyzing Pathologies...</p>
                <p className="text-[#0EA5E9]/80 mt-0.5" style={{ fontSize: '0.75rem' }}>AI model processing scan data</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="p-5 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#334155]" style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Processing scan...</span>
            <span className="text-[#0EA5E9]" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#2563EB]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="mt-3 flex items-center gap-4">
            {["Region detection", "Pathology analysis", "Confidence scoring"].map((step, i) => (
              <div key={step} className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${progress > (i + 1) * 30 ? "bg-[#0EA5E9]" : "bg-slate-300"}`} />
                <span className={`${progress > (i + 1) * 30 ? "text-[#334155]" : "text-[#94a3b8]"}`} style={{ fontSize: '0.6875rem' }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
