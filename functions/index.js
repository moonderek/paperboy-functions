const functions = require("firebase-functions");
const express = require("express");
const app = express();
const admin = require("firebase-admin");
const FBAuth = require("./util/fbAuth");

//Import Handlers
const { getAllAccounts } = require("./Handlers/accounts");
const { postOneAccount } = require("./Handlers/accounts");
const { signup, login } = require("./handlers/users");

//Get All Accounts Route
app.get("/accounts", getAllAccounts);

//Create Account Route
app.post("/account", FBAuth, postOneAccount);

//Signup Route
app.post("/signup", signup);

//Login Route
app.post("/login", login);

//must tell firebase that express is the container for our routes
exports.api = functions.https.onRequest(app);
