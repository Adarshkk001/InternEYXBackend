const express = require("express");
const app = express();

const home = require("./routes/home");
const registerUser = require("./routes/registerUser");
const getUsers = require("./routes/getUsers");
const userLogin = require("./routes/loginUser");
const fetchUser = require("./Middleware/fetchUser");

const validateUser = require("./Middleware/userValidator");
const connection = require("./db");

const PORT = Process.env.PORT || 3500;

app.use(express.json());
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Origin, X-Requested-With, Content-Type, Accept, Authorization, auth-token"
  );
  next();
});

// Home route
app.get("/", home.home);

// Get all the users
app.get("/users", getUsers.getUsers);

// Create a User using POST: "/users/register".
app.post(
  "/users/register",
  validateUser.validateUserREG,
  registerUser.createNewUser
);

// Login User (Authenticate)
app.post("/users/login", validateUser.validateUserLOGIN, userLogin.userLogin);

// Get LoggedIn User Details using: POST "/getuser". Login required
app.post("/users/getUsers", fetchUser.fetchUser, (req, res) => {
  try {
    connection.query(
      `SELECT Name, Email from User where PersonID = ${req.user.id}`,
      (err, rows) => {
        res.send(rows);
      }
    );
  } catch (error) {
    res.send(error);
  }
});

app.get("/SelectedCategory", fetchUser.fetchUser, (req, res) => {
  const id = req.user.id;
  try {
    connection.query(
      `Select CategoryName from UserCategory where PersonID = ${id}`,
      (err, rows) => {
        if (err) res.send(err);
        else {
          res.send(rows);
        }
      }
    );
  } catch (err) {
    res.send(err);
  }
});

app.post("/updateCategory", fetchUser.fetchUser, (req, res) => {
  // console.log(req.user.id, req.body.categories);
  const id = req.user.id;
  const categories = req.body.categories;
  try {
    connection.query(
      `delete from UserCategory where PersonID = ${id}`,
      (err) => {
        if (err) res.send(err);
      }
    );
    categories.forEach((category) => {
      connection.query(
        `insert into UserCategory values (${id}, "${category}")`,
        (err) => {
          if (err) {
            console.log("ERROR: ", err);
            res.send(err);
          }
        }
      );
    });
    res.send("success");
  } catch (err) {
    res.send(err);
  }
});

app.get("/SelectedColors", fetchUser.fetchUser, (req, res) => {
  const id = req.user.id;
  try {
    connection.query(
      `Select ColorName from UserColor where PersonID = ${id}`,
      (err, rows) => {
        if (err) res.send(err);
        else {
          res.send(rows);
        }
      }
    );
  } catch (err) {
    res.send(err);
  }
});

app.post("/updateColors", fetchUser.fetchUser, (req, res) => {
  console.log(req.user.id, req.body.colors);
  const id = req.user.id;
  const colors = req.body.colors;
  try {
    connection.query(`delete from UserColor where PersonID = ${id}`, (err) => {
      if (err) res.send(err);
    });
    colors.forEach((color) => {
      connection.query(
        `insert into UserColor values (${id}, "${color}")`,
        (err) => {
          if (err) {
            console.log("ERROR: ", err);
            res.send(err);
          }
        }
      );
    });
    res.send("success");
  } catch (err) {
    res.send(err);
  }
});

app.listen(PORT, () => {
  console.log("Server is running!!!");
});
