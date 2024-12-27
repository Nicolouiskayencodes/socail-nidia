const router = require('express').Router();
const passport = require('passport');
const controller= require('../controllers/')

const authenticate = passport.authenticate('jwt', { session: false })

router.post("/register", controller.authentication.createUser);
router.post("/login", controller.authentication.login);
router.get("/protected", authenticate, (req, res)=> {
  res.json(req.user)
})

module.exports = router