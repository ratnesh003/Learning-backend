const mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/postdb`)
    .then(console.log("connected !"));

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    age: Number,
    post: [
        {
            type: mongoose.Schema.Types.ObjectId,
        }
    ]
})


module.exports = mongoose.model("user", userSchema);