import { io } from "socket.io-client";

let socket = null;

/*
Connect to a theater room
*/
export const connectToTheater = (theaterCode, username) => {

  socket = io(import.meta.env.VITE_API_URL, {
    transports: ["websocket"]
  });

  socket.emit("join-theater", {
    theaterCode,
    username
  });

  return socket;
};


/*
Get current socket
*/
export const getSocket = () => {
  return socket;
};


/*
Disconnect from theater
*/
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};