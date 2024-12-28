const db = require('../db/userQueries.js');
const Crypto = require('crypto')
const supabase = require('../config/supabase.js')
const {decode} = require('base64-arraybuffer');

const info = (req, res) => {
  res.json(req.user)
}
const setName = async (req, res, next) => {
  let first = req.body.firstName;
  let last = req.body.lastName;
  if (req.body.firstName.trim() === '') {
    first = null
  }
  if (req.body.lastName.trim() === '') {
    last = null
  }
  try {
    const user = await db.setName(parseInt(req.user.id), first, last)
    res.json(user)
  } catch (error) {
    return next(error)
  }
}
const setAvatar = async (req, res, next) => {
  if (req.file){
  const ext = req.file.originalname.split('.').pop()
    const filename = Crypto.randomUUID() + '.'+ ext
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ message: "Please upload a file"});
        return
      }
      const fileBase64 = decode(file.buffer.toString('base64'))

      const {data, error} = await supabase.storage
      .from('nidia')
      .upload(`public/${filename}`, fileBase64, {
        contentType: file.mimetype
      });
      if (error) {
        return next(error)
      }
    } catch (error) {
      return next(error)
    }
      const {data} = supabase.storage
      .from('nidia')
      .getPublicUrl(`public/${filename}`, {
        download: true
      });
      
      try {
        const user = await db.setAvatar(parseInt(req.user.id), data.publicUrl) 
        return res.json(user)
      } catch (error) {
        return next(error)
      }
    } else {
      return res.status(400).json({error: 'no file found'})
    }
}

const setBio = async (req, res, next) => {
  try{
    const user = await db.setBio(parseInt(req.user.id), req.body.bio)
    return res.json(user)
  } catch (error) {
    return next(error)
  }
}

const followUser = async (req, res, next) => {
  try {
    const user = await db.followUser(parseInt(req.user.id), parseInt(req.params.id))
    return res.json(user)
  } catch (error) {
    return next(error)
  }
}
const unfollowUser = async (req, res, next) => {
  try {
    const user = await db.unfollowUser(parseInt(req.user.id), parseInt(req.params.id))
    return res.json(user)
  } catch (error) {
    return next(error)
  }
}

const getUsers = async (req, res, next) => {
  try{
    const users = await db.getUsers()
    return res.json(users)
  } catch (error) {
    return next(error)
  }
}
const getUser = async (req, res, next) => {
  try {
    const user = await db.getOtherUser(parseInt(req.params.id))
    return res.json(user)
  } catch (error) {
    return next(error)
  }
}

module.exports = { info, setName, setAvatar, setBio, followUser, unfollowUser, getUsers, getUser }