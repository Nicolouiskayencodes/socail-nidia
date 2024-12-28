const db = require('../db/commentQueries');
const { message } = require('../db/prisma');

const createComment = async (req, res, next) => {
  try {
    const comment = await db.createComment(parseInt(req.user.id), parseInt(req.params.id), req.body.content)
    return res.json(comment)
  } catch (error) {
    return next (error)
  }
}
const updateComment = async (req, res, next) => {
  try {
    const comment = await db.updateComment(parseInt(req.user.id), parseInt(req.params.id), req.body.content)
    return res.json(comment)
  } catch (error) {
    return next (error)
  }
}
const deleteComment = async (req, res, next) => {
  try {
    await db.deleteComment(parseInt(req.user.id), parseInt(req.params.id))
    return res.json({message: 'success'})
  } catch (error) {
    return next (error)
  }
}
const likeComment = async (req, res, next) => {
  try {
    const comment = await db.likeComment(parseInt(req.user.id), parseInt(req.params.id))
    return res.json(comment)
  } catch (error) {
    return next (error)
  }
}
const unlikeComment = async (req, res, next) => {
  try {
    const comment = await db.unlikeComment(parseInt(req.user.id), parseInt(req.params.id))
    return res.json(comment)
  } catch (error) {
    return next (error)
  }
}

module.exports = { createComment, updateComment, deleteComment, likeComment, unlikeComment }