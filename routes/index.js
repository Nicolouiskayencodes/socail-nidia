const router = require('express').Router();
const passport = require('passport');
const controller = require('../controllers/')
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
router.put('/follow/:id', authenticate, controller.user.followRequest)
router.put('/accept/:id', authenticate, controller.user.acceptFollow)
router.put('/unfollow/:id', authenticate, controller.user.unfollowUser)
router.delete('user/:id', authenticate, controller.user.delete)

//post routes
router.post('/post', authenticate, upload.single('file'), controller.post.createPost)
router.delete('/post/:id', authenticate, controller.post.deletePost)
router.put('/post/:id', authenticate, upload.single('file'), controller.post.updatePost)
router.get('/post/:id', authenticate, controller.post.getPost)
router.put('/likepost/:id', authenticate, controller.post.likePost)
router.put('/unlikepost/:id', authenticate, controller.post.unlikePost)
router.get('/post', authenticate, controller.post.getAllPosts)

//comment routes
router.post('/comment/:id', authenticate, controller.comment.createComment)
router.put('/comment/:id', authenticate, controller.comment.updateComment)
router.delete('/comment/:id', authenticate, controller.comment.deleteComment)
router.put('/likecomment/:id', authenticate, controller.comment.likeComment)
router.put('/unlikecomment/:id', authenticate, controller.comment.unlikeComment)

//conversation routes
router.get('/conversation/:conversationid', authenticate, controller.conversation.openConversation)
router.post('/conversation', authenticate, controller.conversation.makeConversation)

//message routes
router.post('/message/:conversationid', authenticate, upload.single('file'), controller.message.sendMessage)
router.put('/message/:messageid', authenticate, controller.message.updateMessage)
router.delete('/message/:messageid', authenticate, controller.message.deleteMessage)

//group routes
router.get('/group', authenticate, controller.group.getGroups)
router.post('/group', authenticate, controller.group.createGroup)
router.get('/group/:id', authenticate, controller.group.openGroup)
router.put('/group/:id', authenticate, upload.single('file'), controller.group.updateGroup)
router.put('/leave/:id', authenticate, controller.group.leaveGroup)
router.post('/group/post/:id', authenticate, upload.single('file'), controller.group.createPost)
router.delete('/group/:groupId/:postId', authenticate, controller.group.deletePost)
router.put('/join/:id', authenticate, controller.group.joinGroup)
router.put('/admin/:groupId/:memberId', authenticate, controller.group.addAdmin)

module.exports = router