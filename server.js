const express=require("express");
const path = require("path");
const bodyParser= require("body-parser");
const request =require("request");
const mongoose= require("mongoose");
let MongoClient = require('mongodb').MongoClient;
const app=express();
let  mongodbURLDocker="mongodb://admin:password@mongodb";
let  mongodbURLLocal="mongodb://admin:password@localhost:27017";
let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
let databaseName = "my-app";
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static("public"));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "/index.html"));
  });
app.get('/contact.html', function (req, res) {
      res.sendFile(path.join(__dirname, "/contact.html"));
    });
app.post('/post-message', function (req, res) {
  let userObj = req.body;


  // Send response
  res.send(userObj);
  console.log("The status code is "+res.statusCode);
  if(res.statusCode===200){
    app.get('/success', function (request , response) {
      request.sendFile(path.join(__dirname, "/success.html"));
      });

  }else{
    app.get('/failure', function (request, response) {
      request.sendFile(path.join(__dirname, "/failure.html"));
      });
  }

  MongoClient.connect(mongodbURLDocker, mongoClientOptions, function (err, client) {
    if (err) throw err;

        let db = client.db(databaseName);
        let newvalues = { name: req.body.name,emailid: req.body.emailid,message:req.body.message};

        db.collection("messages").insertOne(newvalues, function(err, res) {
          if (err) throw err;
           console.log("1 document inserted");
          client.close();
        });

      });
});

app.listen(3000, function(){
  console.log("Server started on port 3000");
});
