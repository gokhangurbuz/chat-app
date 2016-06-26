
require('./config').initRedisServerInfo();

var express = require('express');
var bodyparser=require('body-parser');
var logger=require('morgan');
var socketInit=require('./lib/chat');

var app = express();

app.use(logger('dev'));
app.use(express.static(__dirname + '/assets'));
app.use(bodyparser.json())

app.all('/*',function(req,res,next){
  res.header('Access-Control-Allow-Origin', 'http://localhost');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-HEADERS','Content-type,Accept,X-Access-Token,X-Key');

  if(req.method=='OPTIONS'){
    res.status(200).end();
  } else{
    next();
  }
});

app.use(function(req,res,next){
  res.status(404);
  next();
});

app.use('/api',require('./routes'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});
app.get('/a', function (req, res) {
  res.status(200);
});

app.get('/style.css', function (req, res) {
  res.sendFile(__dirname + '/style.css');
});
app.get('/script.js', function (req, res) {
  res.sendFile(__dirname + '/script.js');
});
app.get('/common.js', function (req, res) {
  res.sendFile(__dirname + '/common.js');
});

var server = require('http').Server(app);

server.listen(process.env.PORT||5000);

var io=require('socket.io').listen(server);

socketInit.init(io, function(){
  console.log('Chat started.', 'listening on: http://127.0.0.1:'+server.address().port);
});


module.exports=server;
