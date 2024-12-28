const prisma = require('./prisma.js');

async function createComment(userId, postId, content) {
  const comment = await prisma.comment.create({
    data: {
      authorId: userId,
      postId: postId,
      content: content
    }
  })
  return comment
}
async function updateComment(userId, commentId, content) {
  const comment = await prisma.comment.update({
    where: {
      id: commentId,
      authorId: userId,
    },
    data: {
      content: content
    }
  })
  return comment
}
async function deleteComment(userId, commentId) {
   await prisma.comment.delete({
    where: {
      id: commentId,
      authorId: userId,
    },
  })
}
async function likeComment(userId, commentId) {
  const comment = await prisma.comment.update({
    where: {
      id: commentId
    },
    data: {likes: {
      connect: [{
        id: userId
      }]
    }}
  })
  return comment
}
async function unlikeComment(userId, commentId) {
  const comment = await prisma.comment.update({
    where: {
      id: commentId
    },
    data: {likes: {
      disconnect: [{
        id: userId
      }]
    }}
  })
  return comment
}

module.exports = { createComment, updateComment, deleteComment, likeComment, unlikeComment }