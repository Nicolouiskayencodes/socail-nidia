const router = require('express').Router();
const cors = require('cors')
const passport = require('passport');
const controller= require('../controllers/')

const authenticate = passport.authenticate('jwt', { session: false })

router.options('/*', cors())

router.post("/register", cors(), controller.authentication.createUser);
router.post("/login", cors(), controller.authentication.login);