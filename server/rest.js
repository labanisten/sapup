var app = require('express').createServer(),
    resource = require('express-resource');
    
app.resource('systems', require('./systems'));

app.get('/', function(req, res){
  res.send('REST server');
});


var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Listening on " + port);
});