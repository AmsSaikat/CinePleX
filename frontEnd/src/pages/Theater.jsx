import React from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'

export default function Theater() {
    const navigate=useNavigate()
  return (
    <div className="bg-[#0b1320] text-white min-h-screen">
      <Navbar />

      {/* ===== Hero Sayings Section ===== */}
      <section className="mt-16 text-center space-y-4">
        <h1 className="text-4xl">
          Welcome,
          <span className="font-extrabold text-5xl text-cyan-500 ml-2">
            Saikat
          </span>
        </h1>

        <p className="text-xl text-gray-300">
          Enjoy cinema the way it was meant to be —
        </p>

        <p className="text-2xl font-semibold text-cyan-400">
          Together. Synced. Live.
        </p>
      </section>

      {/* ===== Theater Action Cards ===== */}
      <section className="mt-20 flex flex-col md:flex-row justify-center gap-10 px-10">
        
        {/* Your Theater */}
        <div className="w-full md:w-1/3 bg-[#111a2e] border border-gray-700 rounded-2xl p-8 shadow-xl hover:scale-105 transition">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">
            Your Theater
          </h2>

          <p className="text-gray-300 mb-6">
            Create your own private theater and invite friends for a perfectly
            synced watch party.
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>Host movies & series</li>
            <li>Real-time sync playback</li>
            <li>Text & voice chat</li>
            <li>Reactions & comments</li>
          </ul>

          <button className="mt-8 w-full bg-cyan-600 hover:bg-cyan-700 py-2 rounded-xl font-semibold 
          hover:animate-pulse hover:shadow-[0_0_5px_white] transition-all duration-200">
            Create Theater
          </button>
        </div>

        {/* Join a Theater */}
        <div className="w-full md:w-1/3 bg-[#111a2e] border border-gray-700 rounded-2xl p-8 shadow-xl hover:scale-105 transition">
          <h2 className="text-2xl font-bold mb-4 text-amber-400">
            Join a Theater
          </h2>

          <p className="text-gray-300 mb-6">
            Enter a theater code and instantly join your friends — no delays,
            no desync.
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>Instant room joining</li>
            <li>Live voice & chat</li>
            <li>Auto sync enabled</li>
            <li>Watch together globally</li>
          </ul>

          <button className="mt-8 w-full bg-amber-500 hover:bg-amber-600 py-2 rounded-xl font-semibold text-black
          hover:animate-pulse hover:shadow-[0_0_5px_white] transition-all  duration-200" onClick={()=>navigate('/join-theater')}>
            Join Theater
          </button>
        </div>

      </section>
    </div>
  )
}
