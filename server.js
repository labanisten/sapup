var express = require('express'),
	mongodb = require('mongodb'),
	generic_pool = require('generic-pool'),
	http = require('http'),
    passport = require('passport'),
    util = require('util'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
	BSON = mongodb.BSONPure,
	RSS = require('rss');


//Constants
var MONGODB_URL = process.env.MONGODB_URL || '127.0.0.1',
	MONGODB_PORT = parseInt(process.env.MONGODB_PORT) || 27017,
    MONGODB_DB = process.env.MONGODB_DB || 'test'; 
    GOOGLE_CLIENT_ID = '1072189313711.apps.googleusercontent.com',
    GOOGLE_CLIENT_SECRET = 'Evqt9n8JS3f50GFCqoyn5ElN',
    GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://127.0.0.1:4000/auth/google/callback',
    GOOGLE_SCOPE = 'https://www.googleapis.com/auth/userinfo.email';



var app = express();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  // app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.cookieSession({ secret: 'keyboard cat' }));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


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
	        feed_url: 'http://systemavailability.azurewebsites.net/messages.xml',
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
app.get('/messages.xml', function(req, res) {rssServices.get(req, res);});

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


// Authentication 	

var token;

var user = {
	findByID: function(id, callback) {
		var user;
		pool.acquire(function(err, db) {
			if(err) {
				callback(new Error('Error accessing DB'));
			};
			var resource = 'users';			
			db.collection(resource, function(err, collection) {
				if (err) {
					callback(new Error('Error accessing collection'));
				};
				collection.findOne({"id":id}, function(err, user) {
					if (err) {
						return null;
					};
					callback(null, user);
					pool.release(db);
				}); 
			});
		});
	}
};


	// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(userObject, done) {
  user.findByID(userObject.id, function (err, user) {
    done(err, user);
  });
});


// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_REDIRECT_URI
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    console.log("User logged in: " + JSON.stringify(profile));
    console.log("Token: " + JSON.stringify(accessToken));
    token = accessToken;

    process.nextTick(function () {
      
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
 		user.findByID(profile.id, function(err, user) {
			if (err) { return done(err); }
			if (!user) { return done(null, false, { message: 'Unknown user ' + profile.id}); }
			return done(null, user);
    	});
 	})
 }))

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                            'https://www.googleapis.com/auth/userinfo.email'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.


app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/loginerror.html' }),
  function(req, res) {
  	res.cookie('name', token);
    res.redirect('/');
  });



app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


////


var port = process.env.PORT || 4000;
app.listen(port, function() {
	console.log("Listening on " + port);
	console.log("MongoDB port: " + MONGODB_PORT);
	console.log("MongoDB URL: " + MONGODB_URL);
	console.log("MongoDB database: " + MONGODB_DB);
});