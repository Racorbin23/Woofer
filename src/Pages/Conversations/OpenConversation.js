import React, { useEffect, useState, useContext } from "react";
import UserContext from "../../Contexts/UserContext";
import ChatMessage from "./ChatMessage";

import { SEND_MESSAGE } from "../../api/api";

function OpenConversation(props) {
  console.log(props);

  const usr = useContext(UserContext);
  const [chatHistory, setHistory] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    console.log("Setting history!");
    console.log(props);
    const newItems = [];
    props.convoData.history.forEach((item, i) => {
      newItems.push(<ChatMessage data={item} />);
    });
    setHistory(newItems);
  }, [props.convoData]);

  return (
    <div className="open-convo-wrapper">
      <div className="open-convo-top">
        <button
          className="open-convo-back-button"
          onClick={() => {
            console.log("Going back!");
            props.setCurrent("");
          }}
        >
          Back
        </button>
        <div className="open-convo-name">{props.recipientProfile.name}</div>
        <img
          src={props.recipientImage}
          alt="ProfilePic"
          className="open-convo-pic"
        />
      </div>
      <div className="open-convo">{chatHistory}</div>
      <div className="open-convo-bottom">
        <input
          className="open-convo-input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <button
          className="open-convo-send-button"
          onClick={() => {
            console.log("Sending chat message!");
            const messageData = {};
            messageData.author = usr.user.uid;
            messageData.contents = input;
            SEND_MESSAGE(props.convoKey, props.convoData, messageData);
            setInput("");
          }}
        >
          SEND
        </button>
      </div>
    </div>
  );
}

export default OpenConversation;
