const express = require('express');
const body = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');

const userModel = require('./model/user.js');
const postModel = require('./model/post.js');
const user = require('./model/user.js');
const { text } = require('stream/consumers');




const app = express();

app.use(body.json());
app.use(body.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async function(req, res, next){
    const userToken = req.cookies.userToken;
    const posts = await postModel.find();
    let user;
    let ready = false;
    if(userToken) {
        const userData = jwt.verify(userToken, "secret")
        user = await userModel.findOne({email: userData.email});
        if(user) {
            ready = true;
        }
    }
    res.render("index", { ready, posts, user });
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
                const userToken = jwt.sign({username, email, password, id: createdUser._id}, "secret");
                res.cookie("userToken", userToken);
                res.redirect("/profile");
            })
        })
    } else {
        res.redirect("/errorpage")
    }
})

app.get("/profile", isLoggedIn, async function(req, res, next){
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
                const userToken = jwt.sign({username: user.username, email: user.email, password: password, id: user._id}, "secret");
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

app.get("/dashboard", isLoggedIn, async function(req, res, next){
    const userToken = req.cookies.userToken
    const userData = jwt.verify(userToken, "secret")
    let user = await userModel.findOne({email: userData.email});

    const post = await postModel.find({createdBy: user._id});

    res.render("dashboard", {user, post});
})

app.post("/post", isLoggedIn, async function(req, res, next){
    const { title, content, image } = req.body;

    console.log(user.id);

    const createdPost = await postModel.create({
        title,
        content,
        image,
        createdBy: req.user.id
    })

    res.redirect("/dashboard");
})

app.get("/delete/:postId", isLoggedIn, async function(req, res, next){
    const post = await postModel.findOne({_id: req.params.postId});
    if(post.createdBy == req.user.id) {
        const post = await postModel.findOneAndDelete({_id: req.params.postId});
        res.redirect("/dashboard");
    } else {
        res.redirect("/login");
    }
})

app.get("/edit/:postId", isLoggedIn, async function(req, res, next){
    const post = await postModel.findOne({_id: req.params.postId});
    if(post.createdBy == req.user.id) {
        res.render("editpost", {post});
    } else {
        res.redirect("/login");
    }
})

app.post("/edit/:postId", isLoggedIn, async function(req, res, next){
    const post = await postModel.findOne({_id: req.params.postId});
    if(post?.createdBy == req.user.id) {
        const { title, content, image } = req.body;
        const post = await postModel.findOneAndUpdate(
            {_id: req.params.postId},
            {
                title,
                content,
                image
            }
        );
        res.redirect("/dashboard");
    } else {
        res.redirect("/login");
    }
})

app.get("/like/:postId", isLoggedIn, async function(req, res, next){

    const post = await postModel.findOne({_id: req.params.postId});

    if(post.likes.indexOf(req.user.id) === -1 ) {
        post.likes.push(req.user.id);
    } else {
        post.likes.splice(post.likes.indexOf(req.user.id), 1);
    }

    await post.save();
    res.redirect("../..");
})

function isLoggedIn(req, res, next) {
    const token = req.cookies.userToken
    if(!token){
        res.redirect("/login");
    } else {
        const userData = jwt.verify(token, "secret")
        req.user = userData;
        next();
    }
}

app.listen(3000);
