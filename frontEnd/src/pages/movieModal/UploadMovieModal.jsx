import React, { useState } from "react"
import { X, Upload, Film } from "lucide-react"
import { supaBase } from "../../lib/supaBase"


export default function UploadMovieModal({ isOpen, onClose, onUploaded }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progressText, setProgressText] = useState("")

  if (!isOpen) return null

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setProgressText("Uploading movie…")

    const theaterId = "demo-theater" // later replace with real theater ID
    const filePath = `theaters/${theaterId}/source/${Date.now()}_${file.name}`

    const { error } = await supaBase.storage
      .from("movies")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (error) {
      console.error(error)
      alert("Upload failed")
      setUploading(false)
      return
    }

    const { data } = supabase.storage
      .from("movies")
      .getPublicUrl(filePath)

    setUploading(false)
    setProgressText("")

    onUploaded?.(data.publicUrl)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full max-w-lg bg-[#101a2f] rounded-2xl shadow-2xl p-6 border border-white/10">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Film className="text-cyan-400" />
            <h2 className="text-lg font-semibold">Upload Movie</h2>
          </div>
          <X
            onClick={onClose}
            className="cursor-pointer text-white/60 hover:text-white"
          />
        </div>

        {/* Upload Area */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/15 rounded-xl p-6 cursor-pointer hover:border-cyan-400/40 transition">
          <Upload className="mb-3 text-cyan-400" />
          <p className="text-sm text-gray-300">
            Click to select a movie file
          </p>
          <p className="text-xs text-gray-500 mt-1">
            MP4 recommended • Max ~1GB (free tier)
          </p>
          <input
            type="file"
            accept="video/mp4,video/webm,video/x-matroska"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        {/* Selected File */}
        {file && (
          <div className="mt-4 text-sm text-gray-300">
            🎬 {file.name}
          </div>
        )}

        {/* Progress */}
        {uploading && (
          <div className="mt-4 text-sm text-yellow-400">
            ⏳ {progressText}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={uploading}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition text-sm disabled:opacity-50"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  )
}
