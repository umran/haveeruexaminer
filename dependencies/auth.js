var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

// serialize and deserialize
passport.serializeUser(function(user, done) {
done(null, user);
});
passport.deserializeUser(function(obj, done) {
done(null, obj);
});
  
passport.use(new TwitterStrategy({
    consumerKey: '1BRwCGjoM33HKDNxAcKAhEl8B',
    consumerSecret:  'i3Y2l48oWDCBpblAWOt0BdAclD1E9pQNfRxAtnlw0ynL23dKqh',
    callbackURL: "https://ingilaab.org/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    /*User.findOrCreate(..., function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });*/
    process.nextTick(function () {
   		return done(null, profile);
 		});
	}
));

module.exports = passport;