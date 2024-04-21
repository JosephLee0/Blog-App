const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const handleEvents = async (type, data) => {
  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";

    // send to event-bus
    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content,
      },
    });
  }
};

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvents(type, data);
  res.send({});
});

app.listen(4003, async () => {
  console.log("Listening on 4003");
  const res = await axios.get("http://event-bus-srv:4005/events");

  for (let event of res.data) {
    handleEvents(event.type, event.data);
  }
});
