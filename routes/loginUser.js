const connection = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

const JWTSecretkey = env.parsed.JWT_SECRET_KEY;
const checkAuth = (user) => {
  return new Promise((resolve, reject) => {
    checkEmailExist(user.Email)
      .then(async (rows) => {
        if (rows.length <= 0) reject("Incorrect Credentials");
        const passwordCompare = await bcrypt.compare(
          user.Password,
          rows[0].Password
        );
        if (passwordCompare) {
          resolve(rows[0]);
        } else reject("Incorrect Credentials");
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const userLogin = (req, res) => {
  const user = {
    Email: req.body.email,
    Password: req.body.password,
  };

  checkAuth(user)
    .then((user) => {
      const data = {
        user: {
          id: user.PersonID,
        },
      };
      // console.log(user);
      const authToken = jwt.sign(data, JWTSecretkey);

      const response = {
        name: user.Name,
        email: user.Email,
        authToken,
      };
      res.json(response);
    })
    .catch((errors) => {
      res.status(401).json({ errors });
    });
};

const checkEmailExist = (email) => {
  // console.log(email);
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM User WHERE Email = ?`,
      email,
      (err, rows) => {
        if (err) {
          reject(err);
        } else resolve(rows);
      }
    );
  });
};

exports = module.exports = {
  userLogin,
};
