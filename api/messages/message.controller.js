const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const pool = require("../../config/database");

const {
  getUserByUserEmail,
  getMessages,
  insertmessage,
} = require("./message.service");

module.exports = {
  Checkemail: (req, res) => {
    const body = req.body;

    getUserByUserEmail(body.email, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results) {
        return res.json({
          success: 1,
          data: "Email exist",
        });
      } else {
        return res.json({
          success: 0,
          data: "Email available",
        });
      }
    });
  },
  getMessages: (req, res) => {
    getMessages(req, (err, results) => {
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
  Insertmessage: (req, res) => {
    insertmessage(req, (err, results) => {
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
