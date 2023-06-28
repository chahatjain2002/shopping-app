const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../database/config');
const verifyGoogleToken = require('../middleware/google-strategy');
const dotenv = require("dotenv");
dotenv.config();
var express = require('express');
var router = express.Router();

router.post("/add-user", async (req, res) => {

  // Our register logic starts here
  try {
    // Validate user input
    if (!(req.body.email && req.body.contactNo && req.body.password && req.body.fullName)) {
      res.status(400).send("All input is required");
    }

    // Validate if user exist in our database
    const oldUser = await pool.query("SELECT * FROM users WHERE phone_number = $1 AND email = $2", [req.body.contactNo, req.body.email]);

    if (oldUser.rowCount > 0) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(req.body.password, process.env.SALT_ROUND);

    // Create user in our database
    await pool.query(`INSERT INTO users(email,phone_number, password, full_name) VALUES ($1,$2, $3, $4)`, [req.body.email, req.body.contactNo, encryptedPassword, req.body.fullName])
    const user = await pool.query("SELECT * FROM users WHERE phone_number = $1 AND email = $2", [req.body.contactNo, req.body.email]);


    // return new user
    res.status(201).send(`User created successfully`);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

router.post('/login-user', async (req, res) => {

  // Our login logic starts here
  try {
    // Validate user input
    if (!(req.body.contactNo && req.body.password)) {
      res.status(400).send("All input is required");
    }

    // Validate if user exist in our database
    // Validate if contact number and password are valid
    const validateUser = await pool.query("SELECT * FROM users WHERE phone_number = $1", [req.body.contactNo]);
    if (validateUser.rowCount == 0) {
      return res.status(401).send("Invalid contact number or password.");
    }

    const validPassword = await bcrypt.compare(req.body.password, validateUser.rows[0].password);
    if (!validPassword) return res.status(401).send('Invalid contact number or password.');
    await pool.query("UPDATE users SET login_by = $1 WHERE email = $2", ["Credentials", validateUser.rows[0].email]);

    // Generate token
    const token = jwt.sign(
      { user_id: validateUser.rows[0].id, email: validateUser.rows[0].email, user_name: validateUser.rows[0].full_name },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: 3600,
      }
    );

    // Return token
    res.status(200).json({
      id: validateUser.rows[0].id,
      email: validateUser.rows[0].email,
      name: validateUser.rows[0].full_name,
      accessToken: token,
    });

  } catch (err) {
    console.log(err);
  }
  // Our login logic ends here
})

router.post('/google-login', async (req, res) => {

  // Our login logic starts here
  try {
    // Extract Google Token
    let loginToken;
    for (let index = 0; index < req.rawHeaders.length; index++) {
      if (req.rawHeaders[index] == 'Access-Control-Request-Headers') {
        loginToken = req.rawHeaders[index + 1];
        break;
      }
    }

    // Validate user
    const verificationResponse = await verifyGoogleToken(loginToken);
    if (verificationResponse.error) {
      return res.status(400).json({
        message: verificationResponse.error,
      });
    }


    // Validate if user exist in our database
    const validateUser = await pool.query("SELECT * FROM users WHERE email = $1", [verificationResponse.payload.email]);
    if (validateUser.rowCount == 0) {
      return res.status(409).send("User Not Found. Please Register");
    }

    await pool.query("UPDATE users SET login_by = $1 WHERE email = $2", ["GOOGLE", validateUser.rows[0].email]);

    // Generate token
    const token = jwt.sign(
      { user_id: validateUser.rows[0].id, email: validateUser.rows[0].email, user_name: validateUser.rows[0].full_name },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: 3600,
      }
    );

    // Return token
    res.status(200).json({
      id: validateUser.rows[0].id,
      email: validateUser.rows[0].email,
      name: validateUser.rows[0].full_name,
      accessToken: token,
    });

  } catch (err) {
    console.log(err);
  }
  // Our login logic ends here
})


module.exports = router;
