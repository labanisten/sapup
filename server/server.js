	var express = require('express');
	var mongodb = require('mongodb');
	var generic_pool = require('generic-pool');

	var app = express.createServer();
	var BSON = mongodb.BSONPure;
	
	var pool = generic_pool.Pool({
		name: 'mongodb',
		max: 10,
		create: function(callback) {
			console.log("open db");
			var dbServer = new mongodb.Server("centos-nosql-vm.cloudapp.net", 27017, {});
			//var dbServer = new mongodb.Server("10.216.209.142", 27017, {});
			var db = new mongodb.Db('test', dbServer, {});
			
			db.open(function(err, db) {
				callback(err, db);
			});

		},
		destroy: function(db) {
			console.log("close db");
			db.close();
		}
	});

    //var dbServer = new mongodb.Server("centos-nosql-vm.cloudapp.net", 27017, {});
	//var db = new mongodb.Db('test', dbServer, {});
	
	/*
	var allowCrossDomain = function(req, res, next) {
		res.header('Access-Control-Allow-Origin', "*");
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'X-Requested-With');
		next();
	}
	*/
	
	app.use(express.bodyParser({}));
	//app.use(allowCrossDomain);
	
	//app.use("/client/js", express.static("/client/js"));
	console.log("__dirname: " + __dirname);
	app.use("/", express.static(__dirname + "/client/public"));
	app.use("/images", express.static(__dirname + "/images"));
	app.use("/css/images", express.static(__dirname + "/css/images"));
	app.use("/js", express.static(__dirname + "/client/js"));
	app.use("/css", express.static(__dirname + "/client/css"));
	app.use("/bootstrap", express.static(__dirname + "/client/bootstrap"));
	

	
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
				pool.acquire(function(err, db) {
					var resource = req.path.replace(/^\/|\/$/g, '');
					console.log("req.path :" + req.path);
					console.log("resource :" + resource);
					//db.open(function(err, db) {
						db.collection(resource, function(err, collection) {
							console.log("t1 " + err);
							collection.find().toArray(function(err, items) {
								console.log("t2 " + err);
								res.send(items);
								//db.close();
								pool.release(db);
							});
						});
					//});
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
	app.all('/*', function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  next();
	});
	*/
	
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