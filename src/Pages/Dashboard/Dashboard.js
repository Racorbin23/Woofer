import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Conversations from "../Conversations/Conversations";
import Matching from "../Matching/Matching";
import Settings from "../Settings/Settings";

import ConversationsIcon from "../../images/conversations_icon.png";
import MatchingIcon from "../../images/matching_icon.png";
import SettingsIcon from "../../images/settings_icon.png";

import "./Dashboard.css";
import { SYNC_PROFILE } from "../../api/api";
import SetupProfile from "../SetupProfile/SetupProfile";
import UserContext from "../../Contexts/UserContext";

function Dashboard() {
  const user = useContext(UserContext);

  console.log(Object.keys(user.profileData).length < 2);
  if (Object.keys(user.profileData).length < 2) {
    console.log("Getting profile!");
    SYNC_PROFILE(user.user.uid, user.setProfileData);
  }

  if (user.profileData == null || user.profileData.name === "None") {
    return <SetupProfile />;
  } else {
    return (
      <Router>
        <div className="app">
          <div className="nav-top-wrapper">WOOFER</div>

          <div className="dashboard-content">
            <Routes>
              <Route path="/" element={<Matching />} />
              <Route path="/convo" element={<Conversations />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>

          <div className="nav-bottom-wrapper">
            <div className="nav-bottom-item">
              <Link to="/convo">
                <img
                  className="nav-icon"
                  src={ConversationsIcon}
                  alt="Img"
                  width="50"
                />
              </Link>
            </div>
            <div className="nav-bottom-item">
              <Link to="/">
                <img
                  className="nav-icon"
                  src={MatchingIcon}
                  alt="Img"
                  width="50"
                />
              </Link>
            </div>
            <div className="nav-bottom-item">
              <Link to="/settings">
                <img
                  className="nav-icon"
                  src={SettingsIcon}
                  alt="Img"
                  width="50"
                />
              </Link>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default Dashboard;
