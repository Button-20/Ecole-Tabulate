const jwt = require("jsonwebtoken");

module.exports.verifyJwtToken = async (req, res, next) => {
  var token;
  if ("authorization" in req.headers)
    token = req.headers["authorization"].split(" ")[1];

  if (!token)
    return await res
      .status(403)
      .send({ auth: false, message: "No token provided." });
  else {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err)
        return await res
          .status(500)
          .send({ auth: false, message: "Token authentication failed." });
      else {
        req._id = await decoded._id;
        next();
      }
    });
  }
};
