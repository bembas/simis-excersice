const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
const { number } = require("joi");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("../front-end"));
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
const uri =
  "mongodb+srv://errikos22:errikos2160@firstcluster.inftsar.mongodb.net/billyDatabase?retryWrites=true&w=majority";
async function connect() {
  try {
    await mongoose.connect(uri).then(console.log("Connected on Mongo DB"));
  } catch (error) {
    console.error(error);
  }
}
connect();

const taskSchema = new mongoose.Schema({
  id: Number,
  name: String,
  checked: Boolean,
});
const Task = new mongoose.model("todotask", taskSchema);

app.get("/info", (req, res) => {
  res.status(200).json({ info: "preset text" });
});

app.get("/tasks", async (req, res) => {
  let result;
  try {
    result = await Task.find();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
  res.send(result);
});

app.get("/tasks/:id", async (req, res) => {
  let result;
  let tasks;
  try {
    tasks = await Task.find();
    if (tasks.find((c) => c.id == req.params.id)) {
      result = await Task.find({ id: req.params.id });
      res.status(200).send(result);
    } else {
      res.status(404).send("Task Not Found");
    }
  } catch (error) {
    console.log(error);
  }
});
app.post("/tasks", async (req, res) => {
  let newTask;
  let tasks = await Task.find();
  let taskId;
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).lowercase().alphanum(),
  });
  const { value, error } = schema.validate(req.body, { convert: false });
  //convert:false in order to prevent default converting input value to lowercase
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  if (!error) {
    if (tasks.length == 0) {
      taskId = 0;
    } else {
      taskId = tasks[tasks.length - 1].id;
    }

    try {
      newTask = new Task({
        id: taskId + 1,
        name: req.body.name,
        checked: false,
      });
      await newTask.save();
    } catch (error) {
      console.log(error);
    }
    res.status(200).send(newTask);
  }
});

app.put("/tasks/:id", async (req, res) => {
  let tasks = await Task.find();
  let task = tasks.find((c) => c.id == req.params.id);

  try {
    if (task) {
      await task.set({
        checked: req.body.checked,
      });
      await task.save();
      res.status(200).send(task);
    } else {
      res.status(404).send("Task Not Found");
    }
  } catch (error) {
    console.log(error);
  }
});

app.delete("/tasks/:id", async (req, res) => {
  let tasks = await Task.find();
  let task = tasks.find((c) => c.id == req.params.id);
  try {
    if (task) {
      await Task.deleteOne({ id: req.params.id });
      res.status(200).send(task);
    } else {
      res.status(404).send("Task Not Found");
    }
  } catch (error) {
    console.log(error);
  }
});
