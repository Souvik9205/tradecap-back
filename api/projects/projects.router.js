const router = require("express").Router();
const {
  getProjects,
  getUserDetails,
  getProjectrequirements,
  Createprojectrequirements,
} = require("./projects.controller");

const { checkToken } = require("../../auth/token_validation");

router.post("/", checkToken, getProjects);
router.post("/getprojectrequirements", checkToken, getProjectrequirements);
router.post("/createprojectrequirement", checkToken, Createprojectrequirements);

router.post("/:id", checkToken, getUserDetails);

module.exports = router;
