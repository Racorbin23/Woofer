// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  onValue,
  update,
  get,
  push,
} from "firebase/database";
import {
  getStorage,
  uploadBytes,
  ref as sRef,
  getDownloadURL,
} from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const NEW_USER_DATA = {
  name: "None",
  bio: "None",
  pet_type: "None",
  pet_age: 1,
  location: "None",
  range: 100,
  interactions: {
    accepted: "",
    rejected: "",
    declined: "",
    queue: "",
  },
  conversations: [""],
};

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCy2a2QOF4Bn8T0GG-ZAB2SuSmuGV7r5cM",
  authDomain: "woofer-8dd92.firebaseapp.com",
  projectId: "woofer-8dd92",
  storageBucket: "woofer-8dd92.appspot.com",
  messagingSenderId: "1020210800286",
  appId: "1:1020210800286:web:878b357b29ed10c4863d8f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase();
const storage = getStorage();

function CREATE_NEW_USER(user, email, password, setError) {
  console.log("Creating New User");
  console.log("Email ", email);
  console.log("Password ", password);
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      user.setUser(userCredential.user);
      UPDATE_PROFILE(userCredential.user.uid, NEW_USER_DATA);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === "auth/email-already-in-use") {
        setError("Email already in use! - Please try signing in.");
      } else if (errorCode === "auth/weak-password") {
        setError("Weak password!");
      } else {
        setError("");
      }
      console.log("EROR ", errorCode);
      console.log("MSG ", errorMessage);
    });
}

function SIGN_IN(setUser, email, password, setError) {
  console.log("Signing In!");
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      setUser(userCredential.user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === "auth/user-not-found") {
        setError("No user found with that email. Please sign up first!");
      } else if (errorCode === "auth/wrong-password") {
        setError("Incorrect Password!");
      } else {
        setError("");
      }
      console.log("EROR ", errorCode);
      console.log("MSG ", errorMessage);
    });
}

function SIGN_OUT(setUser) {
  console.log("Signing Out!");
  signOut(auth)
    .then(() => {
      console.log("Signed Out");
      setUser({});
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("EROR ", errorCode);
      console.log("MSG ", errorMessage);
    });
}
function GET_PROFILE(userKey, setData) {
  const path = "profiles/" + userKey;
  const starCountRef = ref(db, path);
  console.log("Fetching Data! ", path);
  // Get data once and get the single profile witht that key
  get(starCountRef).then((sc) => {
    if (sc.exists()) {
      setData(sc.val());
    } else {
      console.log("Data doesnt exists");
    }
  });
}

function SYNC_PROFILE(userKey, setData) {
  const path = "profiles/" + userKey;
  onValue(ref(db, path), (snapshot) => {
    setData(snapshot.val());
  });
}

function UPDATE_PROFILE(userKey, newData) {
  update(ref(db, "profiles/" + userKey), newData);
}

function UPLOAD_PROFILE_PICTURE(userKey, file) {
  const profilePicture = sRef(storage, userKey);
  uploadBytes(profilePicture, file).then((snapshot) => {
    console.log("Uploaded File!");
  });
}

function DOWNLOAD_PROFILE_PICTURE(userKey, setImage) {
  const profilePicture = sRef(storage, userKey);
  getDownloadURL(profilePicture)
    .then((url) => {
      setImage(url);
    })
    .catch((error) => {
      // Handle any errors
      console.log(error);
    });
}

function UPDATE_QUEUE(userKey, userData) {
  const newData = userData;
  get(ref(db, "profiles")).then((sc) => {
    if (sc.exists()) {
      const profileKeys = Object.keys(sc.val());
      console.log(profileKeys);
      profileKeys.forEach((profileKey, i) => {
        if (
          profileKey !== userKey &&
          userData.interactions.accepted.split(",").includes(profileKey) ===
            false &&
          userData.interactions.rejected.split(",").includes(profileKey) ===
            false &&
          userData.interactions.declined.split(",").includes(profileKey) ===
            false &&
          profileKey !== "test"
        ) {
          console.log(profileKey);
          const val = profileKey + ",";
          newData.interactions.queue += val;
        }
      });

      UPDATE_PROFILE(userKey, newData);
    } else {
      console.log("No profiles exists!?!");
    }
  });
}

function POP_QUEUE(userKey, userData, setMatchKey) {
  const newData = userData;
  const matchKey = userData.interactions.queue.split(",")[0];
  setMatchKey(matchKey);

  var newQueue = "";
  newData.interactions.queue.split(",").forEach((key, i) => {
    const val = key + ",";
    if (i !== 0 && key !== "") newQueue += val;
  });
  newData.interactions.queue = newQueue;
  UPDATE_PROFILE(userKey, newData);
}

function MATCH_USERS(userKey, userData, matchKey, matchData) {
  const newConvo = getNewConvo(userKey, matchKey);

  const convRef = ref(db, "conversations");
  const newRef = push(convRef, newConvo);

  const convoKey = newRef.key;
  // Add convo key to both profile data then update both
  const newUserData = userData;
  const newMatchData = matchData;
  newUserData.conversations = [...newUserData.conversations, convoKey];
  newMatchData.conversations = [...newMatchData.conversations, convoKey];

  const profiles = {};
  profiles[userKey] = newUserData;
  profiles[matchKey] = newMatchData;

  console.log("MATCHING USERS!");
  update(ref(db, "profiles"), profiles);
}

function getNewConvo(userKey, matchKey) {
  return {
    history: {
      0: {
        contents: "You have matched!",
        author: "System",
        time: new Date(),
      },
    },
    authors: {
      0: userKey,
      1: matchKey,
    },
  };
}

function SYNC_CONVERSATION(id, setConvoData) {
  const path = "conversations/" + id;
  onValue(ref(db, path), (sc) => {
    console.log("Setting ", id);
    setConvoData(sc.val());
  });
}

function SEND_MESSAGE(convoKey, convoData, messageData) {}

export {
  CREATE_NEW_USER,
  SIGN_IN,
  SIGN_OUT,
  GET_PROFILE,
  UPDATE_PROFILE,
  UPLOAD_PROFILE_PICTURE,
  DOWNLOAD_PROFILE_PICTURE,
  UPDATE_QUEUE,
  POP_QUEUE,
  MATCH_USERS,
  SYNC_PROFILE,
  SYNC_CONVERSATION,
  SEND_MESSAGE,
};
