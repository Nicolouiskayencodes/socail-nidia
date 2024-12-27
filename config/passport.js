const passport = require('passport');
const db = require('../db/queries.js')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_KEY
}

passport.use( new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await db.getUser(jwt_payload.username)
    if (user) {
      user.password = null
      return done(null, user)
    }
    return done(null, false)
  } catch (err) {
    return done(err)
  }
}))