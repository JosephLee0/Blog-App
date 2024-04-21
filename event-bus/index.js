const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

let events = [];

app.post("/events", (req, res) => {
  const event = req.body;
  events.push(event);
  //post
  axios.post("http://posts-clusterip-srv:5000/events", event).catch((err) => {
    console.log(err.message);
  });

  // comment;
  axios
    .post("http://comments-clusterip-srv:6001/events", event)
    .catch((err) => {
      console.log(err.message);
    });

  //query
  axios.post("http://query-clusterip-srv:4002/events", event).catch((err) => {
    console.log(err.message);
  });

  //moderator
  axios
    .post("http://moderation-clusterip-srv:4003/events", event)
    .catch((err) => {
      console.log(err.message);
    });

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("Listening on 4005");
});
