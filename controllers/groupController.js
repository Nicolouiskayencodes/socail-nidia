const db = require('../db/groupQueries')
const supabase = require('../config/supabase.js');
const Crypto = require('crypto')
const {decode} = require('base64-arraybuffer');

const getGroups = async(req, res, next) => {
  try{
    const groups = await db.getGroups();
    res.json(groups)
  } catch (error) {
    return next(error)
  }
}

const createGroup = async (req, res, next) => {
  try {
    const group = await db.makeGroup(parseInt(req.user.id), req.body.groupName)
    res.json(group)
  } catch (error) {
    return next(error)
  }
}
const openGroup = async (req, res, next) => {
  try {
    const group = await db.openGroup(parseInt(req.user.id), parseInt(req.params.id));
    res.json(group)
  } catch (error) {
    return next(error)
  }
}
const updateGroup = async (req, res, next) => {
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
        const group = await db.updateGroup( parseInt(req.user.id), parseInt(req.params.id), data.publicUrl, req.body.bio, req.body.sidebar) 
        return res.json(group)
      } catch (error) {
        return next(error)
      }
    } else {
      try {
      const group = await db.updateGroup( parseInt(req.user.id), parseInt(req.params.id), req.body.banner, req.body.bio, req.body.sidebar)
      return res.json(group)
    } catch (error) {
      return next(error)
    }}
}
const leaveGroup = async (req, res, next) => {
  try {
    const group = await db.leaveGroup(parseInt(req.user.id), parseInt(req.params.id))
    return res.json(group)
  } catch (error) {
    return next(error)
  }
}
const createPost = async (req, res, next) => {
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
      const group = await db.createPost( parseInt(req.user.id), parseInt(req.params.id), data.publicUrl, req.body.content) 
      return res.json(group)
    } catch (error) {
      return next(error)
    }
  } else {
    try {
    const group = await db.createPost( parseInt(req.user.id), parseInt(req.params.id), null, req.body.content)
    return res.json(group)
  } catch (error) {
    return next(error)
  }}
}
const deletePost = async (req, res, next) => {
  try {
    await db.deletePost(parseInt(req.user.id), parseInt(req.params.groupId), parseInt(req.params.postId))
    return res.json({message: "success"})
  } catch (error) {
    return next(error)
  }
}
const joinGroup = async (req, res, next) => {
  try {
    const group = await db.joinGroup(parseInt(req.user.id), parseInt(req.params.id))
    return res.json(group)
  } catch (error) {
    return next(error)
  }
}
const addAdmin = async (req, res, next) => {
  try {
    const group = await db.addAdmin(parseInt(req.user.id), parseInt(req.params.groupId), parseInt(req.params.memberId))
    return res.json(group)
  } catch (error) {
    return next(error)
  }
}

module.exports = { createGroup, openGroup, updateGroup, leaveGroup, createPost, deletePost, joinGroup, addAdmin, getGroups }