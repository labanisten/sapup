	var express = require('express');
	var app = express.createServer();

	var mongodb = require('mongodb');
	var BSON = mongodb.BSONPure;
    var dbServer = new mongodb.Server("168.63.58.169", 27017, {});
	var db = new mongodb.Db('test', dbServer, {});
	
	var allowCrossDomain = function(req, res, next) {
		res.header('Access-Control-Allow-Origin', "*");
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'X-Requested-With');
		next();
	}
	
	app.use(express.bodyParser({}));
	app.use(allowCrossDomain);
	
	app.use("/", express.static("/client/"));
	

	
	/*app.use (function(req, res, next) {
		var data='';
		req.setEncoding('utf8');
		req.on('data', function(chunk) { 
		   data += chunk;
		});

		req.on('end', function() {
			req.body = data;
			next();
		});
	});*/
	
	
	var restServices = {
		get: function(req, res){
				var resource = req.path.replace(/^\/|\/$/g, '');

			    db.open(function(err, db) {
					db.collection(resource, function(err, collection) {
						collection.find().toArray(function(err, items) {
							res.send(items);
							db.close();
						});
					});
			    });
			 },
		post:  function(req, res){
				var resource = req.path.replace(/^\/|\/$/g, '');

			    db.open(function(err, db) {
					db.collection(resource, function(err, collection) {
						collection.insert(req.body, function(err, items) {
							res.send(items);
							db.close();
						});
					});
			    });
			 },
		put:  function(req, res){	
				var resource = req.path.replace(/^\/|\/$/g, '');
				resource = splitOnSlash(resource);
				var itemId = {'_id': new BSON.ObjectID(req.params.id)};
				
			    db.open(function(err, db) {
					db.collection(resource, function(err, collection) {
						collection.update(itemId, req.body, true, function(err, result) {
							var reponse = getResponse(err, '{"put":ok}');
							res.header('Content-Type', 'application/json');
							res.send(reponse);
							db.close();
						});
					});
			    });
			 },
		delete:  function(req, res){
				var resource = req.path.replace(/^\/|\/$/g, '');
				resource = splitOnSlash(resource);				
				var itemId = {'_id': new BSON.ObjectID(req.params.id)};
				
			    db.open(function(err, db) {
					db.collection(resource, function(err, collection) {
						collection.remove(itemId, function(err, result) {
							var reponse = getResponse(err, '{"delete":ok}');
							res.header('Content-Type', 'application/json');
							res.send(reponse);
							db.close();
						});
					});
			    });
			 }
	}

	/*
	app.get('/', function(req, res){
	  res.send('REST server');
	});*/
	
	/*
	app.get('/css', function(req, res){
		var uid = req.params.uid;
		res.sendfile('./client/css/');
	});
	
	app.get('/js', function(req, res){
		var uid = req.params.uid;
		res.sendfile('./client/js/');
	});
	
	app.get('/bootstrap', function(req, res){
		var uid = req.params.uid;
		var path = req.params[0] ? req.params[0] : 'index.html';
		res.sendfile('./client/public/' + path);
	});
	
	app.get('/*', function(req, res){
		var uid = req.params.uid;
		var path = req.params[0] ? req.params[0] : 'index.html';
		res.sendfile('./client/public/' + path);
	});
	*/
	
	app.all('/*', function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  next();
	});
	
	app.get('/systems', function(req, res) {restServices.get(req, res);});
	app.get('/systemname', function(req, res) {restservices.get(req, res);});
	app.get('/alerttype', function(req, res) {restservices.get(req, res);});
	app.get('/systemstatus', function(req, res) {restservices.get(req, res);});
	app.get('/alerts', function(req, res) {restServices.get(req, res);});
	
	app.post('/systems', function(req, res) {restServices.post(req, res);});
	app.post('/systemname', function(req, res) {restServices.post(req, res);});
	app.post('/alerttype', function(req, res) {restServices.post(req, res);});
	app.post('/systemstatus', function(req, res) {restServices.post(req, res);});
	app.post('/alerts', function(req, res) {restServices.post(req, res);});
	
	app.put('/systems/:id', function(req, res) {restServices.put(req, res);});
	app.put('/systemname/:id', function(req, res) {restServices.put(req, res);});
	app.put('/alerttype/:id', function(req, res) {restServices.put(req, res);});
	app.put('/systemstatus/:id', function(req, res) {restServices.put(req, res);});
	app.put('/alerts/:id', function(req, res) {restServices.put(req, res);});
	
	app.delete('/systems/:id', function(req, res) {restServices.delete(req, res);});
	app.delete('/systemname/:id', function(req, res) {restServices.delete(req, res);});
	app.delete('/alerttype/:id', function(req, res) {restServices.delete(req, res);});
	app.delete('/systemstatus/:id', function(req, res) {restServices.delete(req, res);});
	app.delete('/alerts/:id', function(req, res) {restServices.delete(req, res);});
	
	function getResponse(error, result) {
		var resStr;
		if(!error){
			resStr = result;
		}else{
			resStr = error;
		}
		return resStr;
	}
	
	function splitOnSlash(str) {
	  var i = str.indexOf('/');
	  str = str.substring(0, i);
	  return str;
	}

	var port = process.env.PORT || 4000;
	app.listen(port, function() {
		console.log("Listening on " + port);
	});