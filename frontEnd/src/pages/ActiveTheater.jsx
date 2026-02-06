import React, { useState } from "react"
import Navbar from "../components/Navbar"
import ChatBox from "../components/ChatBox"
import UploadMovieModal from "../pages/movieModal/UploadMovieModal"
import TheaterPlayer from "../components/TheaterPlayer"

// Demo HLS stream (replace later with uploaded movie URL)
const DEMO_HLS =
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"

export default function ActiveTheater() {
  const [showUpload, setShowUpload] = useState(false)
  const [movieLoaded, setMovieLoaded] = useState(false)
  const [waitingUser, setWaitingUser] = useState(null)
  const [movieUrl, setMovieUrl] = useState(null)

  // Called after a successful upload
  const handleMovieUploaded = (url) => {
    setMovieUrl(url)          // Set uploaded movie URL
    setMovieLoaded(true)
    setShowUpload(false)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#050914] via-[#0b1320] to-black text-white">
      <Navbar />

      {/* BUFFERING / SYNC BANNER */}
      {waitingUser && (
        <div className="mx-6 mt-4 rounded-xl bg-yellow-500/10 border border-yellow-400/30 p-3 text-yellow-300 text-sm">
          ⏳ Waiting for <span className="font-semibold">{waitingUser}</span> to buffer…
        </div>
      )}

      {/* Top Theater Info */}
      <div className="px-6 mt-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            🎥 {movieLoaded ? "Interstellar (2014)" : "No Movie Loaded"}
          </h1>
          <p className="text-sm text-gray-400">
            Hosted by <span className="text-cyan-400 font-medium">Saikat</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="px-4 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
            ● Live Sync
          </span>
          <span className="px-4 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm">
            Watch Party
          </span>

          {/* HOST CONTROL */}
          <button
            onClick={() => setShowUpload(true)}
            className="ml-4 px-4 py-2 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition"
          >
            Upload Movie
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="mt-6 px-6 grid grid-cols-12 gap-6">

        {/* Movie Player */}
        <div className="col-span-8 rounded-3xl bg-black border border-white/10 overflow-hidden shadow-[0_0_80px_rgba(0,255,255,0.08)]">

          {/* Video Area */}
          <div className="aspect-video bg-black">
            {!movieLoaded ? (
              <div className="h-full flex items-center justify-center">
                <span className="text-gray-500 text-lg tracking-widest">
                  NO MOVIE LOADED
                </span>
              </div>
            ) : (
              <TheaterPlayer
                src={movieUrl || DEMO_HLS}
                onBufferStart={() => setWaitingUser("Someone")}
                onBufferEnd={() => setWaitingUser(null)}
              />
            )}
          </div>

          {/* Controls (visual only for now) */}
          <div className="p-4 flex items-center justify-between bg-[#0b1320] border-t border-white/10">
            <div className="flex gap-4 text-gray-400 text-sm">
              <span>⏸ Pause</span>
              <span>🔊 Volume</span>
              <span>⚙ Quality</span>
            </div>

            <span className="text-xs text-gray-500">
              Synced with 6 viewers
            </span>
          </div>
        </div>

        {/* Chat Box */}
        <div className="rounded-3xl bg-[#0e1626] h-120 overflow-y-auto flex-1 border border-white/10 p-4 col-span-4 flex flex-col gap-6">
          <ChatBox />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-6 px-6 pb-6 grid grid-cols-12 gap-6 h-90">

        {/* Watchers + Reactions */}
        <div className="col-span-8 rounded-3xl bg-[#0e1626] border border-white/10 p-4 flex flex-col gap-6">

          {/* Active Watchers */}
          <div className="rounded-2xl bg-[#0e1626] border border-white/10 p-4">
            <h2 className="font-semibold mb-3">👥 Watching Now</h2>

            <div className="space-y-3">
              {["X", "Y", "Z", "W"].map((name) => (
                <div
                  key={name}
                  className="flex items-center gap-3 bg-[#070c17] rounded-xl p-2"
                >
                  <div className="w-8 h-8 rounded-full bg-cyan-500/30 flex items-center justify-center text-sm">
                    {name[0]}
                  </div>
                  <span className="text-sm">{name}</span>
                  <span className="ml-auto text-green-400 text-xs">●</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emoji Reactions */}
          <div className="rounded-2xl bg-[#0e1626] border border-white/10 p-4">
            <h2 className="font-semibold mb-3">🔥 Reactions</h2>
            <div className="flex justify-between text-2xl">
              <span>😂</span>
              <span>😮</span>
              <span>🔥</span>
              <span>💀</span>
              <span>👏</span>
              <span>❤️</span>
            </div>
          </div>
        </div>

        {/* Theater Info */}
        <div className="col-span-4 rounded-2xl bg-[#0e1626] border border-white/10 p-4">
          <h2 className="font-semibold mb-4">🎯 Theater Info</h2>

          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex justify-between">
              <span>Room Code</span>
              <span className="text-cyan-400">AX9-Q2F</span>
            </div>
            <div className="flex justify-between">
              <span>Playback</span>
              <span className="text-green-400">Synced</span>
            </div>
            <div className="flex justify-between">
              <span>Latency</span>
              <span className="text-yellow-400">Low</span>
            </div>
            <div className="flex justify-between">
              <span>Privacy</span>
              <span className="text-purple-400">Invite-Only</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadMovieModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUploaded={handleMovieUploaded}
      />
    </div>
  )
}
