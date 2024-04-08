const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const pool = require("../../config/database");

const {
  getProjects,
  getuserdetails,

  getProjectrequirements,
  createprojectrequirement,
} = require("./projects.service");

module.exports = {
  getProjects: (req, res) => {
    getProjects(req, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  getProjectrequirements: (req, res) => {
    getProjectrequirements(req, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  Createprojectrequirements: (req, res) => {
    createprojectrequirement(req, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  getUserDetails: (req, res) => {
    const id = req.params.id;
    const user = req.decoded.result;

    getuserdetails(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  getNotifications: (req, res) => {
    getnotifications(req, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
};
