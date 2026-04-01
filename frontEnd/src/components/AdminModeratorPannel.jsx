import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Crown, Shield, UserX, Ban, X } from "lucide-react";
import { io } from "socket.io-client";

// 🔌 Connect to backend Socket (port 3000)
const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

export default function AdminModeratorPanel({ theater, user }) {
  const [open, setOpen] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const currentUserId = user?._id;

  // ================= REMOTE USERS STATE =================
  const [users, setUsers] = useState([]);

  // ================= NOTIFICATIONS STATE =================
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  // ================= JOIN THEATER =================
  useEffect(() => {
    if (!theater || !user) return;

    socket.emit("join-theater", {
      theaterId: theater._id,
      user: {
        userId: currentUserId,
        name: user.name,
        role: user._id === theater.owner?._id ? "host" : "viewer",
      },
    });

    socket.on("theater-users", (updatedUsers) => {
      setUsers(updatedUsers);
    });

    // Personal kick notification
    socket.on("kicked", () => {
      addNotification("You were kicked from the theater");
    });

    // Admin action notifications
    socket.on("user-kicked", (data) => {
      addNotification(`${data.name} was kicked`);
    });
    socket.on("user-banned", (data) => {
      addNotification(`${data.name} was banned`);
    });
    socket.on("host-transferred", (data) => {
      addNotification(`${data.name} is now the host`);
    });
    socket.on("moderator-assigned", (data) => {
      addNotification(`${data.name} is now a moderator`);
    });

    return () => {
      socket.off("theater-users");
      socket.off("kicked");
      socket.off("user-kicked");
      socket.off("user-banned");
      socket.off("host-transferred");
      socket.off("moderator-assigned");
    };
  }, [theater, user]);

  // ================= ROLE CHECK =================
  const me = users.find((u) => u.socketId === socket.id) || {};
  const isOwner = me.role === "host";
  const isModerator = me.role === "moderator";

  // ================= DEDUPLICATE USERS =================
  const uniqueUsers = Array.from(new Map(users.map(u => [u.socketId, u])).values());

  // ================= SOCKET ACTIONS =================
  const kickUser = (socketId) => {
    socket.emit("kick-user", { theaterId: theater._id, targetSocketId: socketId });
  };
  const banUser = (socketId) => {
    socket.emit("kick-user", { theaterId: theater._id, targetSocketId: socketId });
  };
  const transferHost = (socketId) => {
    socket.emit("transfer-host", { theaterId: theater._id, targetSocketId: socketId });
  };
  const toggleModerator = (socketId) => {
    socket.emit("assign-moderator", { theaterId: theater._id, targetSocketId: socketId });
  };

  // ================= AUTO HIDE SETTINGS BUTTON =================
  useEffect(() => {
    let timer;
    const resetTimer = () => {
      setShowButton(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShowButton(false), 3000);
    };
    window.addEventListener("mousemove", resetTimer);
    resetTimer();
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      clearTimeout(timer);
    };
  }, []);

  // ================= UI =================
  return (
    <>
      {/* SETTINGS BUTTON */}
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ opacity: 1 }}
        animate={{ opacity: showButton ? 1 : 0 }}
        className="absolute top-4 right-4 z-50 bg-black/40 hover:bg-black/70 p-3 rounded-full border border-cyan-400/30 transition"
      >
        <Settings className="text-cyan-400" />
      </motion.button>

      {/* NOTIFICATIONS */}
      <div className="absolute top-4 right-12.5 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-cyan-500 text-black px-4 py-2 rounded-lg shadow-lg"
            >
              {n.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* CONTROL PANEL */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="absolute top-0 right-0 h-full w-85 bg-[#0b1320]/95 backdrop-blur-xl border-l border-cyan-500/20 z-50 p-5"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-white font-semibold flex gap-2 items-center">
                <Settings size={18} /> Control Panel
              </h2>
              <button onClick={() => setOpen(false)}>
                <X className="text-white/70 hover:text-white" />
              </button>
            </div>

            {/* USERS LIST */}
            <div className="space-y-2">
              {uniqueUsers.map((u) => {
                const key = `${u.socketId}-${u.userId || u.name}`;
                const isSelf = u.socketId === socket.id;

                return (
                  <div key={key} className="flex justify-between items-center bg-[#101a2f] px-3 py-2 rounded-xl">
                    {/* LEFT */}
                    <div className="flex items-center gap-2 text-white">
                      <span>{u.name}</span>
                      {u.role === "host" && <Crown size={14} className="text-yellow-400" />}
                      {u.role === "moderator" && <Shield size={14} className="text-cyan-400" />}
                    </div>

                    {/* RIGHT ACTIONS */}
                    {!isSelf && (
                      <div className="flex gap-2">
                        {(isOwner || isModerator) && (
                          <button onClick={() => kickUser(u.socketId)}>
                            <UserX size={16} className="text-red-400 hover:scale-110 transition" />
                          </button>
                        )}

                        {isOwner && (
                          <>
                            <button onClick={() => banUser(u.socketId)}>
                              <Ban size={16} className="text-orange-400 hover:scale-110 transition" />
                            </button>

                            <button onClick={() => toggleModerator(u.socketId)}>
                              <Shield size={16} className="text-cyan-400 hover:scale-110 transition" />
                            </button>

                            <button onClick={() => transferHost(u.socketId)}>
                              <Crown size={16} className="text-yellow-400 hover:scale-110 transition" />
                            </button>
                          </>
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