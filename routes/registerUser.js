const connection = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

const JWTSecretkey = process.env.JWT_SECRET_KEY;

// 2nd
const createNU = (user) => {
  return new Promise((resolve, reject) => {
    // 3rd
    checkEmailUser(user.Email)
      .then((rows) => {
        if (rows.length > 0) reject(`This email ${user.Email} already exist.`);
        else {
          // console.log(user.Email);
          connection.query(
            `INSERT INTO User (Name, Email, Password) Values ("${user.Name}", "${user.Email}", "${user.Password}");`,
            (err, rows) => {
              if (err) reject(err);
              else resolve("New user created!!!");
            }
          );
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// 1st call
const createNewUser = async (req, res) => {
  const salt = bcrypt.genSaltSync(10);
  const secPassword = await bcrypt.hash(req.body.password, salt);
  const user = {
    Name: req.body.name,
    Email: req.body.email,
    Password: secPassword,
  };
  createNU(user)
    .then((user) => {
      const data = {
        user: {
          id: user.PersonID,
        },
      };
      const authToken = jwt.sign(data, JWTSecretkey);
      res.json({ authToken });
    })
    .catch((err) => {
      res.status(409).json({ errors: err });
    });
};

// 2nd->3rd->2nd
const checkEmailUser = (email) => {
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
  createNewUser,
};
