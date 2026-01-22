import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { MdSend } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";

const socket = io("http://localhost:3000");

function timeAgo(timestamp) {
  const diff = Math.floor((Date.now() - timestamp) / 1000);

  if (diff < 60) return "now"; // under a minute
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

// Simple ChatBubble component
function ChatBubble({ user, msg, isOwn, time }) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-xl max-w-xs ${
          isOwn ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-200"
        }`}
      >
        {!isOwn && <span className="font-bold mr-2">{user}:</span>}
        {msg}
        <div className="text-xs text-gray-400 mt-1 text-right">
          {timeAgo(time)}
        </div>
      </div>
    </div>
  );
}

export default function ChatBox() {
  const [userName, setUserName] = useState("");
  const [popupName, setPopupName] = useState(true);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    socket.on("userJoined", (user) => {
      setMessages((prev) => [
        ...prev,
        { system: true, text: `${user} joined the chat` },
      ]);
    });

    socket.on("chatMessage", ({ username, text, time }) => {
      setMessages((prev) => [...prev, { username, text, time }]);
    });

    socket.on("userLeft", (user) => {
      setMessages((prev) => [
        ...prev,
        { system: true, text: `${user} left the chat` },
      ]);
    });

    return () => {
      socket.off("userJoined");
      socket.off("chatMessage");
      socket.off("userLeft");
    };
  }, []);

  // Refresh relative timestamps every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prev) => [...prev]);
    }, 60000);

    return () => clearInterval(interval);
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
      socket.emit("chatMessage", {
        username: userName,
        text: message,
        time: Date.now(),
      });
      setMessage("");
    }
  };

  return (
    <div className="mt-6 px-6 pb-6 gap-6">
      {popupName ? (
        <form
          onSubmit={handleJoin}
          className="rounded-3xl bg-[#0e1626] p-6 flex flex-col items-center gap-4"
        >
          <input
            type="text"
            className="border border-gray-700 px-3 py-2 w-full rounded-lg bg-gray-900 text-white"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            placeholder="Enter your name"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            Enter chat
          </button>
        </form>
      ) : (
        <div className="rounded-3xl bg-[#0e1626] p-4 flex flex-col">
          {/* Header */}
          <h2 className="font-semibold mb-3 text-white">💬 Theater Chat</h2>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto h-96">
            {messages.map((msg, i) =>
              msg.system ? (
                <div key={i} className="text-center text-gray-400 italic">
                  {msg.text}
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
            {/* Invisible marker for auto-scroll */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="mt-4 flex items-center gap-3 bg-[#070c17] rounded-xl px-4 py-3 text-gray-400"
          >
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-white"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex items-center relative">
              {/* Send button */}
              <button
                type="submit"
                className="ml-auto text-xl mt-1 hover:cursor-pointer text-cyan-700 mr-2 border-2 px-2 rounded-2xl"
              >
                <MdSend />
              </button>

              {/* Emoji toggle button */}
              <button
                type="button"
                onClick={() => setShowPicker(!showPicker)}
                className="text-xl hover:cursor-pointer"
              >
                😊
              </button>

              {/* Emoji picker popup */}
              {showPicker && (
                <div className="absolute bottom-16 right-0 z-50">
                  <EmojiPicker
                    onEmojiClick={(emoji) =>
                      setMessage((prev) => prev + emoji.emoji)
                    }
                  />
                </div>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}