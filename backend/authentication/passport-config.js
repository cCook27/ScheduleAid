const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


passport.use(
  "login",
  new LocalStrategy((username, password, done) => {
    const authenticated = username === "John" && password === "Smith";

    if (authenticated) {
      return done(null, { myUser: "user", myID: 1234 });
    } else {
      return done(null, false);
    }
  })
);

module.exports = passport;