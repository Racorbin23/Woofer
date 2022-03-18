import React, { useContext } from "react";
import UserContext from "../../Contexts/UserContext";

function ChatMessage(props) {
  const usr = useContext(UserContext);
  const author = props.data.author;
  const content = props.data.contents;
  var style = "";

  if (author === usr.user.uid) {
    style = "user-message";
  } else {
    style = "incoming-message";
  }
  return <div className={style}>{content}</div>;
}

export default ChatMessage;
