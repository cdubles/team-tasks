const mongo = require("mongodb");
const MongoClient = require("mongodb").MongoClient;

const database = "mongodb://localhost:27017/";

MongoClient.connect(database, function (err, db) {
  if (err) throw err;
  var dbo = db.db("TEAM_TASKS");
  var myquery = { type: "testing" };
  dbo.collection("profiles").deleteMany(myquery, function (err, obj) {
    if (err) throw err;
    console.log(obj.result.n + " document(s) deleted");
    db.close();
  });
});
