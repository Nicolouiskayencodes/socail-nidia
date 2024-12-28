const db = require('../db/messageQueries')
const supabase = require('../config/supabase.js');
const Crypto = require('crypto')
const {decode} = require('base64-arraybuffer');

const sendMessage = async (req, res, next) => {
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
        await db.sendMessage(parseInt(req.params.conversationid), parseInt(req.user.id), data.publicUrl, req.body.content) 
        return res.status(200).json({message: "Success"})
      } catch (error) {
        return next(error)
      }
    } else {
      try {
      await db.sendMessage(parseInt(req.params.conversationid), parseInt(req.user.id), null, req.body.content)
      return res.status(200).json({message: "Success"})
    } catch (error) {
      return next(error)
    }}
}

const updateMessage = async (req, res, next) => {
      try {
      await db.updateMessage(parseInt(req.params.messageid), req.user.id, req.body.content )
      return res.status(200).json({message: "Success"})
    } catch (error) {
      return next(error)
    }
}

const deleteMessage = async (req, res, next) => {
      try {
      await db.deleteMessage(parseInt(req.params.messageid), req.user.id)
      return res.status(200).json({message: "Success"})
    } catch (error) {
      return next(error)
    }
}

module.exports = { sendMessage, updateMessage, deleteMessage }