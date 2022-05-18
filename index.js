require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

// Version 1
// const pool = new Pool({
//   user: "xyz",
//   host: "xyz",
//   password: "xyz",
//   database: "xyz",
//   port: 5432,
// });

//Version 2 of connecting, using the connection string + storing in env variables
//NOTE: Don't capitalize the constant, it won't work
const connectionString = process.env.PG_CONNECTIONSTRING;

const pool = new Pool({
  connectionString,
});

const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send(
    "<h1>NodeJS & SQL</h1><p>Check out the routes: <ul><li>users</li></ul></p>"
  );
});

//get all users
app.get("/users", (req, res) => {
  pool
    .query("SELECT * FROM users")
    .then((results) => {
      console.log(results.rows);
      res.send(results.rows);
    })
    .catch((err) => console.log(err));
  // .then(() => res.status(200).send("here you will find the users"))
});

//get one user by id
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  pool
    .query("SELECT * FROM users WHERE id = $1", [id])
    .then((results) => {
      console.log(id);
      res.status(200).send(results.rows);
    })
    .catch((err) => console.log(err));
});

//post a new user with hardcoded data for now. Firing this request will only ever post the same information because we're not accessing the req.body yet
app.post("/users", (req, res) => {
  pool
    .query("INSERT INTO users (name, lastname, age) VALUES ($1, $2, $3)", [
      "Sam",
      "Doe",
      40,
    ])
    .then((results) => {
      console.log(results);
      res.status(200).send(results.rows);
    })
    .catch((err) => console.log(err));
});

//update one user. Firing this request will only ever update the same information because we're not accessing the req.body yet
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  pool
    .query(
      "UPDATE users SET name = $1, lastname = $2, age = $3 WHERE id = $4",
      ["Bobby", "Doe", 40, id]
    )
    .then((results) => res.status(200).send(results.rows))
    .catch((err) => console.log(err));
});

//delete one user via their ID
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  pool
    .query("DELETE FROM users WHERE id = $1", [id])
    .then((results) => res.status(200).send(results))
    .catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
