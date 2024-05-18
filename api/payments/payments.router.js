const router = require("express").Router();
const {
  getProjects,
  getUserDetails,
  getPayments,
  Createprojectrequirements,
  Updatepayment,
  Uploadpayment,
} = require("./payments.controller");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
router.post("/", getPayments);
router.post("/uploadpayment", Uploadpayment);
const { checkToken } = require("../../auth/token_validation");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//router.post("/", checkToken, getProjects);

router.post("/createpayment", checkToken, Createprojectrequirements);
router.post("/updatepayment", checkToken, Updatepayment);

router.post("/:id", checkToken, getUserDetails);

module.exports = router;
