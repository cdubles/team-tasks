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
app.use(express.static("projects"));

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
      projects: null,
    };
    dbo.collection("profiles").insertOne(newUser, function (error, res) {
      if (error) throw error;
      console.log("1 document inserted");
      db.close();
    });
  });
}

//check if user exists, if not make account
app.post("/signup", function (req, res) {
  var userName = helper.sanitize(req.body.username);
  var firstName = helper.sanitize(req.body.firstname);
  var password = req.body.password;

  MongoClient.connect(database, function (err, db) {
    if (err) throw err;
    var dbo = db.db("TEAM_TASKS");
    var query = { name: userName };
    dbo
      .collection("profiles")
      .find(query)
      .toArray(function (error, result) {
        if (error) throw error;
        console.log(result);
        if (result === undefined || result.length == 0) {
          // user not found
          console.log("no user");
          addUser(userName, firstName, password); //make a new user
          res.send("user made");
          res.end();
        } else {
          console.log("user found");
          res.send("user exists");
          res.end();
        }
      });
    db.close();
  });
});

//login user if all info is right
app.post("/login", function (req, res) {
  var userName = req.body.user;
  var password = req.body.password;

  console.log("Username: " + userName);
  console.log("Password: " + password);

  MongoClient.connect(database, function (err, db) {
    var dbo = db.db("TEAM_TASKS");
    dbo
      .collection("profiles")
      .findOne({ name: userName }, function (error, result) {
        if (error) throw error;
        console.log(result);
        if (result == null) return;
        if (result.pwd == password) {
          //login condition
          console.log("login good");
          res.send("good");
          res.end();
        } else {
          console.log("login error");
          res.send("bad");
          res.end();
        }
        db.close();
      });
  });
});

app.post("/makeProject", function (req, res) {
  var name = req.body.name;
  var desc = req.body.description;
  var members = req.body.members;

  var newProject = { name: name, description: desc, members: members };
  MongoClient.connect(database, function (err, db) {
    var dbo = db.db("TEAM_TASKS");
    dbo
      .collection("projects")
      .find({ name: name })
      .toArray(function (error, result) {
        if (result === undefined || result.length == 0) {
          //no project found
          dbo
            .collection("projects")
            .insertOne(newProject, function (error2, response) {
              if (error2) throw error2;
              console.log("1 document inserted");
              //add to members profiles
              for (var member = 0; member <= members.length; member++) {
                dbo
                  .collection("profiles")
                  .find({ name: members[member] })
                  .toArray(function (error3, members_results) {
                    console.log(members_results);
                  });
              }

              db.close();
              res.send("created");
              res.end();
            });
        } else {
          // project already made
          res.send("already-created");
          res.end();
        }
      });
  });
});

//find all projects a user is in
app.post("/findProjects", function (req, res) {
  MongoClient.connect(database, function (err, db) {
    var dbo = db.db("TEAM_TASKS");
    dbo
      .collection("profiles")
      .find({ name: req.body.userName })
      .toArray(function (error, result) {
        console.log(result[0].projects);
        console.log(req.body.userName);
        res.send(result[0].projects);
        res.end();
      });
  });
});

//send all people userNames and firstname to frontend
app.post("/allPeople", function (rq, res) {
  MongoClient.connect(database, function (err, db) {
    var dbo = db.db("TEAM_TASKS");
    dbo
      .collection("profiles")
      .find()
      .toArray(function (error, result) {
        var peopleArray = [];
        for (var i = 0; i < result.length; i++) {
          peopleArray.push(result[i].firstName);
          console.log(result[i]);
        }
        res.send(peopleArray);
        res.end();
      });
  });
});
//for socket connections
io.on("connection", (socket) => {
  console.log(socket.id);
});

server.listen(PORT, () => {
  console.log(`server started on port ${PORT} `);
});
