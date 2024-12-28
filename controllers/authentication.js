const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/queries.js');

const createUser = async (req, res, next) => {
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    try {
      await db.createUser(req.body.username, hashedPassword)
      return res.status(200).json({message: "User created"})
    } catch(err) {
      return next(err);
    }
  })
}

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await db.getLoginUser(username);
  if (!user) {
    return res.status(404).json({message: "User not found"})
  }
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    const token = jwt.sign(user, process.env.JWT_KEY, { expiresIn: '24h' }) 
    user.password = null
    return( res.status(200).json({
      message: "Auth Passed",
        token,
        user
      })
    );
    
  }
  return res.status(401).json({ message: "Auth Failed" })
};

module.exports = { createUser, login }