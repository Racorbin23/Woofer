import React, { useState, useContext } from "react";
import { UPDATE_PROFILE, UPLOAD_PROFILE_PICTURE } from "../../api/api";
import UserContext from "../../Contexts/UserContext";
import "./SetupProfile.css";

function SetupProfile() {
  const usr = useContext(UserContext);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [pet, setPet] = useState("");
  const [bio, setBio] = useState("");

  return (
    <div className="setup-wrapper">
      <div>Please Fill in the Information Below</div>
      <input
        placeholder="NAME"
        className="setup-input"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <input
        placeholder="PET"
        className="setup-input"
        onChange={(e) => {
          setPet(e.target.value);
        }}
      />
      <input
        placeholder="BIO"
        className="setup-input"
        onChange={(e) => {
          setBio(e.target.value);
        }}
      />
      <input
        type="file"
        className="upload-button"
        onChange={(e) => {
          setImage(e.target.files[0]);
        }}
      />
      <button
        className="setup-submit-button"
        onClick={() => {
          if (image !== "" && name !== "" && pet !== "" && bio !== "") {
            const newData = {
              name: name,
              pet: pet,
              bio: bio,
            };
            UPLOAD_PROFILE_PICTURE(usr.user.uid, image);
            UPDATE_PROFILE(usr.user.uid, newData);
          }
        }}
      >
        SUBMIT
      </button>
    </div>
  );
}

export default SetupProfile;
