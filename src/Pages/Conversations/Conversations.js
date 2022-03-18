import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../Contexts/UserContext";
import "./Conversations.css";

import Convo from "./Convo";

function Conversations() {
  const usr = useContext(UserContext);
  const [convos, setConvos] = useState([]);
  const [current, setCurrent] = useState("");

  useEffect(() => {
    if (
      Object.keys(usr).length > 2 &&
      Object.keys(usr.profileData).length &&
      Object.keys(usr.profileData.conversations).length > 1
    ) {
      console.log(usr);
      setConvos([]);

      usr.profileData.conversations.forEach((item, i) => {
        console.log(item);
        if (item !== "" && current === "") {
          console.log("1");
          setConvos((convos) => [
            ...convos,
            <Convo id={item} setCurrent={setCurrent} open={false} />,
          ]);
        } else if (item !== "" && current !== "" && current === item) {
          console.log("2");
          setConvos(<Convo id={item} setCurrent={setCurrent} open={true} />);
        }
      });
    }
  }, [usr, current]);

  return <div className="conversations-wrapper">{convos}</div>;
}

export default Conversations;
