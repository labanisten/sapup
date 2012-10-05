	var express = require('express');
	var mongodb = require('mongodb');
	var generic_pool = require('generic-pool');

	var app = express.createServer();
	var BSON = mongodb.BSONPure;
	var MONGODB_URL = process.env.MONGODB_URL; 
	var MONGODB_PORT = process.env.MONGODB_PORT; 

	
	var pool = generic_pool.Pool({
		name: 'mongodb',
		max: 20,
		create: function(callback) {
			var dbServer = new mongodb.Server(MONGODB_URL, MONGODB_PORT, {});
			//var dbServer = new mongodb.Server("10.216.209.142", 27017, {});
			var db = new mongodb.Db('test', dbServer, {});
			
			db.open(function(err, db) {
				callback(err, db);
			});

		},
		destroy: function(db) {
			db.close();
		}
	});

	app.use(express.bodyParser({}));

	app.use("/", express.static(__dirname + "/client/public"));
	app.use("/public", express.static(__dirname + "/client/public"));
	app.use("/images", express.static(__dirname + "/client/images"));
	app.use("/css/images", express.static(__dirname + "/client/css/images"));
	app.use("/js", express.static(__dirname + "/client/js"));
	app.use("/css", express.static(__dirname + "/client/css"));
	app.use("/bootstrap", express.static(__dirname + "/client/bootstrap"));
	
	var restServices = {
		get: function(req, res){
				pool.acquire(function(err, db) {
					if(err) {return res.end("At connection, " + err);}
					var resource = req.path.replace(/^\/|\/$/g, '');
					
					db.collection(resource, function(err, collection) {
						collection.find().toArray(function(err, items) {
							res.send(items);
							pool.release(db);
						});
					});
				});
			 },
		post:  function(req, res){
				pool.acquire(function(err, db) {
					if (err) {return res.end("At connection, " + err);}
					var resource = req.path.replace(/^\/|\/$/g, '');
					
					db.collection(resource, function(err, collection) {
						collection.insert(req.body, function(err, items) {
							res.send(items);
							pool.release(db);
						});
					});	
				});
			 },
		put:  function(req, res){	
				pool.acquire(function(err, db) {
					if (err) {return res.end("At connection, " + err);}
					var resource = req.path.replace(/^\/|\/$/g, '');
					resource = splitOnSlash(resource);
					var itemId = {'_id': new BSON.ObjectID(req.params.id)};
					
					db.collection(resource, function(err, collection) {
						collection.update(itemId, req.body, true, function(err, result) {
							var reponse = getResponse(err, '{"put":"ok"}');
							res.header('Content-Type', 'application/json');
							res.send(reponse);
							pool.release(db);
						});
					});
				});
			 },
		delete:  function(req, res){
				pool.acquire(function(err, db) {
					if (err) {return res.end("At connection, " + err);}
					var resource = req.path.replace(/^\/|\/$/g, '');
					resource = splitOnSlash(resource);				
					var itemId = {'_id': new BSON.ObjectID(req.params.id)};
					
					db.collection(resource, function(err, collection) {
						collection.remove(itemId, function(err, result) {
							var reponse = getResponse(err, '{"delete":"ok"}');
							res.header('Content-Type', 'application/json');
							res.send(reponse);
							pool.release(db);
						});
					});

				});
			 }
	}

	app.get('/systems', function(req, res) {restServices.get(req, res);});
	app.get('/systemnames', function(req, res) {restServices.get(req, res);});
	app.get('/alerttypes', function(req, res) {restServices.get(req, res);});
	app.get('/systemstatuses', function(req, res) {restServices.get(req, res);});
	app.get('/alerts', function(req, res) {restServices.get(req, res);});
	
	app.post('/systems', function(req, res) {restServices.post(req, res);});
	app.post('/systemnames', function(req, res) {restServices.post(req, res);});
	app.post('/alerttypes', function(req, res) {restServices.post(req, res);});
	app.post('/systemstatuses', function(req, res) {restServices.post(req, res);});
	app.post('/alerts', function(req, res) {restServices.post(req, res);});
	
	app.put('/systems/:id', function(req, res) {restServices.put(req, res);});
	app.put('/systemnames/:id', function(req, res) {restServices.put(req, res);});
	app.put('/alerttypes/:id', function(req, res) {restServices.put(req, res);});
	app.put('/systemstatuses/:id', function(req, res) {restServices.put(req, res);});
	app.put('/alerts/:id', function(req, res) {restServices.put(req, res);});
	
	app.delete('/systems/:id', function(req, res) {restServices.delete(req, res);});
	app.delete('/systemnames/:id', function(req, res) {restServices.delete(req, res);});
	app.delete('/alerttypes/:id', function(req, res) {restServices.delete(req, res);});
	app.delete('/systemstatuses/:id', function(req, res) {restServices.delete(req, res);});
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