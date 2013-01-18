var express = require('express'),
    config =  require('./server/config.js'),
    database =  require('./server/database.js'),
    http = require('http'),
    util = require('util'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    LocalStrategy = require('passport-local').Strategy,
    rest =  require('./server/rest.js'),
    rss =  require('./server/rss.js'),
	app = express(),
	noauth = false;

// Turn of authentication?
noauth = process.argv[2] === "noauth";

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.cookieParser());
  app.use(express.cookieSession({ secret: 'have a great holiday' }));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);

});

// Set static routes
app.use("/", express.static(__dirname + "/client/public"));
app.use("/public", express.static(__dirname + "/client/public"));
app.use("/images", express.static(__dirname + "/client/images"));
app.use("/css/images", express.static(__dirname + "/client/css/images"));
app.use("/js", express.static(__dirname + "/client/js"));
app.use("/css", express.static(__dirname + "/client/css"));
app.use("/bootstrap", express.static(__dirname + "/client/bootstrap"));


// Set admin route with authentication
app.get('/admin/*', function(req, res, next) {
	console.log("Please authenticate");
	console.log("User: " + JSON.stringify(req.user));
	console.log("Session: " + JSON.stringify(req.session));

	if (!req.user) {
		res.sendfile(__dirname + '/client/public/login.html');
	} else {
		return next();
	}
});

app.get('/userdata', function(req, res, next) {
	res.send(req.user);
});

//Set REST routes
app.get('/resources/systemgroups', function(req, res) {rest.restServices.get(req, res);});
app.get('/resources/systems', function(req, res) {rest.restServices.get(req, res);});
app.get('/resources/systemnames', function(req, res) {rest.restServices.get(req, res);});
app.get('/resources/alerttypes', function(req, res) {rest.restServices.get(req, res);});
app.get('/resources/systemstatuses', function(req, res) {rest.restServices.get(req, res);});
app.get('/resources/alerts', function(req, res) {rest.restServices.get(req, res);});
app.get('/resources/users', function(req, res) {rest.restServices.get(req, res);});
app.get('/resources/messages.rss', function(req, res) {rest.restServices.get(req, res);});

app.post('/resources/systemgroups', function(req, res) {rest.restServices.post(req, res);});
app.post('/resources/systems', function(req, res) {rest.restServices.post(req, res);});
app.post('/resources/systemnames', function(req, res) {rest.restServices.post(req, res);});
app.post('/resources/alerttypes', function(req, res) {rest.restServices.post(req, res);});
app.post('/resources/systemstatuses', function(req, res) {rest.restServices.post(req, res);});
app.post('/resources/alerts', function(req, res) {rest.restServices.post(req, res);});
app.post('/resources/users', function(req, res) {rest.restServices.post(req, res);});

app.put('/resources/systemgroups/:id', function(req, res) {rest.restServices.put(req, res);});
app.put('/resources/systems/:id', function(req, res) {rest.restServices.put(req, res);});
app.put('/resources/systemnames/:id', function(req, res) {rest.restServices.put(req, res);});
app.put('/resources/alerttypes/:id', function(req, res) {rest.restServices.put(req, res);});
app.put('/resources/systemstatuses/:id', function(req, res) {rest.restServices.put(req, res);});
app.put('/resources/alerts/:id', function(req, res) {rest.restServices.put(req, res);});
app.put('/resources/users/:id', function(req, res) {rest.restServices.put(req, res);});

app.delete('/resources/systemgroups/:id', function(req, res) {rest.restServices.delete(req, res);});
app.delete('/resources/systems/:id', function(req, res) {rest.restServices.delete(req, res);});
app.delete('/resources/systemnames/:id', function(req, res) {rest.restServices.delete(req, res);});
app.delete('/resources/alerttypes/:id', function(req, res) {rest.restServices.delete(req, res);});
app.delete('/resources/systemstatuses/:id', function(req, res) {rest.restServices.delete(req, res);});
app.delete('/resources/alerts/:id', function(req, res) {rest.restServices.delete(req, res);});
app.delete('/resources/users/:id', function(req, res) {rest.restServices.delete(req, res);});



//   Authentication routes
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
if (noauth) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		var user = {id:"localuser", displayName:"localuser", isAdmin:true};
		done(null, user);
	});


	passport.use(new LocalStrategy(
		function(username, password, done) {
			// Find the user by username.  If there is no user with the given
			// username, or the password is not correct, set the user to `false` to
			// indicate failure and set a flash message.  Otherwise, return the
			// authenticated `user`.
			var user = {id:"localuser", displayName:"localuser", isAdmin:true};
			done(null, user);
		}
	));

	app.get('/auth/google', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		user = {id:"localuser", displayName:"localuser", isAdmin:true};
		req.logIn(user, function(err) {
		if (err) { return next(err); }
			return res.redirect('/');
		});
		})(req, res, next);
	});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});


}
else {
    auth =  require('./server/auth.js');

	app.get('/auth/google',
		passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
													'https://www.googleapis.com/auth/userinfo.email'] }),
		function(req, res){
		// The request will be redirected to Google for authentication, so this
		// function will not be called.
		});

	app.get('/auth/google/callback',
		passport.authenticate('google', { failureRedirect: '/loginerror.html' }),
		function(req, res) {
		res.redirect('/');
		});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});
}

var port = process.env.PORT || 4000;
app.listen(port, function() {
	console.log("Listening on " + port);
	console.log("MongoDB port: " + config.MONGODB_PORT);
	console.log("MongoDB URL: " + config.MONGODB_URL);
	console.log("MongoDB database: " + config.MONGODB_DB);
});