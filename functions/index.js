const functions = require("firebase-functions");
const express = require("express");
const { db } = require("./util/admin");
const app = express();
const firebase = require("firebase");
const config = {
  apiKey: "AIzaSyAnZC-ur8kgNBOaYXrSkCzPb8VuwRaxgCQ",
  authDomain: "paperboy-c6073.firebaseapp.com",
  databaseURL: "https://paperboy-c6073.firebaseio.com",
  projectId: "paperboy-c6073",
  storageBucket: "paperboy-c6073.appspot.com",
  messagingSenderId: "315233650804",
  appId: "1:315233650804:web:854c956f95352daf9d2921"
};
firebase.initializeApp(config);

//Get all acounts
app.get("/accounts", (req, res) => {
  admin
    .firestore()
    .collection("accounts")
    .orderBy("name")
    .get()
    .then(data => {
      let accounts = [];
      data.forEach(doc => {
        accounts.push({
          accountId: doc.id,
          name: doc.data().name,
          location: doc.data().location
        });
      });
      return res.json(accounts);
    })
    .catch(err => console.error(err));
});

//Create new Account
app.post("/account", (req, res) => {
  const newLocation = {
    name: req.body.name,
    location: req.body.location
  };
  admin
    .firestore()
    .collection("accounts")
    .add(newLocation)
    .then(doc => {
      res.json({ message: `Document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
});

//checks for empty space
const isEmpty = string => {
  if (string.trim() === "") return true;
  else return false;
};
//checks for valid email
const isEmail = email => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

//Signup Route
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username
  };

  //uses helper functions to check if email/password/confirmPassword is valid on user signup
  let errors = {};
  if (isEmpty(newUser.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(newUser.email)) {
    errors.email = "Must be a valid email address";
  }

  if (isEmpty(newUser.password)) errors.password = "Must not be empty";
  if (newUser.password !== newUser.confirmPassword)
    errors.confirmPassword = "Password must match";
  if (isEmpty(newUser.username)) errors.username = "Must not be empty";

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  let token;
  let userId;
  //checks if username already exists
  db.doc(`/users/${newUser.username}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ username: "This username is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      //returns access token
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        username: newUser.username,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId: userId
      };
      return db.doc(`/users/${newUser.username}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);
      //checks if the emails is alread is use based on an error code from firebase
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ error: "Email is already in use" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

//Login Route
app.post("/login", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  let errors = {};
  if (isEmpty(user.email)) errors.email = "Must not be empty";
  if (isEmpty(user.password)) errors.password = "Must not be empty";
  if (Object.keys(errors).length > 0) return res.status(400).json(errors);
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        return res
          .status(403)
          .json({ general: "Wrong credentials, please try again" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

//must tell firebase that express is the container for our routes
exports.api = functions.https.onRequest(app);
