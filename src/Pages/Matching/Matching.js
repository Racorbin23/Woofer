import React, { useState, useEffect, useContext } from "react";
import {
  DOWNLOAD_PROFILE_PICTURE,
  POP_QUEUE,
  SYNC_PROFILE,
  UPDATE_QUEUE,
  MATCH_USERS,
  UPDATE_PROFILE,
} from "../../api/api";
import UserContext from "../../Contexts/UserContext";
import "./Matching.css";
import AcceptIcon from "../../images/accept-symbol.png";
import RejectIcon from "../../images/reject-symbol.png";

function Matching() {
  const usr = useContext(UserContext);
  const [match, setMatch] = useState({});
  const [matchKey, setMatchKey] = useState("");
  const [matchImage, setMatchImage] = useState("");

  useEffect(() => {
    if (Object.keys(usr.profileData).length > 1) {
      console.log("Profile Exists!");
      if (
        matchKey === "" &&
        Object.keys(match).length < 1 &&
        usr.profileData.interactions.queue === ""
      ) {
        // #1
        // QUEUE is empty and needs to be checked
        console.log("User's queue is empty! Updating queue!");
        UPDATE_QUEUE(usr.user.uid, usr.profileData);
      } else if (
        Object.keys(match).length < 1 &&
        usr.profileData.interactions.queue.split(",").length > 1
      ) {
        // #2
        // Have an item in queue but item not set
        console.log("User's match is empty but queue isnt!");
        POP_QUEUE(usr.user.uid, usr.profileData, setMatchKey);
        // Get USERKEY of match and download their profile to match
      } else if (matchKey !== "" && Object.keys(match).length < 1) {
        // #3
        console.log("Found Match Key! - Downloading profile data");
        SYNC_PROFILE(matchKey, setMatch);
        DOWNLOAD_PROFILE_PICTURE(matchKey, setMatchImage);
      } else if (Object.keys(match).length !== 0 && matchImage === "") {
        // #4
        console.log("Match profile picture missing! Downloading!");
      } else {
        console.log("Nothing!");
      }
    } else {
      console.log("Profile Data empty!");
    }
  }, [usr.profileData, matchKey]);

  if (Object.keys(match).length !== 0) {
    return (
      <div className="matching-wrapper">
        <div>
          <div className="matching-pic-wrapper">
            <img src={matchImage} alt="Loading..." className="matching-pic" />
          </div>
          <div className="matching-name">{match.name}</div>
          <div className="matching-pet">{match.pet}</div>
        </div>
        <div className="matching-bottom">
          <img
            src={AcceptIcon}
            alt="Loading..."
            className="matching-accept-button"
            onClick={() => {
              console.log("Accepting current match!");
              // Check if other user already accepted us
              // If ACCEPTED ALREADY
              // Create conversation & append to conversations
              // Append to user accepted
              const val = matchKey + ",";
              const newUserData = usr.profileData;
              newUserData.interactions.accepted += val;

              if (
                match.interactions.accepted.split(",").includes(usr.user.uid)
              ) {
                console.log("USER ACCEPTED! - CREATING CONVERSATION!");
                MATCH_USERS(usr.user.uid, newUserData, matchKey, match);
              } else {
                UPDATE_PROFILE(usr.user.uid, newUserData);
              }

              setMatch({});
              setMatchKey("");
              setMatchImage("");
            }}
          />
          <img
            src={RejectIcon}
            alt="Loading..."
            className="matching-reject-button"
            onClick={() => {
              console.log("Rejecting current match!");
              // Append match key to user rejected field
              const val = matchKey + ",";
              const newUserData = usr.profileData;
              newUserData.interactions.rejected += val;
              UPDATE_PROFILE(usr.user.uid, newUserData);

              setMatch({});
              setMatchKey("");
              setMatchImage("");
            }}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div>No Matches!</div>
      </div>
    );
  }
}

export default Matching;
