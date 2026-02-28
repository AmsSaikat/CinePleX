import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { MdSend, MdFace, MdPeople } from "react-icons/md";
import EmojiPicker, { Theme } from "emoji-picker-react";

const socket = io("http://localhost:3000");

// Premium Time Formatter
function timeAgo(timestamp) {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h`;
}

function ChatBubble({ user, msg, isOwn, time }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: isOwn ? 20 : -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      className={`flex flex-col ${isOwn ? "items-end" : "items-start"} mb-4`}
    >
      <div className={`flex items-center gap-2 mb-1 px-1`}>
        {!isOwn && <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500">{user}</span>}
        <span className="text-[9px] text-zinc-500 font-mono">{timeAgo(time)}</span>
      </div>
      
      <div className={`relative px-4 py-2.5 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-lg
        ${isOwn 
          ? "bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-tr-none" 
          : "bg-zinc-800/80 backdrop-blur-md text-zinc-200 border border-white/5 rounded-tl-none"}
      `}>
        {msg}
      </div>
    </motion.div>
  );
}

export default function ChatBox() {
  const [userName, setUserName] = useState("");
  const [popupName, setPopupName] = useState(true);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.on("userJoined", (user) => {
      setMessages((prev) => [...prev, { system: true, text: `${user} entered the theater` }]);
    });
    socket.on("chatMessage", (data) => setMessages((prev) => [...prev, data]));
    socket.on("userLeft", (user) => {
      setMessages((prev) => [...prev, { system: true, text: `${user} left the room` }]);
    });
    return () => { socket.off("userJoined"); socket.off("chatMessage"); socket.off("userLeft"); };
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      socket.emit("JoinRoom", userName);
      setPopupName(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chatMessage", { username: userName, text: message, time: Date.now() });
      setMessage("");
      setShowPicker(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {popupName ? (
          <motion.form
            key="join"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            onSubmit={handleJoin}
            className="rounded-[2.5rem] bg-zinc-900/50 backdrop-blur-2xl border border-white/10 p-10 flex flex-col items-center gap-6 shadow-2xl"
          >
            <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20">
               <MdPeople className="text-cyan-400 text-3xl" />
            </div>
            <div className="text-center">
                <h2 className="text-2xl font-black italic text-white tracking-tighter">IDENTIFY YOURSELF</h2>
                <p className="text-zinc-500 text-sm">Enter your callsign to join the squad</p>
            </div>
            <input
              type="text"
              className="w-full bg-black/40 border border-white/10 px-5 py-4 rounded-2xl text-white outline-none focus:border-cyan-500 transition-all text-center font-bold tracking-widest uppercase"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              placeholder="YOUR NAME"
            />
            <button type="submit" className="w-full py-4 bg-cyan-500 text-black font-black rounded-2xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              JOIN THEATER
            </button>
          </motion.form>
        ) : (
          <motion.div 
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col h-[600px] rounded-[2.5rem] bg-zinc-900/40 backdrop-blur-xl border border-white/5 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                <h2 className="font-black italic text-xs uppercase tracking-[0.2em] text-zinc-300">Theater Chat</h2>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Live Sync Active</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2 scrollbar-hide">
              {messages.map((msg, i) =>
                msg.system ? (
                  <div key={i} className="py-4 text-center">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                      {msg.text}
                    </span>
                  </div>
                ) : (
                  <ChatBubble
                    key={i}
                    user={msg.username}
                    msg={msg.text}
                    time={msg.time}
                    isOwn={msg.username === userName}
                  />
                )
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/20">
              <form
                onSubmit={handleSend}
                className="relative flex items-center gap-2 bg-zinc-800/50 border border-white/10 rounded-2xl px-4 py-2 focus-within:border-cyan-500/50 transition-all"
              >
                <button
                  type="button"
                  onClick={() => setShowPicker(!showPicker)}
                  className="text-zinc-500 hover:text-cyan-400 transition-colors"
                >
                  <MdFace size={24} />
                </button>

                <input
                  type="text"
                  className="flex-1 bg-transparent outline-none text-white py-2 text-sm placeholder:text-zinc-600"
                  placeholder="Broadcast a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <button
                  type="submit"
                  className="p-2 bg-cyan-500 text-black rounded-xl hover:scale-110 active:scale-95 transition-all"
                >
                  <MdSend size={18} />
                </button>

                {showPicker && (
                  <div className="absolute bottom-full right-0 mb-4 z-50 shadow-2xl">
                    <EmojiPicker
                      theme={Theme.DARK}
                      onEmojiClick={(emoji) => setMessage((p) => p + emoji.emoji)}
                    />
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}