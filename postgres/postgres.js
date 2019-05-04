const { Pool } = require("pg");

const pool = new Pool({
  database: "spot"
});

pool.on("error", err => {
  console.log(err);
});

pool.connect((err, client, done) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected!");
  }
});

module.exports = pool;
