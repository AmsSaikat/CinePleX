import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {Settings,Crown,Shield,UserX,Ban,X} from "lucide-react";

export default function AdminModeratorPanel() {
  const [open, setOpen] = useState(true);

  const [users, setUsers] = useState([
    { _id: "1", name: "Saikat", role: "owner" },
    { _id: "2", name: "X", role: "user" },
    { _id: "3", name: "Y", role: "moderator" },
    { _id: "4", name: "Z", role: "user" },
  ]);

  const currentUserId = "1";

  const currentUser = users.find(u => u._id === currentUserId);
  const isOwner = currentUser?.role === "owner";
  const isModerator = currentUser?.role === "moderator";

  /* ================= ACTIONS ================= */

  const kickUser = (id) => {
    setUsers(prev => prev.filter(u => u._id !== id));
  };

  const banUser = (id) => {
    setUsers(prev => prev.filter(u => u._id !== id));
    console.log("User banned for few minutes:", id);
  };

  const transferHost = (id) => {
    setUsers(prev =>
      prev.map(u => ({
        ...u,
        role:
          u._id === id
            ? "owner"
            : u.role === "owner"
            ? "user"
            : u.role,
      }))
    );
  };

  const toggleModerator = (id) => {
    setUsers(prev =>
      prev.map(u =>
        u._id === id
          ? { ...u, role: u.role === "moderator" ? "user" : "moderator" }
          : u
      )
    );
  };

  /* ================= UI ================= */

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="absolute top-4 right-4 z-9999 bg-black/60 p-3 rounded-full border border-cyan-400/30"
      >
        <Settings className="text-cyan-400" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="absolute top-0 right-0 h-full w-85 bg-[#0b1320]/95 backdrop-blur-xl border-l border-cyan-500/20 z-9999 p-5"
          >
            {/* HEADER */}
            <div className="flex justify-between mb-4">
              <h2 className="text-white font-semibold flex gap-2">
                <Settings size={18}/> Control Panel
              </h2>
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            {/* USERS */}
            <div className="space-y-2">
              {users.map(user => {
                const isSelf = user._id === currentUserId;

                return (
                  <div
                    key={user._id}
                    className="flex justify-between items-center bg-[#101a2f] px-3 py-2 rounded-xl"
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-2">
                      <span>{user.name}</span>

                      {user.role === "owner" && <Crown size={14} className="text-yellow-400"/>}
                      {user.role === "moderator" && <Shield size={14} className="text-cyan-400"/>}
                    </div>

                    {/* RIGHT ACTIONS */}
                    {!isSelf && (
                      <div className="flex gap-2">

                        {/* Kick (owner + mod) */}
                        {(isOwner || isModerator) && (
                          <button onClick={() => kickUser(user._id)}>
                            <UserX size={16} className="text-red-400"/>
                          </button>
                        )}

                        {/* Ban (owner only) */}
                        {isOwner && (
                          <button onClick={() => banUser(user._id)}>
                            <Ban size={16} className="text-orange-400"/>
                          </button>
                        )}

                        {/* Make/Remove Moderator */}
                        {isOwner && (
                          <button onClick={() => toggleModerator(user._id)}>
                            <Shield size={16} className="text-cyan-400"/>
                          </button>
                        )}

                        {/* Transfer Host */}
                        {isOwner && (
                          <button onClick={() => transferHost(user._id)}>
                            <Crown size={16} className="text-yellow-400"/>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}