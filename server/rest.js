var config =  require('./config.js'),
	pool =  require('./database'),
	mongodb = require('mongodb'),
	BSON = mongodb.BSONPure;
	

function getResponse(error, result) {
	var resStr;
	if(!error){
		resStr = result;
	}else{
		resStr = error;
	}
	return resStr;
}


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
				console.log("Resource " + resource);
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
};

exports.restServices = restServices;