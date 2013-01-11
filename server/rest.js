var generic_pool = require('generic-pool'),
	mongodb = require('mongodb'),
	BSON = mongodb.BSONPure;

var MONGODB_URL = process.env.MONGODB_URL || '127.0.0.1',
	MONGODB_PORT = parseInt(process.env.MONGODB_PORT) || 27017,
    MONGODB_DB = process.env.MONGODB_DB || 'test'; 

var pool = generic_pool.Pool({
	name: 'mongodb',
	max: 20,
	create: function(callback) {
		var dbServer = new mongodb.Server(MONGODB_URL, MONGODB_PORT, {safe:true});
		var db = new mongodb.Db(MONGODB_DB, dbServer, {safe:true});
		
		db.open(function(err, db) {
			callback(err, db);
		});

	},
	destroy: function(db) {
		db.close();
	}
});



var restServices = {
	get: function(req, res){		
			pool.acquire(function(err, db) {
				if(err) {return res.end("At connection, " + err);}
				var resource = req.path.split("/")[2];
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
				var resource = req.path.split("/")[2];
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
				var resource = req.path.split("/")[2];
				var itemId = {'_id': new BSON.ObjectID(req.params.id.toString())};
				console.log("Put " + itemId._id);
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
				var resource = req.path.split("/")[2];
				var itemId = {'_id': new BSON.ObjectID(req.params.id.toString())};
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

exports.restServices = restServices;