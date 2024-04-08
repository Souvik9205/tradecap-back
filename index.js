require("dotenv").config();
const express = require("express");
var app = require("express")();
const moment = require("moment");
const pool = require("./config/database");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
//jatinder
const fs = require("fs");
const http = require("http");
const userRouter = require("./api/users/user.router");
const messagesRouter = require("./api/messages/message.router");
const projectsRouter = require("./api/projects/projects.router");

const fileRouter = require("./api/file/file.router");

const clusters = require("cluster");

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
); // include before other routes

//app.use(express.static(path.join(__dirname, "./client/out")))
app.use("/api/messages", messagesRouter);
app.use("/api/users", userRouter);
app.use("/api/projects", projectsRouter);

app.use("/api/files", fileRouter);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to PM API");
});

// 404 route.
app.use("*", (_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// error handler
const errorHandler = require("./api/error/handleError");
app.use(errorHandler);
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("server up and running on PORT :", port);
});

clusters.on("death", function (worker) {
  app.listen(3000);
});
