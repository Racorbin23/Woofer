import React, { useState, useContext, useEffect } from "react";
import {
  DOWNLOAD_PROFILE_PICTURE,
  SIGN_OUT,
  UPDATE_PROFILE,
} from "../../api/api";
import UserContext from "../../Contexts/UserContext";

import "./Settings.css";

function Settings() {
  const usr = useContext(UserContext);
  const [profilePicture, setProfilePicture] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newPet, setNewPet] = useState("");
  const [newPetAge, setNewPetAge] = useState("");
  const [newPetType, setNewPetType] = useState("");
  console.log("OPening Settings");
  useEffect(() => {
    DOWNLOAD_PROFILE_PICTURE(usr.user.uid, setProfilePicture);
  }, [usr]);

  return (
    <div className="settings-wrapper">
      <div className="settings-content-wrapper">
        <img
          src={profilePicture}
          alt="ProfilePicture"
          className="profile-picture"
        />
        <div className="settings-name-label">
          Hello, {usr.profileData.name}!
        </div>
        <div className="settings-input-label">Bio</div>
        <input
          placeholder={usr.profileData.bio}
          className="settings-input"
          onChange={(e) => {
            setNewBio(e.target.value);
          }}
        />

        <div className="settings-input-label">Pet</div>
        <input
          placeholder={usr.profileData.pet}
          className="settings-input"
          onChange={(e) => {
            setNewPet(e.target.value);
          }}
        />

        <div className="settings-input-label">Pet Age</div>
        <input
          placeholder={usr.profileData.pet_age}
          className="settings-input"
          onChange={(e) => {
            setNewPetAge(e.target.value);
          }}
        />

        <div className="settings-input-label">Pet Type</div>
        <input
          placeholder={usr.profileData.pet_type}
          className="settings-input"
          onChange={(e) => {
            setNewPetType(e.target.value);
          }}
        />

        <button
          className="update-button"
          onClick={() => {
            const newData = usr.profileData;
            if (newBio !== "") {
              newData.bio = newBio;
            }
            if (newPet !== "") {
              newData.pet = newPet;
            }
            if (newPetAge !== "") {
              newData.pet_age = parseInt(newPetAge);
            }
            if (newPetType !== "") {
              newData.pet_type = newPetType;
            }
            console.log("Updating Date to ");
            console.log(newData);
            setNewBio("");
            setNewPet("");
            setNewPetAge("");
            setNewPetType("");
            UPDATE_PROFILE(usr.user.uid, newData);
          }}
        >
          UPDATE
        </button>
        <button
          className="signout-button"
          onClick={() => {
            SIGN_OUT(usr.setUser);
            window.location.reload();
          }}
        >
          SIGN OUT
        </button>
      </div>
    </div>
  );
}

export default Settings;
