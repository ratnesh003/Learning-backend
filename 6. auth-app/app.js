const express = require('express');
const body = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const userModel = require('./model/user.js');


const app = express();

app.use(body.json());
app.use(body.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res, next){
    res.render("index");
})

app.get("/create", function(req, res, next){
    res.render("create");
})

app.post("/newuser", async function(req, res, next){
    const { username, email, password, image, age } = req.body;
    const newUser = await userModel.findOne({email});

    if(!newUser) {
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(password, salt, function(err, hash){
                const createdUser = userModel.create({
                    username,
                    email,
                    password: hash,
                    image,
                    age
                });
                const userToken = jwt.sign({username, email, password}, "secret");
                res.cookie("userToken", userToken);
                res.redirect("/profile");
            })
        })
    } else {
        res.redirect("/errorpage")
    }
})

app.get("/profile", async function(req, res, next){
    const userToken = req.cookies.userToken
    const userData = jwt.verify(userToken, "secret")
    let user = await userModel.findOne({email: userData.email});
    user.password = userData.password
    res.render("profile", {user});
})

app.get("/login", function(req, res, next){
    res.render("login");
})

app.post("/login", async function(req, res, next){
    const { email, password } = req.body;
    const user = await userModel.findOne({email});

    if(user) {
        bcrypt.compare(password, user.password, function(err, result) {
            if(result) {
                const userToken = jwt.sign({username: user.username, email: user.email, password: password}, "secret");
                res.cookie("userToken", userToken);
                res.redirect("/profile");
            } else {
                res.redirect("/errorpage");
            }
        })
    } else {
        res.redirect("/errorpage");
    }
})

app.get("/logout", function(req, res, next) {
    res.cookie("userToken", "");
    res.redirect("/");
})

app.get("/errorpage", function(req, res, next){
    res.send("something went wrong");
})

app.post("/update", function(req, res, next){
    const {username, email, password, image, age} = req.body;

    const userToken = req.cookies.userToken;
    const userData = jwt.verify(userToken, "secret");

    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(password, salt, async function(err, hash){
            let user = await userModel.findOneAndUpdate(
                {email: userData.email},
                {
                    username,
                    email,
                    password: hash,
                    image,
                    age
                }
            );
            const userToken = jwt.sign({username: user.username, email: user.email, password: password}, "secret");
            res.cookie("userToken", userToken);
            res.redirect("/profile");
        })
    })
})

app.listen(3000);

