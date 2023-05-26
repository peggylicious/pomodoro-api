const express = require("express");
const mongoose = require("mongoose");
// const task = require("../models/task");
// const user = require("../models/user");
// const taskNo = require("../module/taskNo")

const router = express.Router({ mergeParams: true });
const isLoggedIn = require("../middleware/isLoggedIn");
// const task = require("../controllers/task");
const task = require("../controllers/task");
const { body, validationResult, check } = require("express-validator");
const isValid = require("../middleware/validator")
router.post(
  "/create",
  isValid.check,
  // check(['client_name', "client_email"]).isLength({min: 1 , max: 50}).withMessage("Wrong").withMessage("Empty value"),
  task.createTask
);

router.get("/all", isLoggedIn, task.getAllTasks);
// router.delete("/delete/:task_id", task.deleteTask);
router.delete("/delete/all", task.deleteTaskByProperty);
router.put("/update/:task_id", task.updateTask);
// router.put("/update/:task_id", task.updateTask);

module.exports = router;
