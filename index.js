const express = require('express')
const app = express()
const server = require('http').createServer(app);
const options = {};
const io = require('socket.io')(server, options);
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const helper = require("./functions.js")

const database = "mongodb://localhost:27017/"

const PORT = 8080

app.use(express.urlencoded())
app.use(express.json())
app.use(express.static('login'))
app.use(express.static('reusables'))
app.use(express.static('public'))

function createProfile(name,pwd){
  MongoClient.connect(database, function(err, db) {
    if (err) throw err;
    var dbo = db.db("TEAM_TASKS");
    var testUser = { name: "Tester", id: "TestID" };
    dbo.collection("profiles").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
}

app.post('/signup',function(req,res){
  console.log('Signup complete')
  console.log("Username: "+req.body.username)
  console.log("First Name: "+req.body.firstname)
  console.log("Password: "+req.body.password)

  console.log(helper.sanitize(req.body.username))

  res.send("signup Complete")
  console.log("============================================")
  res.end()
})

app.post('/login',function(req,res){
  console.log('log in complete')
  res.send("signed up")
  console.log("Username: "+req.body.user)
  console.log("Password: "+req.body.password)
  console.log("============================================")
  res.end()
})

io.on('connection', socket => { 
  console.log(socket.id)
});



server.listen(PORT,()=>{console.log(`server started on port ${PORT} `)});