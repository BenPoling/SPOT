var express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const formidable = require("formidable");
const fs = require("fs");
// const imager = require("multer-imager");
const gcsSharp = require("multer-sharp");
const aws = require("aws-sdk");
const dotenv = require("dotenv");
var pg = require("../postgres/postgres.js");
dotenv.config();
const PORT = process.env.PORT || 5000;
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + "/../react-client/dist"));

const storage = gcsSharp({
  bucket: "spotphotos",
  projectId: process.env.PROJECTID,
  keyFilename: "MyFirstProject-2d0407bb0e31.json",
  acl: "publicRead",
  size: {
    width: 400,
    height: 400
  },
  max: true
});

var upload = multer({ storage });

app.get("/get", function(req, res) {
  let quer = "SELECT * FROM allSpots ";
  pg.query(quer)
    .then(data => res.send(data.rows))
    .catch(err => res.send(err));
});
app.get("/filter/", (req, res) => {
  let quer = "SELECT * FROM allSpots";
  let options = [];
  let queryObj = req.query;
  for (let key in queryObj) {
    if (queryObj[key] === "") {
      continue;
    }
    options.push([key, queryObj[key]]);
  }
  if (options.length === 1) {
    quer += ` WHERE ${options[0][0]}='${options[0][1]}'`;
  } else if (options.length === 2) {
    quer += ` WHERE ${options[0][0]}='${options[0][1]}' AND ${options[1][0]}='${
      options[1][1]
    }'`;
  }
  pg.query(quer)
    .then(filterResult => res.send(filterResult.rows))
    .catch(err => res.send(err));
});

app.post("/upload", upload.single("photo"), (req, res) => {
  const photo = req.file.path;
  const { address, description, city, type, orientation } = req.body;
  const spotObj = {
    address,
    description,
    city,
    orientation,
    photo
  };
  let quer = `INSERT INTO allSpots (type, city, spot) VALUES ('${type}', '${city}', '${JSON.stringify(
    spotObj
  )}')`;
  pg.query(quer)
    .then(data => res.send(200))
    .catch(err => res.send(err));
});

app.patch("/update", (req, res) => {
  const { description, id } = req.body;
  console.log(description, id);
  pg.query(`SELECT spot FROM allSpots WHERE id=${id}`).then(data => {
    let oldSpot = data.rows[0].spot;
    console.log(oldSpot);
    oldSpot.description = description;
    pg.query(
      `UPDATE allSpots SET spot='${JSON.stringify(oldSpot)}' WHERE id=${id}`
    );
  });
});

app.listen(PORT, function() {
  console.log(`listening on port ${PORT}!`);
});
