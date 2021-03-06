const functions = require("firebase-functions");
const express = require("express");
const app = express();
const FBAuth = require("./util/fbAuth");

//Import Handlers
const { getAllAccounts } = require("./handlers/accounts");
const { postOneAccount } = require("./handlers/accounts");
const { postOneItem, getAllItems } = require("./handlers/items");
const {
  signup,
  login,
  uploadImage,
  getAuthenticatedUser
} = require("./handlers/users");
const { postOneStop } = require("./handlers/stops");

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
app.get("/user", FBAuth, getAuthenticatedUser);

//ITEM ROUTES
//Create an item for delivery
app.post("/item", FBAuth, postOneItem);
//Get all items that a user created
app.get("/items", FBAuth, getAllItems);

//STOP ROUTES
//Create a stop for delivery
app.post("/stop", FBAuth, postOneStop);

//must tell firebase that express is the container for our routes
exports.api = functions.https.onRequest(app);
