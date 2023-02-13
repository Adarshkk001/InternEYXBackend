const { body, validationResult } = require("express-validator");

// Validation for REGISTRATION
const validateUserREG = [
  body("name", "Enter a valid name").isLength({ min: 3 }),
  body("email", "Enter a valid Email").isEmail(),
  body("password", "Password must be atleast 5 char").isLength({ min: 5 }),
  (req, res, next) => {
    // console.log(req.body);
    const errors = validationResult(req);
    // console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // console.log(req.body);
    next();
  },
];

// Validation for LOGIN
const validateUserLOGIN = [
  body("email", "Enter a valid Email").isEmail(),
  body("password", "Password must exists").isLength({ min: 1 }),
  (req, res, next) => {
    // console.log(req.body);
    const errors = validationResult(req);
    // console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // console.log("validator: ", req.body);
    next();
  },
];

exports = module.exports = {
  validateUserREG,
  validateUserLOGIN,
};
