const router = require("express").Router();
const {
  Checkemail,
  getMessages,
  Insertmessage,
} = require("./message.controller");

router.post("/checkemail", Checkemail);

const { checkToken } = require("../../auth/token_validation");
router.post("/", checkToken, getMessages);
router.post("/insertmessage", checkToken, Insertmessage);
module.exports = router;
