var express = require("express"),
    Constants = require("./server/constants");

var server = express();
server.use(express.cookieParser());
server.use(express.bodyParser());
server.use(express.static('public'));

server.get("/", function (req, res) {
    res.render("./index.jade", { layout: false });
});

server.get("/index", function (req, res) {
    res.render("./index.jade", { layout: false });
});

server.listen(Constants.SERVER_PORT);
console.log("Running server at: " + Constants.SERVER_HOST + ":" + Constants.SERVER_PORT);