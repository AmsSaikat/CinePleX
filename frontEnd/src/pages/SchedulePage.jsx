import React from "react";
import Navbar from "../components/Navbar";
import ScheduleSlider from "../components/ScheduleSlider";

export default function SchedulePage() {
  return (
    <div className="bg-[#0b1320] text-white min-h-screen">
      <Navbar />

      {/* HERO HEADER */}
      <section className="w-full py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl font-extrabold">
            Watch <span className="text-cyan-400">Together</span>, On Time
          </h1>

          <p className="text-lg text-blue-300 max-w-2xl mx-auto">
            Plan movie nights, squad screenings and shared moments — all synced,
            all scheduled.
          </p>
        </div>
      </section>

      {/* UPCOMING SCHEDULE */}
      <section className="w-full py-20 bg-[#101a2f]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-10 text-center">
            Upcoming Screenings
          </h2>

          <ScheduleSlider />
        </div>
      </section>

      {/* INFO CARDS */}
      <section className="w-full py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-2xl bg-[#101a2f] shadow-xl">
            <h3 className="text-xl font-semibold text-cyan-400">
              Your Theaters
            </h3>
            <p className="text-blue-300 mt-3">
              All watch parties you host or joined — organized and ready.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#101a2f] shadow-xl">
            <h3 className="text-xl font-semibold text-cyan-400">
              Squad Nights
            </h3>
            <p className="text-blue-300 mt-3">
              Special screenings planned by your crew.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#101a2f] shadow-xl">
            <h3 className="text-xl font-semibold text-cyan-400">
              Watch History
            </h3>
            <p className="text-blue-300 mt-3">
              Revisit moments you watched together.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
