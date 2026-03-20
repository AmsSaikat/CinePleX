import React, { useEffect, useState } from "react";
import { adminSocket } from "../socket/adminSocketClient";

const HostControlPanel = ({ theaterCode, audience, currentHostId, userId }) => {
  const [moderators, setModerators] = useState([]);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    // Connect socket and join theater room
    adminSocket.connect();
    adminSocket.emit("joinTheaterRoom", theaterCode);

    // Listen for updates
    adminSocket.on("host:transferred", ({ newHostId }) => {
      console.log("New host:", newHostId);
    });

    adminSocket.on("moderator:updated", ({ moderators }) => {
      setModerators(moderators);
    });

    adminSocket.on("user:kicked", ({ userId }) => {
      console.log("User kicked:", userId);
      // optionally remove from audience state
    });

    adminSocket.on("theater:lock", ({ isLocked }) => {
      setIsLocked(isLocked);
    });

    adminSocket.on("movie:changed", ({ movieId }) => {
      console.log("New movie:", movieId);
      // update video player
    });

    return () => {
      adminSocket.disconnect();
    };
  }, [theaterCode]);

  // Kick user
  const handleKick = (userId) => {
    adminSocket.emit("user:kicked", { theaterCode, userId });
  };

  // Transfer host
  const handleTransferHost = (newHostId) => {
    adminSocket.emit("host:transfer", { theaterCode, newHostId });
  };

  // Assign/remove moderator
  const handleModerator = (userId, action) => {
    adminSocket.emit("moderator:update", { theaterCode, userId, action });
  };

  // Lock/unlock theater
  const toggleLock = () => {
    adminSocket.emit("theater:lock", { theaterCode, isLocked: !isLocked });
    setIsLocked(!isLocked);
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg flex flex-col gap-4">
      <h2 className="text-xl font-bold">Host Controls</h2>

      <button onClick={toggleLock} className="btn">
        {isLocked ? "Unlock Theater" : "Lock Theater"}
      </button>

      <div>
        <h3 className="font-semibold">Audience</h3>
        {audience.map((user) => (
          <div key={user._id} className="flex items-center justify-between">
            <span>{user.name}</span>
            {user._id !== currentHostId && (
              <div className="flex gap-2">
                <button onClick={() => handleKick(user._id)} className="btn-sm">Kick</button>
                <button
                  onClick={() =>
                    handleModerator(
                      user._id,
                      moderators.includes(user._id) ? "remove" : "assign"
                    )
                  }
                  className="btn-sm"
                >
                  {moderators.includes(user._id) ? "Remove Mod" : "Make Mod"}
                </button>
                <button onClick={() => handleTransferHost(user._id)} className="btn-sm">
                  Transfer Host
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HostControlPanel;