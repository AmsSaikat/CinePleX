import React, { useState } from "react"
import { X, Upload, Film } from "lucide-react"

export default function UploadMovieModal({ isOpen, onClose }) {
  const [fileName, setFileName] = useState("")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full max-w-lg bg-[#101a2f] rounded-2xl shadow-2xl p-6 border border-white/10">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Film className="text-cyan-400" />
            <h2 className="text-lg font-semibold tracking-wide">
              Upload Movie
            </h2>
          </div>
          <X
            onClick={onClose}
            className="cursor-pointer text-white/60 hover:text-white transition"
          />
        </div>

        {/* Upload Area */}
        <label className="group flex flex-col items-center justify-center border-2 border-dashed border-white/15 rounded-xl p-8 cursor-pointer hover:border-cyan-400/40 transition-all">
          <Upload className="mb-3 text-cyan-400 group-hover:scale-110 transition" />
          <p className="text-sm text-gray-300">
            Click to select a movie file
          </p>
          <p className="text-xs text-gray-500 mt-1">
            MP4 • WebM • MKV
          </p>

          <input
            type="file"
            className="hidden"
            onChange={(e) =>
              setFileName(e.target.files?.[0]?.name || "")
            }
          />
        </label>

        {/* Selected File Preview */}
        {fileName && (
          <div className="mt-4 text-sm text-gray-300 bg-white/5 p-3 rounded-xl border border-white/10">
            🎬 {fileName}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition text-sm"
          >
            Cancel
          </button>

          <button
            disabled={!fileName}
            className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  )
}