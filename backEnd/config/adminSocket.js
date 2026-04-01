const theaters = {}; 
// { theaterId: [ { socketId, userId, name, role } ] }

export const adminSocketHandler = (io, socket) => {
  console.log("Admin socket connected:", socket.id);

  // 🔥 JOIN THEATER
  socket.on("join-theater", ({ theaterId, user }) => {
    socket.join(theaterId);

    socket.data = {
      theaterId,
      ...user,
    };

    if (!theaters[theaterId]) {
      theaters[theaterId] = [];
    }

    theaters[theaterId].push({
      socketId: socket.id,
      ...user,
    });

    io.to(theaterId).emit("theater-users", theaters[theaterId]);
  });

  // ❌ KICK USER
  socket.on("kick-user", ({ theaterId, targetSocketId }) => {
    const requester = socket.data;

    if (requester.role !== "host" && requester.role !== "moderator") return;

    const targetSocket = io.sockets.sockets.get(targetSocketId);

    if (targetSocket) {
      targetSocket.leave(theaterId);
      targetSocket.emit("kicked");

      theaters[theaterId] = theaters[theaterId].filter(
        (u) => u.socketId !== targetSocketId
      );

      io.to(theaterId).emit("theater-users", theaters[theaterId]);
    }
  });

  // 👑 TRANSFER HOST
  socket.on("transfer-host", ({ theaterId, targetSocketId }) => {
    const requester = socket.data;

    if (requester.role !== "host") return;

    theaters[theaterId] = theaters[theaterId].map((user) => {
      if (user.socketId === socket.id) {
        return { ...user, role: "viewer" };
      }
      if (user.socketId === targetSocketId) {
        return { ...user, role: "host" };
      }
      return user;
    });

    io.to(theaterId).emit("theater-users", theaters[theaterId]);
  });

  // 🛡️ ASSIGN MODERATOR
  socket.on("assign-moderator", ({ theaterId, targetSocketId }) => {
    const requester = socket.data;

    if (requester.role !== "host") return;

    theaters[theaterId] = theaters[theaterId].map((user) => {
      if (user.socketId === targetSocketId) {
        return { ...user, role: "moderator" };
      }
      return user;
    });

    io.to(theaterId).emit("theater-users", theaters[theaterId]);
  });

  // 🔌 DISCONNECT
  socket.on("disconnect", () => {
    const { theaterId } = socket.data || {};

    if (theaterId && theaters[theaterId]) {
      theaters[theaterId] = theaters[theaterId].filter(
        (u) => u.socketId !== socket.id
      );

      io.to(theaterId).emit("theater-users", theaters[theaterId]);
    }

    console.log("Admin socket disconnected:", socket.id);
  });
};