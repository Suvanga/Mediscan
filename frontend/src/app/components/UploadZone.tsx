import { useState, useRef, useCallback } from "react";
import { CloudUpload, FileImage, X, Activity } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  imagePreview: string | null;
  // NEW: Function to pass the AI results back to the main App
  onScanComplete?: (results: any) => void; 
}

export function UploadZone({ onFileSelect, selectedFile, onClear, imagePreview, onScanComplete }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // NEW: Loading state
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  // NEW: The function that actually sends the image to FastAPI
  const handleAnalyzeScan = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Sends the image to your Python backend at http://127.0.0.1:8000/predict
      const response = await axios.post("/predict", formData);
      
      console.log("AI Prediction Success:", response.data);
      if (onScanComplete) {
        onScanComplete(response.data);
      }
    } catch (error) {
      console.error("Failed to analyze scan:", error);
      alert("Error connecting to the ML backend. Is your FastAPI server running?");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleFileChange}
      />

      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative cursor-pointer rounded-2xl border-2 border-dashed p-12
              transition-all duration-300 ease-in-out
              ${isDragOver
                ? "border-[#0EA5E9] bg-[#0EA5E9]/5 shadow-lg shadow-[#0EA5E9]/10"
                : "border-slate-300 bg-slate-50/50 hover:border-[#0EA5E9]/50 hover:bg-slate-50"
              }
            `}
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={isDragOver ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDragOver ? "bg-[#0EA5E9] shadow-lg shadow-[#0EA5E9]/30" : "bg-white border-2 border-slate-200"}`}
              >
                <CloudUpload className={`w-8 h-8 ${isDragOver ? "text-white" : "text-[#0EA5E9]"}`} />
              </motion.div>
              <div className="text-center">
                <p className="text-[#334155] mb-1" style={{ fontSize: '1rem', fontWeight: 600 }}>
                  {isDragOver ? "Drop your X-Ray here" : "Upload Chest X-Ray for AI Analysis"}
                </p>
                <p className="text-[#94a3b8]" style={{ fontSize: '0.875rem' }}>
                  JPEG/PNG format &middot; Max 25MB
                </p>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="h-px w-12 bg-slate-300"></div>
                <span className="text-[#94a3b8]" style={{ fontSize: '0.75rem', fontWeight: 500 }}>OR</span>
                <div className="h-px w-12 bg-slate-300"></div>
              </div>
              <button
                type="button"
                className="px-6 py-2.5 rounded-xl border-2 border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white transition-all duration-200"
                style={{ fontSize: '0.875rem', fontWeight: 600 }}
              >
                Browse Files
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="relative rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
          >
            <button
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
            >
              <X className="w-4 h-4 text-[#64748b]" />
            </button>
            {imagePreview && (
              <div className="rounded-xl overflow-hidden bg-black/95 flex items-center justify-center" style={{ maxHeight: 320 }}>
                <img src={imagePreview} alt="X-Ray Preview" className="max-h-[320px] object-contain" />
              </div>
            )}
            <div className="mt-3 flex items-center gap-3 px-1">
              <div className="w-10 h-10 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center">
                <FileImage className="w-5 h-5 text-[#0EA5E9]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#334155] truncate" style={{ fontSize: '0.875rem', fontWeight: 500 }}>{selectedFile.name}</p>
                <p className="text-[#94a3b8]" style={{ fontSize: '0.75rem' }}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              
              {/* NEW: The Analyze Button */}
              <button
                onClick={handleAnalyzeScan}
                disabled={isProcessing}
                className={`ml-auto px-4 py-2 rounded-lg font-semibold text-white transition-all flex items-center gap-2 ${
                  isProcessing ? "bg-slate-400 cursor-not-allowed" : "bg-[#0EA5E9] hover:bg-blue-600 shadow-sm"
                }`}
                style={{ fontSize: '0.875rem' }}
              >
                {isProcessing ? (
                  <><Activity className="w-4 h-4 animate-spin" /> Analyzing...</>
                ) : (
                  "Analyze Scan"
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}