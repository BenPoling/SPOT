var express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const formidable = require("formidable");
const fs = require("fs");

var pg = require("../postgres/postgres.js");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(__dirname + "/../react-client/dist"));

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads");
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  }
});

var upload = multer({ storage: storage });

app.get("/items", function(req, res) {});

app.post("/upload", upload.single("photo"), (req, res) => {
  const { address, description, city } = req.body;
  const img = fs.readFileSync(req.file.path);
  const photo = img.toString("base64");
  const spotObj = {
    address,
    description,
    city,
    photo
  };
  let quer = `INSERT INTO allSpots (spot) VALUES ('${JSON.stringify(
    spotObj
  )}')`;
  pg.query(quer)
    .then(data => console.log(data))
    .catch(err => console.log(err));
  console.log(spotObj);
});

app.listen(3000, function() {
  console.log("listening on port 3000!");
});
