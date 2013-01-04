	var express = require('express');
	var mongodb = require('mongodb');
	var generic_pool = require('generic-pool');
	var http = require('http');
	var querystring = require('querystring');
	var everyauth = require('everyauth');

	var BSON = mongodb.BSONPure;
	var RSS = require('rss');

	everyauth.debug = true;

	//Constants
	var MONGODB_URL = process.env.MONGODB_URL || '127.0.0.1',
		MONGODB_PORT = parseInt(process.env.MONGODB_PORT) || 27017,
	    MONGODB_DB = process.env.MONGODB_DB || 'test'; 
	    GOOGLE_CLIENT_ID = '1072189313711.apps.googleusercontent.com',
	    GOOGLE_CLIENT_SECRET = 'Evqt9n8JS3f50GFCqoyn5ElN',
	    GOOGLE_REDIRECT_URI = 'https://systemavailability.azurewebsites.net/oauth2callback';
	    GOOGLE_SCOPE = 'https://www.googleapis.com/auth/userinfo.profile';
		GOOGLE_OAUTH2_URL = "https://accounts.google.com/o/oauth2/auth?scope=" + GOOGLE_SCOPE + "&redirect_uri=" + GOOGLE_REDIRECT_URI + "&response_type=code&client_id=1072189313711.apps.googleusercontent.com";

	var app = express.createServer(
	    express.bodyParser()
	  , express.favicon()
	  , express.cookieParser()
	  , express.session({ secret: 'htuayreve'})
	  , everyauth.middleware()
	);

	var pool = generic_pool.Pool({
		name: 'mongodb',
		max: 20,
		create: function(callback) {
			var dbServer = new mongodb.Server(MONGODB_URL, MONGODB_PORT, {safe:true});
			var db = new mongodb.Db(MONGODB_DB, dbServer, {});
			
			db.open(function(err, db) {
				callback(err, db);
			});

		},
		destroy: function(db) {
			db.close();
		}
	});

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
					var resource = req.path.replace(/^\/|\/$/g, '');
					resource = splitOnSlash(resource);				
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

	var rssServices = {

		get: function(req, res){
			var alerts;
			var i;

			var feed = new RSS({
		        title: 'SAP system availability',
		        description: 'SAP system uptime overview',
		        feed_url: 'http://systemavailability.azurewebsites.net/alerts.rss',
		        site_url: 'http://systemavailability.azurewebsites.net',
		        author: 'Statoil ASA'
		    });

			pool.acquire(function(err, db) {
				if(err) {return res.end("At connection, " + err);}

				db.collection('alerts', function(err, collection) {
					collection.find().toArray(function(err, items) {
						alerts = items;
						pool.release(db);

						for(i = 0; i < items.length; i++) {
							var feedItem = {
							    title:  items[i].title,
							    description: items[i].comment,
							    url: 'http://systemavailability.azurewebsites.net/', // link to the item
							    guid: Math.abs(hashCode(items[i].title + items[i].comment)), 
							    author: 'System availability messages',
							    date: items[i].timestamp // any format that js Date can parse.
							};

							feed.item(feedItem);
						}
						res.contentType('rss');
						res.send(feed.xml());
					});
				});
			});			
		}
	}

	function hashCode(str){
	    var hash = 0, i, char;
	    if (str.length == 0) return hash;
	    for (i = 0; i < str.length; i++) {
	        char = str.charCodeAt(i);
	        hash = ((hash<<5)-hash)+char;
	        hash = hash & hash; // Convert to 32bit integer
	    }
	    return hash;
	};

	app.get('/systemgroups', function(req, res) {restServices.get(req, res);});
	app.get('/systems', function(req, res) {restServices.get(req, res);});
	app.get('/systemnames', function(req, res) {restServices.get(req, res);});
	app.get('/alerttypes', function(req, res) {restServices.get(req, res);});
	app.get('/systemstatuses', function(req, res) {restServices.get(req, res);});
	app.get('/alerts', function(req, res) {restServices.get(req, res);});
	app.get('/messages.rss', function(req, res) {rssServices.get(req, res);});
	
	app.post('/systemgroups', function(req, res) {restServices.post(req, res);});
	app.post('/systems', function(req, res) {restServices.post(req, res);});
	app.post('/systemnames', function(req, res) {restServices.post(req, res);});
	app.post('/alerttypes', function(req, res) {restServices.post(req, res);});
	app.post('/systemstatuses', function(req, res) {restServices.post(req, res);});
	app.post('/alerts', function(req, res) {restServices.post(req, res);});
	
	app.put('/systemgroups/:id', function(req, res) {restServices.put(req, res);});
	app.put('/systems/:id', function(req, res) {restServices.put(req, res);});
	app.put('/systemnames/:id', function(req, res) {restServices.put(req, res);});
	app.put('/alerttypes/:id', function(req, res) {restServices.put(req, res);});
	app.put('/systemstatuses/:id', function(req, res) {restServices.put(req, res);});
	app.put('/alerts/:id', function(req, res) {restServices.put(req, res);});
	
	app.delete('/systemgroups/:id', function(req, res) {restServices.delete(req, res);});
	app.delete('/systems/:id', function(req, res) {restServices.delete(req, res);});
	app.delete('/systemnames/:id', function(req, res) {restServices.delete(req, res);});
	app.delete('/alerttypes/:id', function(req, res) {restServices.delete(req, res);});
	app.delete('/systemstatuses/:id', function(req, res) {restServices.delete(req, res);});
	app.delete('/alerts/:id', function(req, res) {restServices.delete(req, res);});


