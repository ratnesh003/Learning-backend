const cookieParser = require('cookie-parser');
const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cookieParser())

app.get("/", function(req, res, next){
    res.cookie("name", "ratnesh");
    res.send("done !");
})

app.get("/read", function(req, res, next){
    console.log(req.cookies)
    res.send("read page");
})

app.get("/hash", function(req, res, next){
    bcrypt.genSalt(10, function(err, salt) { // salt is random string generated for encryption
        bcrypt.hash("rxt@2003T", salt, function(err, hash) {
            res.cookie("hash", hash); // hash is the encrypted password i.e. saved in password db
            res.send ("done!");
        });
    });
})

app.get("/compare", function(req, res, next){
    const hash = req.cookies.hash
    bcrypt.compare("rxt@2003T", hash, function(err, result) {
        res.send(result);// results tell wheather the entred password and saved hash matched or not 
    });
})

app.get("/jwt", function(req, res, next){
    const token = jwt.sign({data: "ratnesh", email:"ratneshpasi03@gmail.com"}, "secret");
    const decoded = jwt.verify(token, "secret");
    decoded.token = token;
    res.send(decoded);
})

app.listen(3000);