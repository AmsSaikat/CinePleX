import { Server } from "socket.io";

const setupAdminSocket = (server) => {
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

  io.on("connection", (socket) => {
    console.log("Host/Admin socket connected:", socket.id);

    // Join theater room
    socket.on("joinTheaterRoom", (code) => {
      socket.join(code);
      console.log(`Socket ${socket.id} joined theater ${code}`);
    });

    // Host transfers host
    socket.on("host:transfer", ({ theaterCode, newHostId }) => {
      io.to(theaterCode).emit("host:transferred", { newHostId });
    });

    // Assign/remove moderators
    socket.on("moderator:update", ({ theaterCode, moderators }) => {
      io.to(theaterCode).emit("moderator:updated", { moderators });
    });

    // Kick user
    socket.on("user:kicked", ({ theaterCode, userId }) => {
      io.to(theaterCode).emit("user:kicked", { userId });
    });

    // Lock / unlock theater
    socket.on("theater:lock", ({ theaterCode, isLocked }) => {
      io.to(theaterCode).emit("theater:lock", { isLocked });
    });

    // Change current movie
    socket.on("movie:change", ({ theaterCode, movieId }) => {
      io.to(theaterCode).emit("movie:changed", { movieId });
    });

    socket.on("disconnect", () => {
      console.log("Host/Admin socket disconnected:", socket.id);
    });
  });
};

export default setupAdminSocket;