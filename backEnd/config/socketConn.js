import { Server } from "socket.io";

const setupChatSocket = (server) => {

  const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.NETLIFY_URL
];

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"]
    }
  });

  const users = {}; // socket.id => username

  io.on("connection", (socket) => {
    

    // Set username
    socket.on("JoinRoom",async (userName) => {
      users[socket.id] = userName;
      console.log("User connected:",userName);
      io.emit("userJoined", userName); // notify everyone
    });

    // Handle chat messages
    socket.on("chatMessage", ({ username, text }) => {
      console.log("📩 Received:", username, text);  
      io.emit("chatMessage", { username, text ,time: Date.now()});
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      const username = users[socket.id];
      if (username) io.emit("userLeft", username); // notify everyone
      delete users[socket.id];
      console.log("User disconnected:", socket.id);
    });
  });
};

export default setupChatSocket;
