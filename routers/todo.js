const { Router } = require("express");
const MenuController = require("../controllers/Todo");
const md_auth = require("../midelwers/authenticate");

const api = Router();

api.post("/todo", [md_auth.asureAuth], MenuController.createTodo);
api.get("/todo", [md_auth.asureAuth], MenuController.getTodos);
api.patch("/todo/:id", [md_auth.asureAuth], MenuController.updateTodo);
api.delete("/todo/:id", [md_auth.asureAuth], MenuController.deleteTodo);
api.delete("/todoAll", [md_auth.asureAuth], MenuController.deleteAllUserTodos);
module.exports = api;
