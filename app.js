const { createTable } = require('./database/config');
const users = require('./routes/users');
const orders = require('./routes/orders');
const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const app = express();

//Creating table if not created
createTable();

app.use(express.json());
app.get('/', async (req, res) => {
    res.send('Shopping App');
});
app.use('/user', users);
app.use('/order', orders);

//Initializing Port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));