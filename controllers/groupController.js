const db = require('../db/groupQueries')

const makeGroup = async (req, res, next) => {
  try {
    const group = await db.makeGroup(parseInt(req.user.id), req.body.name)
  } catch (error) {
    return next(error)
  }
}