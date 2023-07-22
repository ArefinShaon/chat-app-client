import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="bg-pink-50 mt-12">
      <p className="font-bold text-center pt-12 text-3xl ">Welcome To The Chat Room</p>
      <div className=" pb-12 mt-24 mx-auto h-full">
      {!showChat ? (
        <div className="flex flex-col">
          <h3 className="text-center font-bold  p-12 text-xl">Join A Chat</h3>
          <input
            className="border rounded border-gray-800 mx-auto p-4 mt-6"
            type="text"
            placeholder="Your Name"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            className="border rounded border-gray-800 mx-auto p-4 mt-6 mb-6"
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <p className="btn btn-success w-1/3 mx-auto font-bold" onClick={joinRoom}>Join A Room</p>
        </div>
      ) : (
        <Chat  socket={socket} username={username} room={room} />
      )}
    </div>
    </div>
  );
}

export default App;