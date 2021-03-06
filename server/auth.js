var config =  require('./config.js'),
	passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    pool =  require('./database');
    
var user = {
	findByID: function(id, callback) {
		var user;
		pool.acquire(function(err, db) {
			if(err) {
				callback(new Error('Error accessing DB'));
			}
			var resource = 'users';
			db.collection(resource, function(err, collection) {
				if (err) {
					callback(new Error('Error accessing collection'));
				}
				collection.findOne({"id":id}, function(err, user) {
					if (err) {
						return null;
					}
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
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_REDIRECT_URI
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    console.log("User logged in: " + JSON.stringify(profile._json.email));

    process.nextTick(function () {
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
		user.findByID(profile._json.email, function(err, user) {
			// Match ID (email address) from Google with our local user database
			if (err) { return done(err); }
			if (!user) { return done(null, false, { message: 'Unknown user ' + profile._json.email}); }
			// If we found the user in our DB, return the user object from our DB - it will be available as 'req.user' throughout the session
			// We could augment the user object with additional data from the Google profile, but for now we'll just maintain the user data we
			// need at the client in our own database
			return done(null, user);
		});
	});
 }));


exports = passport;