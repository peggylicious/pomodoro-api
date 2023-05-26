const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const task = require("../models/task")
const user = require("../models/user");
const taskNo = require("../module/taskNo")

const { body, validationResult } = require("express-validator");


// const express = require('express');
const momentTimeZone = require('moment-timezone');
const moment = require('moment');
// const Appointment = require('../models/appointment');
// const router = new express.Router();


const getTimeZones = function() {
  return momentTimeZone.tz.names();
};
// console.log(getTimeZones())

module.exports.createtask = (req, res, next) => {
  // task.find(task_id: req.body.task_id)
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const notification = req.body.notification;
    const timeZone = req.body.timeZone;
    const time = moment(req.body.time, 'MM-DD-YYYY hh:mma');

    const newtask = new task({
        id: new mongoose.Types.ObjectId(),
        name: name,
        phoneNumber: phoneNumber,
        notification: notification,
        timeZone: timeZone,
        time: time,
        created_by: req.body.created_by,
        recepient: req.body.recepient
    });

    const errors = validationResult(req);
    console.log("Hi", )
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).json(errors.array());
    }
    user.findOne({ email: req.body.email }).then((result) => {
        console.log(result)
        newtask
        .save()
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

module.exports.getAlltasks = (req, res, next) => {
  task
    .find({ created_by: mongoose.Types.ObjectId(req.userId) }) //UserId is gotten from middleware
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
module.exports.deletetask = (req, res, next) => {
  task
    .deleteOne({ _id: req.params.task_id })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
module.exports.deletetaskByProperty = (req, res, next) => {
  task
    .deleteMany({ timeZone:'' })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
module.exports.updatetask = (req, res, next) => {
  task
    .find({ task_id: req.params.task_id })
    .then((result) => {
      let modifiedItems = req.body;
      let taskItemKeys = Object.keys(result[0].toObject());
      taskItemKeys.filter((element, index) => {
        // Looks for items to be modified
        if (modifiedItems.hasOwnProperty(element)) {
          // If property exists both in request.body and document
          result[0][element] = modifiedItems[element];
        }
      });
      return result[0].save();
    })
    .then((x) => {
      res.status(200).json(x);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
