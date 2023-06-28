const auth = require('../middleware/auth');
const { pool } = require('../database/config');
var express = require('express');
var router = express.Router();

router.post('/add-order', auth, async (req, res) => {

  //Our order placing logic starts here
  try {
    // Validate user input
    if (!(req.body.contactNo && req.body.productName && req.body.total)) {
      res.status(400).send("All input is required");
    }

    // Placing order
    await pool.query(`INSERT INTO orders(user_id, phone_number, product_name, sub_total) VALUES ($1, $2, $3, $4)`, [req.user.user_id, req.body.contactNo, req.body.productName, req.body.total]);

    // return new user
    res.status(201).send('Order Placed Successfully');
  } catch (err) {
    console.log(err);
  }
  // Our order placing logic ends here
})

router.get('/get-order', auth, async (req, res) => {

  // Our get order logic starts here
  try {

    // Getting order details
    const userOrders = await pool.query("SELECT * FROM orders WHERE user_id = $1", [req.user.user_id]);

    // return order details of user
    res.status(200).send(`Orders Returned Successfully: \n ${JSON.stringify(userOrders.rows)}`);
  } catch (err) {
    console.log(err);
  }
  // Our get order logic ends here
})

module.exports = router;
