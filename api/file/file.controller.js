const aws = require("aws-sdk");
const { PBKDF2 } = require("crypto-js");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { v4: uuidv4 } = require("uuid");
const createReadStream = require("fs");

const S3Client = require("aws-sdk/clients/s3");

const s3 = new aws.S3();
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1582114",
  key: "30fb4d41c5c54ee72b20",
  secret: "5a46bd1e87bad5df2d27",
  cluster: "ap2",
  useTLS: true, // Enable TLS encryption
});
s3.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_MYAPP,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_MYAPP,
  region: process.env.AWS_REGION_MYAPP,
});

//console.log(s3.config.credentials)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};
const fileFilterpdf = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: "public-read",
    s3: s3,
    bucket: "mypmbucketl",
    key: function (req, file, cb) {
      var filename = file.originalname;
      var ext = filename.substring(filename.indexOf("."));
      const newId = uuidv4();
      cb(null, Date.now().toString() + newId + ext);
    },
  }),
  shouldTransform: true,
  transforms: [
    {
      id: "progress",
      transform: function (req, file, cb) {
        const fileSize = file.size;
        const uploadStream = s3.upload({
          Bucket: "mypmbucketl",
          Key: file.key,
          Body: file.stream,
          ACL: "public-read",
        });

        uploadStream.on("httpUploadProgress", function (evt) {
          const progress = Math.round((evt.loaded / fileSize) * 100);
          req.uploadProgress = progress; // Store the progress in the request object

          console.log("progress", progress);
          cb(null, file);
        });

        uploadStream.send(function (err, data) {
          if (err) {
            cb(err);
          } else {
            cb(null, data);

            console.log(data);
          }
        });
      },
    },
  ],
});

const uploadpdf = multer({
  fileFilterpdf,
  storage: multerS3({
    acl: "public-read",
    s3,
    bucket: "multiverse-3",
    key: function (req, file, cb) {
      console.log("buffer");
      var filename = file.originalname;
      var ext = filename.substring(filename.indexOf("."));
      const newId = uuidv4();
      cb(null, Date.now().toString() + newId + ext);
    },
  }),
});

module.exports = { upload, uploadpdf };
