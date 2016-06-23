var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var nodemailer = require("nodemailer");
var favicon = require("serve-favicon");
var port = 3000;
var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.set("port", (process.env.PORT || 3000));

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res) {
    res.render("index");
});

app.post("/send", function(req, res) {
    var transport = nodemailer.createTransport({
        service: process.env.PROVIDER,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    });   
    
    var mailOptions = {
        from: req.body.name + "<"+ req.body.email + ">",
        to: process.env.USER,
        subject: "Inquiry from website...",
        text: "You have a new message with the following details..." + "\n" + "Name: " + req.body.name + "\n" + "Email: " + req.body.email + "\n" + "Message: " +  req.body.message
    };
    
    transport.sendMail(mailOptions, function(err, info) {
        if(err) {
            console.log(err);
            res.redirect("/");
        } else {
            console.log("Message Sent: " + info.response);
            res.redirect("/");
        }
    });
});

app.listen(app.get("port"), function(){
    console.log("SERVER IS RUNNING", app.get("port"));
});