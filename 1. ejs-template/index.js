const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.use(function(req, res, next){
    console.log("This is running ...");
    next();
})

app.get("/", function(req, res, next){
    res.render("index");
})

app.get("/profile/:username", function(req, res, next){
    res.send(`welcome, ${req.params.username}`);
})

app.get("/profile/:username/:rating", function(req, res, next){
    res.send(`welcome, ${req.params.username} your rating is ${req.params.rating}`);
})

app.get("/about/:username/:age", function(req, res, next){
    res.send(`welcome, ${req.params.username} of age ${req.params.age}`);
})

app.listen(3000);