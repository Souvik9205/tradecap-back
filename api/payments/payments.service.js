const pool = require("../../config/database");
var randtoken = require("rand-token");
const express = require("express");
const { hash } = require("bcrypt");

const app = express();

module.exports = {
  getuserdetails: (id, callBack) => {
    pool.query(
      `select firstName,email,lastName,address,mobile,level from users where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },

  getProjects: (req, callBack) => {
    let data = req.body;

    const user = req.decoded.result;

    pool.query(
      `select * from projects where id in (select project_id from users_to_projects where user_id=? ) order by id desc`,
      [user.id],
      (error, results, fields) => {
        if (error) {
          console.log(error.sql);
          callBack(error);
        }

        return callBack(null, results);
      }
    );
  },
  getpayments: (req, callBack) => {
    let data = req.body;

    //console.log("payment request", data);

    //const user = req.decoded.result;

    pool.query(
      `select * from payments  order by id desc`,
      [],
      (error, results, fields) => {
        if (error) {
          console.log(error.sql);
          callBack(error);
        }

        return callBack(null, results);
      }
    );
  },
  createprojectrequirement: (req, callBack) => {
    let data = req.body;

    const user = req.decoded.result;

    pool.query(
      `insert into project_requirements(title,project_id)`,
      [data.title, data.project_id],
      (error, results, fields) => {
        if (error) {
          console.log(error.sql);
          callBack(error);
        }

        return callBack(null, results);
      }
    );
  },
  updatepayment: (req, callBack) => {
    let data = req.body;
    console.log("updating payment", data);
    const user = req.decoded.result;

    pool.query(
      `update payments set status="DONE" where id=?`,
      [data.id],
      (error, results, fields) => {
        if (error) {
          console.log(error.sql);
          callBack(error);
        }

        return callBack(null, results);
      }
    );
  },
  getnotifications: (data, callBack) => {
    body = data.body;

    console.log(body);

    if (body.store_name == "" || body.store_name == undefined) {
      query = `select * from notifications where readstatus=0   order by id desc LIMIT 10`;
    } else {
      query = `select * from notifications where  readstatus='0' and store_name=?    order by id desc LIMIT 10`;
    }
    console.log("query", query);

    pool.query(query, [body.store_name], (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    });
  },
};
