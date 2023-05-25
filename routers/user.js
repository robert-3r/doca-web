const express = require("express");
const UserController = require("../controllers/user");
const md_auth = require("../midelwers/authenticate");
const multiparty = require("connect-multiparty");

const md_upload = multiparty({ uploadDir: "./uploads/avatar" });

const api = express.Router();

api.get("/user/me", [md_auth.asureAuth], UserController.getMe);
api.patch(
  "/user/:id",
  [md_auth.asureAuth, md_upload],
  UserController.updateUser
);
api.delete("/user/:id", [md_auth.asureAuth], UserController.deleteUser);

module.exports = api;
