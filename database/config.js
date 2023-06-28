const { Pool } = require("pg")
const dotenv = require("dotenv")
dotenv.config()

const pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: 5432
})
const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone_number BIGINT UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      login_by VARCHAR(255) NULL
    )`;

const createOrdersTableQuery = `
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      phone_number BIGINT NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      sub_total BIGINT NOT NULL
    )`;

// Execute the create table query
async function createTable() {
    const client = await pool.connect();
    try {
        await client.query(createUserTableQuery);
        await client.query(createOrdersTableQuery);
        console.log('Table created successfully');
    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
        client.release();
    }
}

module.exports = { createTable, pool };
