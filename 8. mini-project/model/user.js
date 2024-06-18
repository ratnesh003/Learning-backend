const mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/mini-project`)
    .then(console.log("connected!"));

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    image: String,
    age: Number,
    post: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post"
        }
    ]
})

module.exports = mongoose.model("user", userSchema)