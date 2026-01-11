import React from "react";
import SquadCard from "../components/SquadCard";
import Navbar from "../components/Navbar";

export default function TheSquad() {
  const squad = [
    {
      name: "X",
      role: "Leader / Strategist",
      bio: "Runs the show. Cold mind, clean execution.",
      lastActive: "Online now",
      signatureMove: "Master Plan",
      photo: "https://i.pravatar.cc/150?img=3",
    },
    {
      name: "Y",
      role: "Tech Guy",
      bio: "Breaks systems before they break us.",
      lastActive: "5 mins ago",
      signatureMove: "Zero-Day Strike",
      photo: "https://i.pravatar.cc/150?img=5",
    },
    {
      name: "Z",
      role: "Operations",
      bio: "Gets things done. No questions asked.",
      lastActive: "1 hour ago",
      signatureMove: "Silent Execution",
      photo: "https://i.pravatar.cc/150?img=8",
    },
    {
      name: "W",
      role: "Recon",
      bio: "Sees everything before it happens.",
      lastActive: "Yesterday",
      signatureMove: "Ghost Walk",
      photo: "https://i.pravatar.cc/150?img=11",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b1320] text-white p-8">
        <Navbar/>
      <h1 className="text-4xl font-extrabold text-center mb-3">
        The <span className="text-cyan-400">Squad</span>
      </h1>

      <p className="text-center text-gray-400 mb-10">
        Not a team. A unit. One mission.
      </p>

      <div className="flex flex-wrap justify-center gap-8">
        {squad.map((member, index) => (
          <SquadCard key={index} {...member} />
        ))}
      </div>
    </div>
  );
}
