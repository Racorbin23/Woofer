import React, { useState, useEffect, useContext } from "react";
import {
  DOWNLOAD_PROFILE_PICTURE,
  POP_QUEUE,
  GET_PROFILE,
  UPDATE_QUEUE,
  MATCH_USERS,
  UPDATE_PROFILE,
} from "../../api/api";
import UserContext from "../../Contexts/UserContext";
import "./Matching.css";

function Matching() {
  const usr = useContext(UserContext);
  const [match, setMatch] = useState({});
  const [matchKey, setMatchKey] = useState("");
  const [matchImage, setMatchImage] = useState("");

  useEffect(() => {
    if (Object.keys(usr.profileData).length > 1) {
      console.log("Profile Exists!");
      console.log(matchKey);
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
        GET_PROFILE(matchKey, setMatch);
      } else if (Object.keys(match).length !== 0 && matchImage === "") {
        // #4
        console.log("Match profile picture missing! Downloading!");
        DOWNLOAD_PROFILE_PICTURE(matchKey, setMatchImage);
      } else {
        console.log("Nothing!");
      }
    } else {
      console.log("Profile Data empty!");
    }
  }, [usr.profileData, match, matchKey, matchImage]);

  if (Object.keys(match).length !== 0) {
    return (
      <div className="matching-wrapper">
        <div>
          <img src={matchImage} alt="UnknownMatch" />
          <div>{match.name}</div>
          <div>{match.pet}</div>
        </div>
        <div>
          <button
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
          >
            ACCEPT
          </button>
          <button
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
          >
            REJECT
          </button>
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
