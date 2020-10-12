const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static(__dirname + "/"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res) {
  const firstName = req.body.firstN;
  const lastName = req.body.lastN;
  const email = req.body.email;
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };
  const jsonData = JSON.stringify(data);


  const url = "https://us2.api.mailchimp.com/3.0/lists/50142231b9";
  const options = {
    method: "POST",
    auth: "dorcas1:9608da0b6d03df91385f0eec19dcc92a-us2"
  }

  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }

    response.on("data", function(data) { //send the data back to my server from mailchimp
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen("3000", function() {
  console.log("server is running on port 3000");
});


//API Keys
// 9608da0b6d03df91385f0eec19dcc92a-us2

// unique id  (List Id)
// 50142231b9
