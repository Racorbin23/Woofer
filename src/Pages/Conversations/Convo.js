import React, { useEffect, useState, useContext } from "react";

import {
  DOWNLOAD_PROFILE_PICTURE,
  GET_PROFILE,
  SYNC_CONVERSATION,
} from "../../api/api";
import UserContext from "../../Contexts/UserContext";
import "./Conversations.css";
import OpenConversation from "./OpenConversation";

function Convo(props) {
  const usr = useContext(UserContext);

  const [convoData, setConvoData] = useState({});
  const [recipientProfile, setRecipientProfile] = useState({});
  const [convoRecipientKey, setConvoRecipientKey] = useState("");
  const [convoRecipientImage, setConvoRecipientImage] = useState("");
  const [lastMessage, setLastMessage] = useState({});

  useEffect(() => {
    if (convoRecipientKey === "" && Object.keys(convoData).length < 2) {
      console.log("Syncing profile");
      SYNC_CONVERSATION(
        props.id,
        usr.user.uid,
        setConvoRecipientKey,
        setConvoData
      );
    } else if (
      Object.keys(recipientProfile).length < 2 &&
      convoRecipientKey !== ""
    ) {
      console.log("Getting convo profile");
      GET_PROFILE(convoRecipientKey, setRecipientProfile);
    } else if (convoRecipientImage === "" && convoRecipientKey !== "") {
      console.log("Getting image!");
      DOWNLOAD_PROFILE_PICTURE(convoRecipientKey, setConvoRecipientImage);
    } else if (
      Object.keys(lastMessage) < 2 &&
      convoRecipientImage !== "" &&
      convoRecipientKey !== ""
    ) {
      console.log("Getting last message!");
      const newLastMessage = {};
      newLastMessage.name = convoData.history[0].author;
      newLastMessage.contents = convoData.history[0].contents;
      console.log(newLastMessage);
      setLastMessage(newLastMessage);
    } else {
      console.log("None!");
    }
  }, [convoRecipientImage, recipientProfile, convoData]);

  if (props.open === false) {
    return (
      <div
        className="shortcut-wrapper"
        onClick={() => {
          console.log("Convo Selected! - ", props.id);
          props.setCurrent(props.id);
        }}
      >
        <img
          className="shortcut-img"
          src={convoRecipientImage}
          alt="MatchPic"
        />
        <div className="shortcut-body">
          <div className="shortcut-rec-name">{recipientProfile.name}</div>
          <div className="shortcut-message-wrapper">
            <div className="shortcut-message">{lastMessage.contents}</div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <OpenConversation
        convoKey={props.id}
        setCurrent={props.setCurrent}
        convoData={convoData}
        recipientProfile={recipientProfile}
        recipientImage={convoRecipientImage}
      />
    );
  }
}

export default Convo;
