'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors');
const dns = require('dns');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);
app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

app.use(cors());

let Schema = mongoose.Schema;
let shortUrlSchema = new Schema({
  original_url: {
    type: String,
    required: true
  },
  short_url: {
    type: Number
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

const regExp1 = /htt(p|ps):\/\/www.(\w+).(\w+)(\/\w+){0,}/g; 
const regExp2 = /www.\w+.\w+/g;

const checkUrl = (url) => {
  if (!regExp1.test(url)) {
    return false;
  } else {
    return dns.lookup(url.match(regExp2)[0], (err) => {
      if(err) return false;
      else return true;
    })
  }
}

app.route('/api/shorturl/new').post((req, res) => {
  if(checkUrl(req.body.url)) {
    ShortUrl.count({}, (err, count) => {
      let newUrl = new ShortUrl({original_url: req.body.url, short_url: count + 1});
      newUrl.save((err, data) => {
        if(err) res.send('there is error');
        console.log(data);
        res.json(data);
      })
    })
  } else {
    res.json({error: "Invalid URL"})
  }
})

app.get("/api/shorturl/:short", (req, res) => {
  ShortUrl.findOne({ short_url: req.params.short }, (err, data) => {
    if (err) res.send('there is error');
    res.redirect(data.original_url);
  })
})

app.listen(port, function () {
  console.log('Node.js listening ...');
});