// Authentication via Google API
	function getTokenFromGoogleAPI(code) {

		console.log("Code " + code);

		// Build the post string from an object
		var post_data = querystring.stringify({
		    'code' : code,
		    'client_id': GOOGLE_CLIENT_ID,
		    'client_secret': GOOGLE_CLIENT_SECRET,
		    'grant_type' : 'authorization_code',
		    'redirect_uri' : GOOGLE_REDIRECT_URI
		});

		console.log('POST DATA: ' + JSON.stringify(post_data));
		// An object of options to indicate where to post to
		
		var post_options = {
		  host: 'accounts.google.com',
		  port: '80',
		  path: '/o/oauth2/token',
		  method: 'POST',
		  headers: {
		    'Content-Type': 'application/x-www-form-urlencoded'
	    	}
		};

		// Set up the request
		var post_req = http.request(post_options, function(res) {
				console.log('STATUS: ' + res.statusCode);
				console.log('HEADERS: ' + JSON.stringify(res.headers));
				res.setEncoding('utf8');
				res.on('data', function (chunk) {
			    console.log('Response: ' + chunk);
		 	});
		});

		post_req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});

		// post the data
		post_req.write(post_data);
		post_req.end();

	};

	var usersByGoogleId = {};

	app.get('/code', function(req, res) {
		console.log("Return from CODE post");
		console.log("Code: " + JSON.stringify(req.body));

	});

	function addUser (source, sourceUser) {
		var user;
		if (arguments.length === 1) { // password-based
		user = sourceUser = source;
		user.id = ++nextUserId;
		return usersById[nextUserId] = user;
		} else { // non-password-based
		user = usersById[++nextUserId] = {id: nextUserId};
		user[source] = sourceUser;
		}
		return user;
	};

	app.get('/oauth2callback', function(req, res) {
		console.log("OAUTH callback from Google");
		console.log("Body: " + JSON.stringify(req.body));
		// res.redirect('/' + '?code=' + req.param('code'));
		getTokenFromGoogleAPI(req.param('code'));

	});

	app.get('/authenticate', function(req, res) {
		res.redirect(GOOGLE_OAUTH2_URL);
		console.log("Authenticate");
		// everyauth.google
		// 	.appId(GOOGLE_CLIENT_ID)
		// 	.appSecret(GOOGLE_CLIENT_SECRET)
		// 	.scope(GOOGLE_SCOPE) // What you want access to
		// 	.handleAuthCallbackError( function (req, res) {
		// 		console.log("Error");
		// 	// If a user denies your app, Google will redirect the user to
		// 	// /auth/google/callback?error=access_denied
		// 	// This configurable route handler defines how you want to respond to
		// 	// that.
		// 	// If you do not configure this, everyauth renders a default fallback
		// 	// view notifying the user that their authentication failed and why.
		// 	})
		// .findOrCreateUser( function (sess, accessToken, extra, googleUser) {
		// 	console.log("Sucess");
		// 	googleUser.refreshToken = extra.refresh_token;
		// 	googleUser.expiresIn = extra.expires_in;
		// 	return usersByGoogleId[googleUser.id] || (usersByGoogleId[googleUser.id] = addUser('google', googleUser));
		// })
		// .redirectPath('/');		
	});
	

	
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
		console.log("MongoDB port: " + MONGODB_PORT);
		console.log("MongoDB URL: " + MONGODB_URL);
		console.log("MongoDB database: " + MONGODB_DB);
	});