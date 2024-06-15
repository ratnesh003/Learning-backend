const express = require('express');
const body = require('body-parser');
const path = require('path');
const userSchema = require('./model/user.js')

const app = express();

app.use(body.json());
app.use(body.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res, next){
    res.render("index");
})

app.get("/read", async function(req, res, next){

    const userData = await userSchema.find();
    
    res.render("read", {userData});
})

app.post("/create", async function(req, res, next){

    const { username, email, image } = req.body;

    const createdUser = await userSchema.create({
        username,
        email,
        image
    })

    res.redirect("/read")
})

app.get("/delete/:userID", async function(req, res, next){
    const deleteUser = await userSchema.findOneAndDelete(
        {_id: req.params.userID}
    )
    res.redirect("/read");
})

app.get("/edit/:userID", async function(req, res, next){
    const user = await userSchema.findOne(
        {_id: req.params.userID}
    )
    res.render("edit", {user});
})

app.post("/update/:userID", async function(req, res, next){

    const { username, email, image } = req.body;

    const editUser = await userSchema.findOneAndUpdate(
        {_id: req.params.userID},
        {
            username,
            email,
            image
        }
    )

    res.redirect("/read");
})

app.listen(3000);