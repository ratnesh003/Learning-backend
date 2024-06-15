const express = require('express');
const userSchema = require('./usermodule');

const app = express();

app.get("/", (req, res, next) => {
    res.send("Hello");
})

app.get("/create", async (req, res, next) => {
    
    const createdUser = await userSchema.create({
        user: "ratnesh",
        username: "Ratnesh",
        email: "ratneshpasi03@gmail.com"
    })

    res.send(createdUser);
})

app.get("/update", async (req, res, next) => {
    
    const updatedUser = await userSchema.findOneAndUpdate(
        {user: "ratnesh"},
        {username: "Ratnesh Tarakant Pasi"},
        {new: true}
    )

    res.send(updatedUser);
})

app.get("/read", async (req, res, next) => {
    const User = await userSchema.find() // findOne({user: "ratneh"}) & find()
    res.send(User);                                       // returns only object       & returns array of objects
})

app.get("/delete", async (req, res, next) => {
    const User = await userSchema.findOneAndDelete({user: "ratnesh"})
    res.send(User);
})

app.listen(3000);