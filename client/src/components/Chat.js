import React, {useState, useEffect} from 'react';
import Picker from 'emoji-picker-react';
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({socket, username, room}) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [displayEmojiPiker, setDisplayEmojiPicker] = useState(false)

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setCurrentMessage(currentMessage + chosenEmoji.emoji)
  };

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
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);// showing my msg as well
      setCurrentMessage("");
    }
  };

  const inputClickHandler = (e) => {
    e.preventDefault()
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);
  


  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Hi {username}, what's up?</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
        {messageList.map((messageObj) => {
          return (
            <div
              className="message"
              id={username === messageObj.author ? "you" : "other"}
            >
              <div>
                <div className="message-content">
                  <p>{messageObj.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{messageObj.time}</p>
                  <p id="author">{messageObj.author}</p>
                </div>
              </div>
            </div>
          );
        })}
      </ScrollToBottom>
      

    </div>
    <div className="chat-footer">
      <input
        type="text"
        value={currentMessage}
        placeholder="Hey..."
        onChange={(event) => {
          setCurrentMessage(event.target.value);
        }}
        onClick={(event) => inputClickHandler(event) }
      />
      <div className="chat-nav">
        <div className="chat-emoji" onClick={() => setDisplayEmojiPicker(!displayEmojiPiker)}>:-|</div>
        <button className="chat-btn" onClick={() => sendMessage()}>&raquo;</button>
      </div>
    </div>

    {displayEmojiPiker ? 
      <div>
        <Picker onEmojiClick={onEmojiClick} />
      </div>
      :
      null
   }    
   
  </div>
  )
}

export default Chat