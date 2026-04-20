import { io } from "socket.io-client";

const allowedOrigins = process.env.VITE_SOCKET_URL;

export const adminSocket = io(allowedOrigins, {
  autoConnect: false, // connect manually
});