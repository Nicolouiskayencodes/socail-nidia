const authentication = require('./authentication')
const user = require('./userController')
const post = require('./postController')
const comment = require('./commentController')
const conversation = require('./conversationController')
const message = require('./messageController')

module.exports = {authentication, user, post, comment, conversation, message}