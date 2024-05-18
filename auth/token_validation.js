const jwt = require("jsonwebtoken");

module.exports = {
  checkToken: (req, res, next) => {
    let token = req.headers.authorization;

    //Iam jatinder

    // Check if the token exists and has double quotation marks
    if (token && token.startsWith('"') && token.endsWith('"')) {
      // Remove double quotation marks
      token = token.slice(1, -1);
    }

    if (token) {
      // Verify the token
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.json({
            success: 0,
            message: "Invalid Token...",
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.json({
        success: 0,
        message: "Access Denied! Unauthorized User",
      });
    }
  },

  checkToken2: (req, res, next) => {
    let token = req.get("authorization");
    let tokenstored = "bFpW1Lnonkd9fmoCMXDOWMpEIanPe7Jz";

    if (token) {
      if (token == tokenstored) {
        next();
      }
    } else {
      return res.json({
        success: 0,
        message: "Access Denied! Unauthorized User",
      });
    }
  },
};
