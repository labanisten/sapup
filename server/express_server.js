var app = require('express').createServer();

app.get('/', function(req, res){
  res.send('Main application');
});

app.get('/about', function(req, res){
  res.send('About this project');
});

app.listen(1337);