var express = require('express'),
	http = require('http'),
    passport = require('passport'),
    util = require('util'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
	rest =  require('./server/rest.js'),
	rss =  require('./server/rss.js'),
	config =  require('./server/config.js'),
	auth =  require('./server/auth.js');

var app = express();


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
		res.sendfile(__dirname + '/client/public/admin/login.html'); 
	} else {
		return next(); 
	};
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
app.get('/resources/messages.rss', function(req, res) {rest.restServices.get(req, res);});

app.post('/resources/systemgroups', function(req, res) {rest.restServices.post(req, res);});
app.post('/resources/systems', function(req, res) {rest.restServices.post(req, res);});
app.post('/resources/systemnames', function(req, res) {rest.restServices.post(req, res);});
app.post('/resources/alerttypes', function(req, res) {rest.restServices.post(req, res);});
app.post('/resources/systemstatuses', function(req, res) {rest.restServices.post(req, res);});
app.post('/resources/alerts', function(req, res) {rest.restServices.post(req, res);});

app.put('/resources/systemgroups/:id', function(req, res) {rest.restServices.put(req, res);});
app.put('/resources/systems/:id', function(req, res) {rest.restServices.put(req, res);});
app.put('/resources/systemnames/:id', function(req, res) {rest.restServices.put(req, res);});
app.put('/resources/alerttypes/:id', function(req, res) {rest.restServices.put(req, res);});
app.put('/resources/systemstatuses/:id', function(req, res) {rest.restServices.put(req, res);});
app.put('/resources/alerts/:id', function(req, res) {rest.restServices.put(req, res);});

app.delete('/resources/systemgroups/:id', function(req, res) {rest.restServices.delete(req, res);});
app.delete('/resources/systems/:id', function(req, res) {rest.restServices.delete(req, res);});
app.delete('/resources/systemnames/:id', function(req, res) {rest.restServices.delete(req, res);});
app.delete('/resources/alerttypes/:id', function(req, res) {rest.restServices.delete(req, res);});
app.delete('/resources/systemstatuses/:id', function(req, res) {rest.restServices.delete(req, res);});
app.delete('/resources/alerts/:id', function(req, res) {rest.restServices.delete(req, res);});



//   Authentication routes
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
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

var port = process.env.PORT || 4000;
app.listen(port, function() {
	console.log("Listening on " + port);
	console.log("MongoDB port: " + config.MONGODB_PORT);
	console.log("MongoDB URL: " + config.MONGODB_URL);
	console.log("MongoDB database: " + config.MONGODB_DB);
});