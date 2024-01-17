// src/lib/connection.ts

import mysql from 'mysql2/promise';

const mysql_connection = async () =>
  await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

export default mysql_connection;
