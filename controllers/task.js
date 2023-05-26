const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const taskSchema = require("../models/task")
const user = require("../models/user");
// const taskNo = require("../module/taskNo")

const { body, validationResult } = require("express-validator");

module.exports.createTask = (req, res, next) => {
  // task.find(task_id: req.body.task_id)
  const newTask = new taskSchema({
    id: new mongoose.Types.ObjectId(),
    task_id: "", // String is shorthand for {type: String}

    // created_at: req.body.created_at,
    created_by: req.body.created_by,
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    pomodoros: req.body.pomodoros,
    timeLeft: 0,
    isComplete: req.body.isComplete,
    totalCycles: req.body.totalCycles
    // date: req.body.date,
    // time: req.body.time
    // payment_due: req.body.payment_due,
    // description: req.body.description,
    // payment_terms: req.body.payment_terms,
    // client_name: req.body.client_name,
    // client_email: req.body.client_email,
    // status: req.body.status,
    // senderAddress: {
    //   street: req.body.senderAddress.street,
    //   city: req.body.senderAddress.city,
    //   postCode: req.body.senderAddress.post_code,
    //   country: req.body.senderAddress.country,
    // },
    // clientAddress: {
    //   street: req.body.clientAddress.street,
    //   city: req.body.clientAddress.city,
    //   postCode: req.body.clientAddress.post_code,
    //   country: req.body.clientAddress.country,
    // },
    // items: [],
    // total: req.body.total,
  });
  const errors = validationResult(req);
  console.log("Hi", )
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(400).json(errors.array());
  }
  user.findOne({ created_by: req.userId }).then((result) => {
    // let newValue = result.last_task_digit;
    // console.log("last digit ", newValue);
    // if (typeof newValue === "undefined") {
    //   console.log("Undefined value ", newValue);
    //   newValue = 0;
    // }
    // console.log("found user", result);
    // newValue = result.last_task_digit++;
    // newTask.task_id = taskNo(newValue++);
    // newTask.items.push(...req.body.items); //Copy list items from req.body.items into new "items" list in mongoose
    // user.last_task_digit = newValue; //Create task serialized number
    newTask
      .save()
      // .then((result_0) => {
      //   console.log("Saved task");

      //   return user.updateOne(
      //     { user_name: req.body.user_name },
      //     // { last_task_digit: newValue++ }
      //   );
      // })
      .then((x) => {
        console.log(x);
        console.log("Updated user");
        res.status(200).json(x);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });
};

module.exports.getAllTasks = (req, res, next) => {
  console.log(req.userId)

  taskSchema
    .find({ created_by: req.userId }) //UserId is gotten from middleware
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
module.exports.deleteTask = (req, res, next) => {
  taskSchema
    .deleteOne({ task_id: req.params.task_id })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
module.exports.updateTask = (req, res, next) => {
  console.log("Updating " + req.params.task_id)
  taskSchema
    .findOneAndUpdate({ _id: req.params.task_id }, { $set: { timeLeft: req.body.timeLeft, isComplete: req.body.isComplete, pomodoros: req.body.pomodoros, totalCycles: req.body.totalCycles}}, {new: true})

    .then((x) => {
      res.status(200).json(x);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
module.exports.deleteTaskByProperty = (req, res, next) => {
  console.log("req")

  taskSchema
    .deleteMany({ status: 'nil' })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};