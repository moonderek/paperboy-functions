const functions = require("firebase-functions");
const admin = require("firebase-admin");

const { db } = require("./util/admin");

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello world");
});

exports.getLocations = functions.https.onRequest((req, res) => {
  admin
    .firestore()
    .collection("accounts")
    .get()
    .then(data => {
      let accounts = [];
      data.forEach(doc => {
        accounts.push(doc.data());
      });
      return res.json(accounts);
    })
    .catch(err => console.error(err));
});
