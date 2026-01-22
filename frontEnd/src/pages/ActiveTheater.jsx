import React from "react";
import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";

export default function ActiveTheater() {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#050914] via-[#0b1320] to-black text-white">
      <Navbar />

      {/* Top Theater Info */}
      <div className="px-6 mt-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            🎥 Interstellar (2014)
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
        </div>
      </div>

      {/* Main Layout */}
      <div className="mt-6 px-6 grid grid-cols-12 gap-6">

        {/* Movie Player */}
        <div className="col-span-8 rounded-3xl bg-black border border-white/10 overflow-hidden shadow-[0_0_80px_rgba(0,255,255,0.08)]">
          
          {/* Video Area */}
          <div className="aspect-video bg-linear-to-br from-gray-900 to-black flex items-center justify-center">
            <span className="text-gray-500 text-lg tracking-widest">
              MOVIE PLAYER
            </span>
          </div>

          {/* Controls */}
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

        {/* Right Panel */}
        <div className="col-span-4 flex flex-col gap-6">

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
      </div>

      {/* Bottom Chat Section */}
      <div className="mt-6 px-6 pb-6 grid grid-cols-12 gap-6 h-90">

        {/* Chat Box */}
        <div className="col-span-8 rounded-3xl bg-[#0e1626] h-90 overflow-y-auto flex-1 border  border-white/10 p-4 flex flex-col">
          <ChatBox/>
        </div>

        {/* Theater Stats */}
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
    </div>
  );
}

function ChatBubble({ user, msg }) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center text-sm">
        {user[0]}
      </div>
      <div className="bg-[#070c17] rounded-xl px-4 py-2">
        <p className="text-xs text-gray-400">{user}</p>
        <p className="text-sm">{msg}</p>
      </div>
    </div>
  );
}