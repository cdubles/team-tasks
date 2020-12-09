const express = require("express");
const { truncateSync } = require("fs");
const app = express();
const server = require("http").createServer(app);
const options = {};
const io = require("socket.io")(server, options);
const mongo = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const helper = require("./functions.js");

const database = "mongodb://localhost:27017/";

const PORT = 8080;

app.use(express.urlencoded());
app.use(express.json());
app.use(express.static("login"));
app.use(express.static("reusables"));
app.use(express.static("public"));

//add user to DB
function addUser(userName, firstName, password) {
  MongoClient.connect(database, function (err, db) {
    if (err) throw err;
    var dbo = db.db("TEAM_TASKS");
    var newUser = {
      type: "testing",
      name: userName,
      firstName: firstName,
      pwd: password,
    };
    dbo.collection("profiles").insertOne(newUser, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
}

//check if user exists, if not make account
app.post("/signup", function (req, res) {
  console.log("++++++++++++++Sign Up+++++++++++++++++++++++++");
  var userName = helper.sanitize(req.body.username);
  var firstName = helper.sanitize(req.body.firstname);
  var password = req.body.password;
  var userExists;
  MongoClient.connect(database, function (err, db) {
    if (err) throw err;
    var dbo = db.db("TEAM_TASKS");
    var query = { name: userName };
    dbo
      .collection("profiles")
      .find(query)
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        if (result === undefined || result.length == 0) {
          // user not found
          console.log("no user");
          addUser(userName, firstName, password); //make a new user
          res.send('user made')
        } else {
          console.log("user found");
          res.send("user exists")
        }
      });
    db.close();
  });
  res.send("signup Complete");
  console.log("============================================");
  res.end();
});

//login user if all info is right
app.post("/login", function (req, res) {
  console.log('+++++++++++Login in+++++++++++++++++')
  var userName = req.body.user;
  var password = req.body.password;

  console.log("Username: " + userName);
  console.log("Password: " + password);

  MongoClient.connect(database, function (err,db){ 
    var dbo = db.db("TEAM_TASKS");
    dbo.collection("profiles").findOne({name:userName}, function(err, result) {
      if (err) throw err;
      console.log(result);

      if(result.pwd == password){ //sign in condition
        console.log('login good')
        res.redirect('/home.html')
        res.end();
      }
      else{
        console.log("sign in error")
        res.end();
      }
      db.close();
    });
  })
  console.log("============================================");
  
});
//for socket connections
io.on("connection", (socket) => {
  console.log(socket.id);
});

server.listen(PORT, () => {
  console.log(`server started on port ${PORT} `);
});
