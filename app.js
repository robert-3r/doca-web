const express = require("express");
const { API_VERSION } = require("./constansts");
const cors = require("cors");

const app = express();

const authRoutes = require("./routers/auth");
const userRoutes = require("./routers/user");
const todoRoutes = require("./routers/todo");

const apiPrefix = `/api/${API_VERSION}`;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(express.static("uploads"));

// Definir API_VERSION

// routers import

app.use(apiPrefix, authRoutes);
app.use(apiPrefix, userRoutes);
app.use(apiPrefix, todoRoutes);

module.exports = app;
