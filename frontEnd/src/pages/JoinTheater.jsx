import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function JoinTheater() {
    const navigate=useNavigate()
  return (
    <div className="min-h-screen bg-linear-to-br from-[#060b16] via-[#0b1320] to-black text-white">
      <Navbar />

      {/* Hero */}
      <div className="mt-16 text-center px-4">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Enter the <span className="text-cyan-400">Theater</span>
        </h1>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto">
          Join a private cinema room. Watch together. React together.
          Experience movies the way they were meant to be shared.
        </p>
      </div>

      {/* Main Card */}
      <div className="mt-16 flex justify-center px-4">
        <div className="relative w-full max-w-lg rounded-3xl bg-[#0e1626]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_60px_rgba(0,255,255,0.08)] p-8">
          
          {/* Glow */}
          <div className="absolute -top-1 -left-1 w-full h-full rounded-3xl bg-cyan-500/10 blur-2xl -z-10" />

          <h2 className="text-2xl font-bold mb-2">Join via Code</h2>
          <p className="text-gray-400 text-sm mb-6">
            Ask the host for a theater code or invitation
          </p>

          {/* Fake Input */}
          <div className="w-full px-4 py-4 rounded-xl bg-[#070c17] border border-gray-700 text-gray-500 tracking-widest text-center">
            • • • • • •
          </div>

          {/* Button */}
          <div onClick={()=>navigate('/active-theater')} className="mt-6 w-full py-4 rounded-xl bg-linear-to-r from-cyan-400 to-blue-500 text-black font-semibold text-center cursor-default">
            Enter Theater
          </div>

          <p className="mt-4 text-xs text-gray-500 text-center">
            Synced playback · Private rooms · Live chat
          </p>
        </div>
      </div>

      {/* Feature Row */}
      <div className="mt-20 flex flex-wrap justify-center gap-8 px-6">
        <Feature
          title="🎥 Perfect Sync"
          desc="Everyone watches the same frame, every time."
        />
        <Feature
          title="💬 Live Reactions"
          desc="Chat, react, and vibe without pausing."
        />
        <Feature
          title="🔒 Invite Only"
          desc="Private theaters with controlled access."
        />
      </div>

      {/* Theater Preview */}
      <div className="mt-20 flex justify-center px-4 pb-20">
        <div className="w-full max-w-2xl rounded-2xl bg-[#0e1626] border border-white/10 p-6">
          <h3 className="text-xl font-bold mb-4">Theater Preview</h3>

          <div className="grid grid-cols-2 gap-y-4 text-sm text-gray-400">
            <span>Host</span>
            <span className="text-cyan-400 font-medium">Saikat</span>

            <span>Members</span>
            <span className="text-green-400 font-medium">4 / 8</span>

            <span>Now Playing</span>
            <span className="text-purple-400 font-medium">
              Interstellar (2014)
            </span>

            <span>Status</span>
            <span className="text-yellow-400 font-medium">
              Waiting for members
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="w-64 rounded-2xl bg-[#0e1626] border border-white/10 p-6 text-center shadow-xl">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm text-gray-400">{desc}</p>
    </div>
  );
}
