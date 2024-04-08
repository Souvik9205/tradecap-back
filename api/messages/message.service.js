const pool = require("../../config/database");
var randtoken = require("rand-token");
const express = require("express");
const { hash } = require("bcrypt");
const moment = require("moment");
const {
  emailSend,
  emailSendto,
  emailSendtospecific,
} = require("../email/email.controller");
const app = express();
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: process.env.PUSHER_USETLS, // Enable TLS encryption
});

module.exports = {
  getUserByUserEmail: (data, callBack) => {
    pool.query(
      `select * from users where email = ?`,
      [data.email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }

        return callBack(null, results[0]);
      }
    );
  },
  getMessages: (req, callBack) => {
    let user = req.decoded.result;
    let data = req.body;
    pool.query(
      `select m.id,m.message,u.firstName,u.level,m.date_n_time,u.id user_id,m.from_user_id from_user_id from messages as m INNER JOIN users as u ON m.from_user_id=u.id where m.project_id=? order by m.id `,
      [data.project_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }

        return callBack(null, results);
      }
    );
  },
  insertmessage: (req, callBack) => {
    let data = req.body;

    const user = req.decoded.result;
    let current_time = moment().format("YYYY-MM-DD HH:mm:ss");
    console.log("this is insert message", "passed data", data);

    pool.query(
      `insert into messages(message,project_id,from_user_id,date_n_time) values(?,?,?,?)`,
      [data.message, data.room, user.id, current_time],
      (error, results, fields) => {
        if (error) {
          console.log(error.sql);
          callBack(error);
        }
        console.log("results", results, "passed data", data);
        pusher.trigger(
          "mypm",
          "insertmessage",
          {
            room_id: data.room,
            user_id: user.id,
            data: data,
          },
          (error2, request2, response2) => {
            if (error2) {
              console.log("Error triggering Pusher event:", error2);
              response2.sendStatus(500);
            } else {
              console.log("Pusher event triggered successfully");
              //response2.sendStatus(200);
              return callBack(null, results);
            }
          }
        );
      }
    );
  },
};
