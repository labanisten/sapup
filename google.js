//Constants
var GOOGLE_CLIENT_ID = '1072189313711.apps.googleusercontent.com',
    GOOGLE_CLIENT_SECRET = 'Evqt9n8JS3f50GFCqoyn5ElN',
    GOOGLE_REDIRECT_URI = 'http://localhost:4000/oauth2callback';
    GOOGLE_SCOPE = 'https://www.googleapis.com/auth/userinfo.email';
	GOOGLE_OAUTH2_URL = "https://accounts.google.com/o/oauth2/auth?scope=" + GOOGLE_SCOPE + "&redirect_uri=" + GOOGLE_REDIRECT_URI + "&response_type=code&client_id=1072189313711.apps.googleusercontent.com";


var express = require('express')
  , everyauth = require('../index')
  , conf = require('./conf')
  , everyauthRoot = __dirname + '/..';

everyauth.debug = true;

var usersById = {};
var nextUserId = 0;

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
}

var usersByGoogleId = {};

everyauth.everymodule
  .findUserById( function (id, callback) {
    callback(null, usersById[id]);
  });
  

everyauth.google
  .appId(GOOGLE_CLIENT_ID)
  .appSecret(GOOGLE_CLIENT_SECRET)
  .scope('https://www.googleapis.com/auth/userinfo.profile https://www.google.com/m8/feeds/')
  .findOrCreateUser( function (sess, accessToken, extra, googleUser) {
    googleUser.refreshToken = extra.refresh_token;
    googleUser.expiresIn = extra.expires_in;
    return usersByGoogleId[googleUser.id] || (usersByGoogleId[googleUser.id] = addUser('google', googleUser));
  })
  .redirectPath('/');

var app = express.createServer(
    express.bodyParser()
  , express.static(__dirname + "/public")
  , express.favicon()
  , express.cookieParser()
  , express.session({ secret: 'htuayreve'})
  , everyauth.middleware()
);

app.configure( function () {
  app.set('view engine', 'jade');
  app.set('views', everyauthRoot + '/example/views');
});

app.get('/', function (req, res) {
  res.render('home');
});

app.listen(3000);

console.log('Go to http://local.host:3000');
