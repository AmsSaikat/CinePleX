import { io } from "socket.io-client";

const allowedOrigins = process.env.REACT_APP_CLIENT_URL || "http://localhost:3000";

export const adminSocket = io(allowedOrigins, {
  autoConnect: false, // connect manually
});