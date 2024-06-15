const mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/auth-test-app`)
    .then(console.log("connected!"));

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    image: String,
    age: Number
})

module.exports = mongoose.model("user", userSchema)