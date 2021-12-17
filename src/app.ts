import * as customenv from 'custom-env';
require('custom-env').env();
customenv.env(true);

import express from 'express';
import * as expressSession from 'express-session';
import session from 'express-session';
import expressMySqlSession from 'express-mysql-session';

export const app = express();

const MySQLStore = expressMySqlSession(expressSession);
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Passport wants this
app.use(session({
  secret: 'session_cookie_secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

app.get("/", async (req, res) => {
  res.status(200).json('Stick!');
});
