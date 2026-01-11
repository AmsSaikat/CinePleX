import React from "react";

export default function SquadCard({
  photo,
  name,
  role,
  bio,
  lastActive,
  signatureMove,
}) {
  return (
    <div className="bg-[#111827] rounded-2xl p-5 w-70 shadow-xl hover:scale-105 transition-transform duration-300">
      <img
        src={photo}
        alt={name}
        className="w-24 h-24 rounded-full mx-auto border-2 border-cyan-400 object-cover"
      />

      <h2 className="text-center text-xl font-bold mt-3">{name}</h2>
      <p className="text-center text-cyan-400 text-sm">{role}</p>

      <p className="text-sm text-gray-300 mt-3 text-center">{bio}</p>

      <div className="mt-4 text-sm">
        <p>
          <span className="text-gray-400">Last Active:</span>{" "}
          <span className="text-green-400">{lastActive}</span>
        </p>

        <p className="mt-1">
          <span className="text-gray-400">Signature Move:</span>{" "}
          <span className="text-yellow-400">{signatureMove}</span>
        </p>
      </div>
    </div>
  );
}
