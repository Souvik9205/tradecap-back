const router = require("express").Router();
const pool = require("../../config/database");
const { upload, uploadpdf } = require("./file.controller");
const moment = require("moment");
const singleUpload = upload.single("image");
const singleUploadpdf = uploadpdf.single("pdf");
const { checkToken } = require("../../auth/token_validation");
//jatinder

const Pusher = require("pusher");
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: process.env.PUSHER_USETLS, // Enable TLS encryption
});
router.post("/upload", checkToken, function (req, res) {
  const user = req.decoded.result;
  let progress = 0;
  singleUpload(req, res, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("res", req.file.location);
      let current_time = moment().format("YYYY-MM-DD HH:mm:ss");
      pool.query(
        `insert into messages(file_url,type,project_id,from_user_id,date_n_time) values(?,?,?,?,?)`,
        [req.file.location, "file", "2", user.id, current_time],
        (error, results, fields) => {
          if (error) {
            console.log(error.sql);
          }

          const channel = "messages";
          const event = "update_message";
          const data = { message: req.file.location };

          pusher.trigger(channel, event, data);
          return res.status(200).json({
            success: 1,
            data: {
              files: {
                location: req.file.location,
              },
            },
          });
          //console.log("result", results[0]);
        }
      );
    }
  });
});

router.post("/uploadpdf", function (req, res) {
  console.log(req);
  singleUploadpdf(req, res, function (err) {
    if (err) {
      console.log(err);
    } else {
      return res.status(200).json({
        success: 1,
        data: {
          files: {
            location: req.file.location,
          },
        },
      });
    }
  });
});

module.exports = router;
