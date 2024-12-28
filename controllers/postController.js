const db = require('../db/postQueries');
const supabase = require('../config/supabase.js');
const Crypto = require('crypto')
const {decode} = require('base64-arraybuffer');

const createPost = async (req, res, next) => {
  if (req.file || (req.body.content && req.body.content.trim().length > 0)){
  if (req.file) {
    const ext = req.file.originalname.split('.').pop()
    const filename = Crypto.randomUUID() + '.'+ ext
    const file = req.file;
  try {
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
      const post = await db.createPost( parseInt(req.user.id), data.publicUrl, req.body.content) 
      return res.json(post)
    } catch (error) {
      return next(error)
    }
  } else {
    try {
    const post = await db.createPost( parseInt(req.user.id), null, req.body.content)
    return res.json(post)
  } catch (error) {
    return next(error)
  }}
}}
const deletePost = async (req, res, next) => {
  try {
    await db.deletePost(parseInt(req.user.id),parseInt(req.params.id))
    return res.status(200).json({message: 'success'})
  } catch (error) {
    return next(error)
  }
}
const updatePost = async (req, res, next) => {
  if (req.file || (req.body.content && req.body.content.trim().length > 0)){
  if (req.file) {
    const ext = req.file.originalname.split('.').pop()
    const filename = Crypto.randomUUID() + '.'+ ext
    const file = req.file;
  try {
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
    await db.updatePostPhoto( parseInt(req.user.id), parseInt(req.params.id), data.publicUrl) 
    } catch (error) {
      return next(error)
    }
  } 
  if (req.body.content && req.body.content.trim().length > 0) {
    try {
    await db.updatePostContent( parseInt(req.user.id), parseInt(req.params.id), req.body.content)
  } catch (error) {
    return next(error)
  }}
  return res.json({message: 'success'})
}}
const getPost = async (req, res, next) => {
  try {
    const post = await db.getPost(parseInt(req.params.id))
    return res.json(post)
  } catch (error) {
    return next(error)
  }
}
const likePost = async (req, res, next) => {
  try {
    const post = await db.likePost(parseInt(req.user.id), parseInt(req.params.id))
    return res.json(post)
  } catch (error) {
    return next(error)
  }
}
const unlikePost = async (req, res, next) => {
  try {
    const post = await db.unlikePost(parseInt(req.user.id), parseInt(req.params.id))
    return res.json(post)
  } catch (error) {
    return next(error)
  }
}
const getAllPosts = async (req, res, next) => {
  try {
    const posts = await db.getAllPosts(parseInt(req.user.id))
    return res.json(posts)
  } catch (error) {
    return next(error)
  }
}

module.exports = { createPost, deletePost, updatePost, getPost, likePost, unlikePost, getAllPosts }