import axios from "axios";
import { error } from "console";
import { randomBytes } from "crypto";
import express from "express";

const app = express();

app.use(express.json());
app.use("/", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  await axios
    .post("http://event-bus-srv:4005/events/", {
      type: "PostCreated",
      data: {
        id,
        title,
      },
    })
    .catch((error) => console.log(error));

  res.status(201).send(posts[id]);
});

app.post("/events", async (req, res) => {
  console.log("Received event", req.body.type);

  res.send({});
});

// app.post("/events", (req, res) => {
//   res.status(201).send(posts[id]);
// });

app.listen(4000, () => {
  console.log("v3");
  console.log("Listening on 4000");
});
