//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY);
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
  if (err)
       console.error(err);
    else
       console.log("Connected to the mongodb");
});

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  username: String,
  email: String,
  password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });


const User = mongoose.model("User", userSchema);



app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});


app.post("/register", function(req, res){
  const newUser = new User ({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res){
  const email =  req.body.email;
  const password = req.body.password;

  User.findOne({email: email}, function(err, foundUser){
    if (err){
      console.log(err);
    } else {
      if (foundUser){
        if (foundUser.password === password) {
          res.render("secrets");
        } else {
          res.render("register");
          alert("incorrect credentials");
        }
      } else {
          res.send(" User doesn't exist!! please signup")
      }
    }
  });
});












app.listen(3000, function(){
  console.log("server started on port 3000");
});
