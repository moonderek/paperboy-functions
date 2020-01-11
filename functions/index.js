const functions = require("firebase-functions");
const express = require("express");
const app = express();
const FBAuth = require("./util/fbAuth");

//Import Handlers
const { getAllAccounts } = require("./Handlers/accounts");
const { postOneAccount } = require("./Handlers/accounts");
const { signup, login, uploadImage } = require("./handlers/users");

//ACCOUNT ROUTES
//Get All Accounts Route
app.get("/accounts", getAllAccounts);
//Create Account Route
app.post("/account", FBAuth, postOneAccount);

//USERS ROUTES
//Signup Route
app.post("/signup", signup);
//Login Route
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);

//must tell firebase that express is the container for our routes
exports.api = functions.https.onRequest(app);
