const connection = require("../db");

const getUsersHelper = () => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM User`, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const getUsers = (req, res) => {
  getUsersHelper()
    .then((rows) => {
      res.json(rows);
    })
    .catch((err) => {
      res.json(err);
    });
};

exports = module.exports = {
  getUsers,
};
