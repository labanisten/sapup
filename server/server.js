//var app = require('express').createServer(),
//	resource = require('express-resource');

var express = require("express"),
	http = require("http"),
    app = express.createServer();

	//mongodb = require('mongodb');
    //dbServer = new mongodb.Server("127.0.0.1", 27017, {}),
    //db = new mongodb.Db('saa_testdb', dbServer, {}),
   // db = require('mongojs').connect('saa_testdb', ['systemname']);

/*
db.systemname.find(function(err, docs) {
    
});
*/
console.log("__dirname: " + __dirname);
app.use("/", express.static('../client/public'));
app.use("/js", express.static('../client/js'));
app.use("/bootstrap", express.static('../client/bootstrap'));
app.use("/images", express.static('../client/images'));
//app.use("/bootstrap/css", express.static('../client/bootstrap/css'));
//app.use("/bootstrap/js", express.static('../client/bootstrap/js'));
app.use("/css", express.static('../client/css'));
//app.use("/index", express.static('../client/public'));
//app.use("/admin", express.static('../client/public/admin'));
//app.use("/mongodb", express.static('http://centos-nosql-vm.cloudapp.net:3000'));

app.get('/mongodb/test/system', function(req, res){

	//res.redirect('http://bbc.co.uk');

	http.get({host:'centos-nosql-vm.cloudapp.net:3000', path:'/test/system'},function(mongoRes){
  		console.log("Got response: " + res.statusCode);
		}).on('error', function(e) {
		  console.log("Got error: " + e.message);
	})


});


app.listen(1337);
console.log('Server running at http://127.0.0.1:1337/');

/*
app.get('/system', function(req, res){
	db.open(function(err, db) {
	    db.collection("system", function(err, collection) {
	    	collection.find().toArray(function(err, items) {
	        	res.send(items);
	        	db.close();
	    	});
	    });
  	});
});

app.get('/systemname', function(req, res){
	var query = req.query["query"]; 
	console.log("Asked for " + query);
	if (query) {
		db.systemname.find(JSON.parse(query), function(err, docs) {
		    res.send(docs);
		});	
	} else {
		db.systemname.find(function(err, docs) {
		    res.send(docs);
		});			
	}
	
	// db.open(function(err, db) {
	//     db.collection("systemname", function(err, collection) {
	//     	collection.find(query).toArray(function(err, item
	//         	res.send(items);
	//         	db.close();
	//     	});
	//     });
 //  	});
});
*/
