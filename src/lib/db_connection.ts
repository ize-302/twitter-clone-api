const { Client } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

// create users table
client.query(`CREATE TABLE IF NOT EXISTS users (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username text,
  display_name text,
  password text
)
;`);

// create refreshtokens table
client.query(`CREATE TABLE IF NOT EXISTS refreshtokens (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  token text,
  user_id text
)
;`);

// create followers table
client.query(`CREATE TABLE IF NOT EXISTS followers (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id text,
  follower_id text
)
;`);

// create likes table
client.query(`CREATE TABLE IF NOT EXISTS likes (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tweet_id text,
  user_id text
)
;`);

export default client;
