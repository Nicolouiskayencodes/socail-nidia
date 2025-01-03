const db = require('../db/conversationQueries')

const makeConversation = async (req, res, next) => {
  const userarray = req.body.userarray
  userarray.push(req.user)
    try {
      const conversation = await db.makeConversation(userarray)
      return res.status(200).json(conversation)
    } catch (error) {
      return next(error)
    }
}
const openConversation = async (req, res, next) => {
    try {
      const conversation = await db.getConversation(parseInt(req.params.conversationid), parseInt(req.user.id))
      return res.status(200).json(conversation)
    } catch (error) {
      return next(error)
    }
}


module.exports = { makeConversation, openConversation }