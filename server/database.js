// Establish database connection
var	config =  require('./config.js'),
	mongodb = require('mongodb'),
	generic_pool = require('generic-pool');


var pool = generic_pool.Pool({
	name: 'mongodb',
	max: 20,
	create: function(callback) {
		var dbServer = new mongodb.Server(config.MONGODB_URL, config.MONGODB_PORT, {safe:true}),
			db = new mongodb.Db(config.MONGODB_DB, dbServer, {safe:true});
		
		db.open(function(err, db) {
			if (!err) {
				db.authenticate(config.MONGODB_ADMIN_USER, config.MONGODB_ADMIN_PASSWORD, function(err, result) {
					if (err) console.log("Unable to authneticate for MongoDB " + err);
					callback(err, db);
				});
			}
		});
	},
	destroy: function(db) {
		db.close();
	}
});

module.exports = pool;