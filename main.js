const express = require("express");
const mex = require("mustache-express");
const bodyparser = require("body-parser");
const app = express();
const expressValidator = require("express-validator");
const path = require("path");
const session = require("express-session");
const routes = require('./routes/routes');
app.engine("mustache", mex());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");
app.set('layout', 'layout');

// serve static files to server
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(expressValidator());
// initialize Express sessions
app.use(session({
  secret:"nskl",
  resave: false,
  saveUninitialized:false
}));


app.use(routes);
app.listen(3000, function () {
  console.log("whats up mane");
});
