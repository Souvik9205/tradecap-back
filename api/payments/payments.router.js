const router = require("express").Router();
const {
  getProjects,
  getUserDetails,
  getPayments,
  Createprojectrequirements,
  Updatepayment,
} = require("./payments.controller");
router.post("/", getPayments);
const { checkToken } = require("../../auth/token_validation");

//router.post("/", checkToken, getProjects);

router.post("/createpayment", checkToken, Createprojectrequirements);
router.post("/updatepayment", checkToken, Updatepayment);

router.post("/:id", checkToken, getUserDetails);

module.exports = router;
