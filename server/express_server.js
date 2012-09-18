var app = require('express').createServer(),
	resource = require('express-resource'),	
	mongodb = require('mongodb'),
    dbServer = new mongodb.Server("127.0.0.1", 27017, {}),
    //db = new mongodb.Db('saa_testdb', dbServer, {}),
    db = require('mongojs').connect('saa_testdb', ['systemname']);


db.systemname.find(function(err, docs) {
    
});


app.get('/', function(req, res){
  	res.send('Main application');
});

app.get('/about', function(req, res){
  	res.send('About this project');
});


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
	//     	collection.find(query).toArray(function(err, items) {
	//         	res.send(items);
	//         	db.close();
	//     	});
	//     });
 //  	});
});

app.listen(1337);


console.log('Server running at http://127.0.0.1:1337/');