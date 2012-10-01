	
	var mongodb = require('mongodb'),
		dbServer = new mongodb.Server("10.216.209.142", 27017, {}),
		db = new mongodb.Db('sa-portal', dbServer, {});

		
	function parseResource(str) {
	  var resource = str.replace(/^\/|\/$/g, '');
	  var i = resource.indexOf('/');
	  resource = resource.substring(i + 1, resource.length);
	  return resource;
	}
	
	exports.index = function(req, res){
	  console.log("INDEX");
	  res.send("index");
	};
	
	exports.create = function(req, res){  
	  var resource = parseResource(req.url);
	  console.log("CREATE: " + resource);
	};

    exports.show = function(req, res){  
	  var resource = parseResource(req.url);
	  console.log("GET: " + resource);
	  
	  db.open(function(err, db) {
		db.collection(resource, function(err, collection) {
		  collection.find().toArray(function(err, items) {
			res.send(items);
			db.close();
		  });
		});
	  });
	};
	
