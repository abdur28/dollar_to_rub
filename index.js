const express = require("express")
const https = require("https")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
require('dotenv').config();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extented:true}));

mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.mongoURL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

const studentdataSchema = new mongoose.Schema ({
  fname: String,
  lname: String,
  email: String
})

const Studentdata = mongoose.model("Studentdata", studentdataSchema);

const studentdata = new Studentdata ({
  fname: "Abdurrahman",
  lname: "Idris",
  email: "abdurrahmanidris28@gmail.com"
})

// studentdata.save()

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res){
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var my_email = req.body.email;

  Studentdata.find({email:my_email}, function(err, foundEmail){
    if (err) {
      console.log(err);
    } else {
      if (foundEmail[0]){
        res.sendFile(__dirname + "/failure.html")
      } else {

        const studentdata = new Studentdata({
          fname: firstName,
          lname: lastName,
          email: my_email
        })
        studentdata.save()
        res.sendFile(__dirname + "/success.html")
      }
    }
  })
})

//Connect to the database before listening
connectDB().then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log("listening for requests");
    })
})
