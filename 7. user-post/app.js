const express = require('express');
const userModel = require('./model/user.js');
const postModel = require('./model/post.js');

const app = express();

app.get("/", function(req, res, next){
    res.send("done");
})

app.get("/user", async function(req, res, next){
    const user = await userModel.create({
        name: "Ratnesh",
        email: "ratneshpasi03@gmail.com",
        age: 21
    })
    res.send(user)
})

app.get("/postnew", async function(req, res, next){
    const post = await postModel.create({
        postData: "Something might be there !",
        user: "66701929cf8532bcd9d47932"
    });

    const user = await userModel.findOne({_id: "66701929cf8532bcd9d47932"});

    user.post.push(post);
    user.save();

    res.send({user, post});
})

app.get("/post", async function(req, res, next){
    const post = await postModel.find();
    res.send(post);
})

app.listen(3000);