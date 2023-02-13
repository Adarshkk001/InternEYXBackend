//
const jwt = require("jsonwebtoken");

const env = require("dotenv").config();
const JWTSecretkey = process.env.JWT_SECRET_KEY;

const fetchUser = (req, res, next) => {
  // Get the user from the jwt token and add id to request object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please Authenticate User" });
  }

  try {
    const data = jwt.verify(token, JWTSecretkey);
    req.user = data.user;
    // console.log(req.user.id);
  } catch (error) {
    res.status(401).send({ error: "Please Authenticate User" });
  }
  next();
};

exports = module.exports = {
  fetchUser,
};
