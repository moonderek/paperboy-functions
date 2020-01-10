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

//Signup Route
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username
  };
  let token;
  let userId;
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
      //access token
      //   const userId = data.user.uid;
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
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ error: "Email is already in use" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

//must tell firebase that express is the container for our routes
exports.api = functions.https.onRequest(app);
