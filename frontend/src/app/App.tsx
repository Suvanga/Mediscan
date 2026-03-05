import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Activity } from "lucide-react";
import { UploadZone } from "./components/UploadZone";
import { ProcessingOverlay } from "./components/ProcessingOverlay";
import { DiagnosticResults } from "./components/DiagnosticResults";

type AppState = "upload" | "processing" | "results";

const SAMPLE_XRAY = "https://images.unsplash.com/photo-1584555684040-bad07f46a21f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzdCUyMHhyYXklMjBtZWRpY2FsJTIwcmFkaW9ncmFwaHxlbnwxfHx8fDE3NzI3MzQ2NTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const MOCK_RESULTS = [
  { disease: "Pneumothorax", confidence: 95.72 },
  { disease: "Edema", confidence: 51.61 },
  { disease: "Hernia", confidence: 14.25 },
  { disease: "Consolidation", confidence: 72.38 },
  { disease: "Cardiomegaly", confidence: 43.94 },
  { disease: "Atelectasis", confidence: 8.17 },
  { disease: "Pleural Effusion", confidence: 67.52 },
  { disease: "Mass", confidence: 5.33 },
];

export default function App() {
  const [appState, setAppState] = useState<AppState>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleClear = useCallback(() => {
    setSelectedFile(null);
    setImagePreview(null);
  }, []);

  const handleAnalyze = useCallback(() => {
    if (!selectedFile) return;
    setAppState("processing");
    setProgress(0);
  }, [selectedFile]);

  // Simulate processing
  useEffect(() => {
    if (appState !== "processing") return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setAppState("results"), 400);
          return 100;
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [appState]);

  const handleReset = useCallback(() => {
    setAppState("upload");
    setSelectedFile(null);
    setImagePreview(null);
    setProgress(0);
  }, []);

  // Demo mode: use sample image if user wants to try without uploading
  const handleDemo = useCallback(() => {
    const demoFile = new File([""], "chest-xray-demo.png", { type: "image/png" });
    setSelectedFile(demoFile);
    setImagePreview(SAMPLE_XRAY);
  }, []);

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-8" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Centered Card Container */}
      <AnimatePresence mode="wait">
        {appState === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
          >
            {/* Branding Header inside card */}
            <div className="px-8 pt-8 pb-6 border-b border-slate-100">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#0EA5E9] flex items-center justify-center shadow-lg shadow-[#0EA5E9]/25">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-[#0f172a] tracking-tight" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                  Medi<span className="text-[#0EA5E9]">Scan</span>
                </span>
              </div>
              <p className="text-center text-[#64748b]" style={{ fontSize: '0.875rem' }}>
                AI-Powered Chest X-Ray Analysis
              </p>
            </div>

            {/* Upload Zone */}
            <div className="p-8">
              <UploadZone
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                onClear={handleClear}
                imagePreview={imagePreview}
              />

              {/* Analyze button */}
              <div className="mt-6 flex flex-col items-center gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={!selectedFile}
                  className={`
                    w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200
                    ${selectedFile
                      ? "bg-[#0EA5E9] text-white hover:bg-[#0284c7] shadow-lg shadow-[#0EA5E9]/25 cursor-pointer"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }
                  `}
                  style={{ fontSize: '1rem', fontWeight: 600 }}
                >
                  <Zap className="w-5 h-5" />
                  Analyze Scan
                </button>

                {!selectedFile && (
                  <button
                    onClick={handleDemo}
                    className="text-[#0EA5E9] hover:underline"
                    style={{ fontSize: '0.8125rem', fontWeight: 500 }}
                  >
                    Try with a sample X-Ray
                  </button>
                )}
              </div>
            </div>

            {/* Feature pills */}
            <div className="px-8 pb-8 flex flex-wrap justify-center gap-2">
              {[
                "14 Pathology Detection",
                "97.8% Accuracy",
                "< 2s Analysis",
              ].map((feature) => (
                <span
                  key={feature}
                  className="px-3 py-1.5 rounded-full bg-slate-100 text-[#64748b]"
                  style={{ fontSize: '0.6875rem', fontWeight: 500 }}
                >
                  {feature}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {appState === "processing" && imagePreview && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
          >
            <div className="px-8 pt-8 pb-6 border-b border-slate-100 text-center">
              <h2 className="text-[#0f172a]" style={{ fontSize: '1.25rem', fontWeight: 600 }}>Scanning in Progress</h2>
              <p className="text-[#64748b] mt-1" style={{ fontSize: '0.875rem' }}>
                Our AI model is analyzing the radiograph for abnormalities
              </p>
            </div>
            <div className="p-8">
              <ProcessingOverlay imagePreview={imagePreview} progress={Math.min(Math.round(progress), 100)} />
            </div>
          </motion.div>
        )}

        {appState === "results" && imagePreview && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-6xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
          >
            <div className="px-8 pt-8 pb-6 border-b border-slate-100 text-center">
              <h2 className="text-[#0f172a]" style={{ fontSize: '1.25rem', fontWeight: 600 }}>Diagnostic Report</h2>
              <p className="text-[#64748b] mt-1" style={{ fontSize: '0.875rem' }}>
                AI analysis complete &middot; {MOCK_RESULTS.length} pathologies evaluated
              </p>
            </div>
            <div className="p-8">
              <DiagnosticResults
                imagePreview={imagePreview}
                results={MOCK_RESULTS}
                onReset={handleReset}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
