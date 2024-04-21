const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { randomBytes } = require("crypto");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = { id, title };

  //send to event-bus
  await axios
    .post("http://event-bus-srv:4005/events", {
      type: "PostCreated",
      data: {
        id,
        title,
      },
    })
    .catch((err) => {
      console.log(err.message);
    });
  res.status(201).send(posts[id]);
});

app.post("/events", async (req, res) => {
  console.log("Received Event", req.body.type);

  res.send({});
});

app.listen(5000, () => {
  console.log("server ip 55");
  console.log("Listening on 5000");
});
