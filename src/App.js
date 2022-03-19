import React, { useState } from "react";
import Login from "./Pages/Login/Login";

import UserContext from "./Contexts/UserContext";
import Dashboard from "./Pages/Dashboard/Dashboard";

function App() {
  const [user, setUser] = useState({});
  const [profileData, setProfileData] = useState({});

  var content;

  if (user && Object.keys(user).length === 0) {
    content = <Login />;
  } else {
    content = <Dashboard />;
  }

  return (
    <div>
      <UserContext.Provider
        value={{ user, setUser, profileData, setProfileData }}
      >
        {content}
      </UserContext.Provider>
    </div>
  );
}

export default App;
