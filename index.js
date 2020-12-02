const express = require('express')
const app = express()
const server = require('http').createServer(app);
const options = {};
const io = require('socket.io')(server, options);
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

const database = "mongodb://localhost:27017/"

const PORT = 8080



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


io.on('connection', socket => { 
  console.log(socket.id)
});

app.use(express.static('public'))

server.listen(PORT,()=>{console.log(`server started on port ${PORT} `)});