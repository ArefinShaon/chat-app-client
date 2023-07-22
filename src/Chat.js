import React, { useEffect, useState, useRef } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import css from "./App.css";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
        sent: true, // Mark the message as sent by the current user
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  // Use a ref to keep track of the event listener
  const receiveMessageListener = useRef(null);

  useEffect(() => {
    receiveMessageListener.current = (data) => {
      setMessageList((list) => [...list, { ...data, sent: false }]);
    };

    // Add the event listener for "receive_message" during component mounting
    socket.on("receive_message", receiveMessageListener.current);

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("receive_message", receiveMessageListener.current);
    };
  }, [socket]);

  // Function to handle sending a message when the send button is clicked
  const handleSendMessage = () => {
    sendMessage();
  };

  // Function to handle the rich text editor's change event
  const handleEditorChange = (value) => {
    setCurrentMessage(value);
  };

  return (
    <div className="chat-window mx-auto ">
      <div className="chat-header text-center">
        <p>Live Chat</p>
      </div>
      <div className="chat-body rounded">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => (
            <div
              key={index}
              className="message"
              id={messageContent.sent ? "you" : "other"}
            >
              <div>
                <div
                  className="message-content"
                  dangerouslySetInnerHTML={{ __html: messageContent.message }}
                />
                <div className="message-meta">
                  <p id="time">{messageContent.time}</p>
                  <p id="author">{messageContent.author}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="h-16 flex">
        {/* Rich Text Editor */}
        <ReactQuill
          className="w-3/4"
          value={currentMessage}
          placeholder="type here..."
          onChange={handleEditorChange}
         />

        <button className="btn btn-primary bg-pink-600 mt-4 ms-2 w-1/6" onClick={handleSendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
