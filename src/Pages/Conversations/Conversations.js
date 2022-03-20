import React, { useContext, useEffect, useState } from "react";
import {
  GET_PROFILE,
  SYNC_CONVERSATION,
  DOWNLOAD_PROFILE_PICTURE,
  SEND_MESSAGE,
} from "../../api/api";
import UserContext from "../../Contexts/UserContext";
import "./Conversations.css";

function Conversations() {
  // Get all conversations from UserData
  // Create seperate conversations and pass data if their open or not
  // Pass key to convo
  // Convos store convoData and starts a onValue listener which updates that value
  // Convo will show the shortcut with most recent message or
  // If Convo open it will show the openconversation of that convo with the convoData

  const usr = useContext(UserContext);
  const [conversations, setConversations] = useState([]);
  const [current, setCurrent] = useState("");

  useEffect(() => {
    setConversations([]);

    if (Object.keys(usr.profileData).length > 2) {
      const tConvos = [];
      usr.profileData.conversations.forEach((item, i) => {
        if (current === "") {
          if (item !== "") {
            tConvos.push(
              <Convo
                key={item}
                id={item}
                open={false}
                setCurrent={setCurrent}
              />
            );
          }
        } else {
          if (item !== "" && current === item) {
            tConvos.push(
              <Convo key={item} id={item} open={true} setCurrent={setCurrent} />
            );
          }
        }
      });
      setConversations(tConvos);
    }
  }, [usr, current]);

  if (conversations.length === 0) {
    return <div>Conversations Empty! - Go match with someone!</div>;
  } else {
    return <div className="conversations-wrapper">{conversations}</div>;
  }
}

function Convo({ id, open, setCurrent }) {
  const usr = useContext(UserContext);
  const [convoData, setData] = useState({});
  const [recipientProfile, setRecipientProfile] = useState({});
  const [recipientImage, setImage] = useState("");

  useEffect(() => {
    if (Object.keys(convoData).length < 1) {
      console.log("No convo data! - Syncing Convo!");
      SYNC_CONVERSATION(id, setData);
    } else if (
      Object.keys(convoData).length > 1 &&
      Object.keys(recipientProfile).length < 2
    ) {
      console.log("Update recipient");
      if (convoData.authors[0] !== usr.user.uid) {
        GET_PROFILE(convoData.authors[0], setRecipientProfile);
      } else {
        GET_PROFILE(convoData.authors[1], setRecipientProfile);
      }
    } else if (
      Object.keys(convoData).length > 1 &&
      Object.keys(recipientProfile).length > 2
    ) {
      console.log("Updating Profile Image");
      if (convoData.authors[0] !== usr.user.uid) {
        DOWNLOAD_PROFILE_PICTURE(convoData.authors[0], setImage);
      } else {
        DOWNLOAD_PROFILE_PICTURE(convoData.authors[1], setImage);
      }
    } else {
      console.log("Nothing in Effect!");
    }
  }, [convoData, recipientImage, recipientProfile]);

  if (open === true) {
    return (
      <OpenConvo
        id={id}
        data={convoData}
        recData={recipientProfile}
        recImg={recipientImage}
        setCurrent={setCurrent}
      />
    );
  } else {
    return (
      <ClosedConvo
        id={id}
        data={convoData}
        recData={recipientProfile}
        recImg={recipientImage}
        setCurrent={setCurrent}
      />
    );
  }
}

function ClosedConvo({ id, data, recData, recImg, setCurrent }) {
  if (Object.keys(data).length > 1) {
    return (
      <div
        className="closed-wrapper"
        onClick={() => {
          setCurrent(id);
        }}
      >
        <img src={recImg} alt="Pic" className="closed-img" width="200px" />
        <div className="closed-right-wrapper">
          <div className="closed-name">{recData.name}</div>
          <div className="closed-msg">
            {data.history[data.history.length - 1].contents}
          </div>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}

function OpenConvo({ id, data, recData, recImg, setCurrent }) {
  const [msg, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const usr = useContext(UserContext);

  useEffect(() => {
    const tMsgs = [];
    console.log(data.history);
    data.history.forEach((item, i) => {
      console.log(item);
      tMsgs.push(<ChatMessage author={item.author} content={item.contents} />);
    });
    setChat(tMsgs);
  }, []);

  if (Object.keys(data).length > 1) {
    return (
      <div className="open-wrapper">
        <div className="open-top">
          <button
            className="open-back-button"
            onClick={() => {
              setCurrent("");
            }}
          >
            BACK
          </button>
          <div className="open-name">{recData.name}</div>

          <img src={recImg} alt="Pic" className="open-img" />
        </div>
        <div className="open-body">{chat}</div>
        <div className="open-bottom">
          <input
            placeholder="Type Here..."
            className="open-input"
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <button
            className="open-send-button"
            onClick={() => {
              console.log("Sending Message");
              const newMsg = {};
              newMsg.author = usr.user.uid;
              newMsg.contents = msg;
              SEND_MESSAGE(id, data, newMsg);
              setMessage("");
            }}
          >
            SEND
          </button>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}

function ChatMessage({ author, content }) {
  const usr = useContext(UserContext);
  if (usr.user.uid === author) {
    return (
      <div className="chat-container-sender">
        <div className="chat-sent">{content}</div>
      </div>
    );
  } else {
    return (
      <div className="chat-container-receiver">
        <div className="chat-receiver">{content}</div>
      </div>
    );
  }
}

export default Conversations;
