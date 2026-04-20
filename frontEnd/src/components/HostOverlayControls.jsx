import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {Settings,Lock,Unlock,Crown,UserX,Play,Pause,SkipForward,X,} from "lucide-react";

export default function HostOverlayControls({theater,userId,audience,socket, playerRef, // video ref from TheaterPlayer
}) {
  const [open, setOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(theater.isLocked);
  const [isPlaying, setIsPlaying] = useState(false);

  // Only host can see
  if (userId !== theater.owner) return null;

  /* ================= SOCKET LISTENERS ================= */
  useEffect(() => {
    socket.emit("joinTheaterRoom", theater.code);

    socket.on("video:play", () => {
      playerRef.current?.play();
      setIsPlaying(true);
    });

    socket.on("video:pause", () => {
      playerRef.current?.pause();
      setIsPlaying(false);
    });

    socket.on("video:seek", ({ time }) => {
      if (playerRef.current) playerRef.current.currentTime = time;
    });

    socket.on("theater:lock", ({ isLocked }) => {
      setIsLocked(isLocked);
    });

    return () => {
      socket.off("video:play");
      socket.off("video:pause");
      socket.off("video:seek");
      socket.off("theater:lock");
    };
  }, []);

  /* ================= ACTIONS ================= */

  const togglePlay = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      socket.emit("video:pause", { theaterCode: theater.code });
    } else {
      socket.emit("video:play", { theaterCode: theater.code });
    }

    setIsPlaying(!isPlaying);
  };

  const seekForward = () => {
    const newTime = playerRef.current.currentTime + 10;
    socket.emit("video:seek", {
      theaterCode: theater.code,
      time: newTime,
    });
  };

  const toggleLock = () => {
    const newState = !isLocked;
    setIsLocked(newState);

    socket.emit("theater:lock", {
      theaterCode: theater.code,
      isLocked: newState,
    });
  };

  const kickUser = (id) => {
    socket.emit("user:kicked", {
      theaterCode: theater.code,
      userId: id,
    });
  };

  const transferHost = (id) => {
    socket.emit("host:transfer", {
      theaterCode: theater.code,
      newHostId: id,
    });
  };

  /* ================= UI ================= */

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="absolute top-4 right-4 z-50 bg-black/60 backdrop-blur-md p-3 rounded-full border border-cyan-400/30"
      >
        <Settings className="text-cyan-400" size={20} />
      </motion.button>

      {/* Overlay Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-0 right-0 h-full w-85 bg-[#0b1320]/95 backdrop-blur-xl border-l border-cyan-500/20 z-50 p-5 flex flex-col"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <Settings size={18} /> Host Panel
              </h2>
              <button onClick={() => setOpen(false)}>
                <X className="text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* ================= PLAYBACK CONTROLS ================= */}
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-2">Playback</p>

              <div className="flex gap-3">
                <button
                  onClick={togglePlay}
                  className="flex-1 bg-cyan-500/20 text-cyan-400 py-2 rounded-xl flex items-center justify-center gap-2"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  {isPlaying ? "Pause" : "Play"}
                </button>

                <button
                  onClick={seekForward}
                  className="flex-1 bg-[#101a2f] text-white py-2 rounded-xl flex items-center justify-center gap-2"
                >
                  <SkipForward size={16} /> +10s
                </button>
              </div>
            </div>

            {/* ================= LOCK ================= */}
            <button
              onClick={toggleLock}
              className={`w-full mb-4 py-2 rounded-xl flex items-center justify-center gap-2 
              ${isLocked ? "bg-red-500/20 text-red-400" : "bg-cyan-500/20 text-cyan-400"}`}
            >
              {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
              {isLocked ? "Unlock Theater" : "Lock Theater"}
            </button>

            {/* ================= AUDIENCE ================= */}
            <div className="flex-1 overflow-y-auto">
              <p className="text-xs text-gray-400 mb-2">Audience</p>

              <div className="flex flex-col gap-2">
                {audience.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between bg-[#101a2f] px-3 py-2 rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm">{user.name}</span>
                      {user._id === theater.owner && (
                        <Crown className="text-yellow-400" size={14} />
                      )}
                    </div>

                    {user._id !== theater.owner && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => kickUser(user._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <UserX size={16} />
                        </button>

                        <button
                          onClick={() => transferHost(user._id)}
                          className="text-yellow-400 hover:text-yellow-300"
                        >
                          <Crown size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}