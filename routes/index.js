const router = require('express').Router();
const passport = require('passport');
const controller= require('../controllers/')
const multer  = require('multer')
const storage = multer.memoryStorage({
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});
const upload = multer({ storage: storage })
const authenticate = passport.authenticate('jwt', { session: false })


router.post("/register", controller.authentication.createUser);
router.post("/login", controller.authentication.login);
router.get("/user", authenticate, controller.user.info);
router.put('/username', authenticate, controller.user.setName);
router.put('/avatar', authenticate, upload.single('file'), controller.user.setAvatar)
router.put('/bio', authenticate, controller.user.setBio)

module.exports = router