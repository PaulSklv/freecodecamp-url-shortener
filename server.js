'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);
app.use(bodyParser.urlencoded({ extend: false }));
mongoose.connect(process.env.MONGO_URI, { useNewUrlParse: true, useUnifiedTopology: true });
app.use(cors());

let Schema = mongoose.Schema;
let shortUrlSchema = new Schema({
  mainUrl: {
    type: String,
    required: true
  },
  shortenedUrl: {
    type: Number,
    required: true
  }
});

let ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.route('/api/shorturl/new').post((req, res) => {
  let newUrl = new ShortUrl({mainUrl: req.body.url, shortenedUrl: })
})

app.listen(port, function () {
  console.log('Node.js listening ...');
});