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

//authentication routes
router.post("/register", controller.authentication.createUser);
router.post("/login", controller.authentication.login);

//user routes
router.get("/user", authenticate, controller.user.info);
router.get('/user/:id', authenticate, controller.user.getUser)
router.get('/users', authenticate, controller.user.getUsers)
router.put('/username', authenticate, controller.user.setName);
router.put('/avatar', authenticate, upload.single('file'), controller.user.setAvatar)
router.put('/bio', authenticate, controller.user.setBio)
router.put('/follow/:id', authenticate, controller.user.followUser)

//post routes
router.post('/post', authenticate, upload.single('file'), controller.post.createPost)
router.delete('/post/:id', authenticate, controller.post.deletePost)
router.put('/post/:id', authenticate, upload.single('file'), controller.post.updatePost)
router.get('/post/:id', authenticate, controller.post.getPost)
router.put('/likepost/:id', authenticate, controller.post.likePost)
router.put('/unlikepost/:id', authenticate, controller.post.unlikePost)
router.get('/post', authenticate, controller.post.getAllPosts)

module.exports = router