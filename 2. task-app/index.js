const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const camelize = function(str) {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
            if (+match === 0) return "";
            return index === 0 ? match.toLowerCase() : match.toUpperCase();
        })
        .replace(/\s+/g, '');
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(function (req, res, next) {
    console.log("It is running ...");
    next();
})

app.get("/", function (req, res, next) {
    fs.readdir(`./files`, function (err, files) {
        res.render("index", { files: files });
    })
})

app.get("/file/:taskname", function (req, res, next) {
    fs.readFile(`./files/${req.params.taskname}`, "utf-8", function (err, files) {
        res.render("file", {filename: req.params.taskname, filedetail: files});
    })
})

app.get("/edit/:taskname", function (req, res, next) {
    res.render("edit", {filename: req.params.taskname});
})

app.post("/edit", function (req, res, next) {
    fs.rename(`./files/${req.body.previousName}`, `./files/${req.body.newName}`, function (err) {
        res.redirect("/");
    })
})

app.post("/create", function (req, res, next) {
    fs.writeFile(`./files/${camelize(req.body.task)}.txt`, req.body.description, function (err) {
        res.redirect("/");
    })
})

app.listen(3000);