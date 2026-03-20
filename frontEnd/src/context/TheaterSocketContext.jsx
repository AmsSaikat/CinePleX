import React, { createContext, useContext, useState, useEffect } from "react";
import { connectToTheater, getSocket, disconnectSocket } from "../services/theaterSocket";

const TheaterSocketContext = createContext();

export const useTheaterSocket = () => {
  return useContext(TheaterSocketContext);
};

export const TheaterSocketProvider = ({ children }) => {

  const [socket, setSocket] = useState(null);

  const [members, setMembers] = useState([]);

  const [theaterState, setTheaterState] = useState({
    videoUrl: "",
    currentTime: 0,
    isPlaying: false,
  });

  const [messages, setMessages] = useState([]);

  const [reactions, setReactions] = useState([]);

  /*
  Connect to theater
  */
  const joinTheater = (theaterCode, username) => {

    const newSocket = connectToTheater(theaterCode, username);

    setSocket(newSocket);

    /*
    Receive theater state
    */
    newSocket.on("theater-state", (state) => {
      setTheaterState(state);
    });

    /*
    Receive members list
    */
    newSocket.on("members-update", (membersList) => {
      setMembers(membersList);
    });

    /*
    Receive chat messages
    */
    newSocket.on("chat-message", (message) => {
      setMessages(prev => [...prev, message]);
    });

    /*
    Receive reactions
    */
    newSocket.on("reaction", (reaction) => {
      setReactions(prev => [...prev, reaction]);
    });

  };

  /*
  Leave theater
  */
  const leaveTheater = () => {
    disconnectSocket();
    setSocket(null);
    setMembers([]);
    setMessages([]);
    setReactions([]);
  };

  /*
  Send chat message
  */
  const sendMessage = (text) => {
    const socket = getSocket();
    socket.emit("chat-message", text);
  };

  /*
  Send reaction
  */
  const sendReaction = (emoji) => {
    const socket = getSocket();
    socket.emit("reaction", emoji);
  };

  const value = {
    socket,
    theaterState,
    members,
    messages,
    reactions,
    joinTheater,
    leaveTheater,
    sendMessage,
    sendReaction
  };

  return (
    <TheaterSocketContext.Provider value={value}>
      {children}
    </TheaterSocketContext.Provider>
  );
};