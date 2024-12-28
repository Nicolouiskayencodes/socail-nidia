const prisma = require('./prisma.js');

async function createPost(id, image, content) {
  const post = await prisma.post.create({
    data: {
      authorId: id,
      image: image,
      content: content,
    }
  })
  return post
} 
async function deletePost(userId, postId) {
  try {
    await prisma.post.delete({
      where: {
        authorId: userId,
        id: postId
      }
    })
  } catch (error) { 
    throw (error)
  }
}
async function updatePostPhoto(userId, postId, image) {
  const post = await prisma.post.update({
    where: {
      authorId: userId,
      id: postId,
    },
    data: {
      image: image,
    }
  })
  return post
} 
async function updatePostContent(userId, postId, content) {
  const post = await prisma.post.update({
    where: {
      authorId: userId,
      id: postId,
    },
    data: {
      content: content,
    }
  })
  return post
} 
async function getPost(id) {
  const post = await prisma.post.findUnique({
    where: { id: id },
    include: {
      comments: true,
      likes: true,
    }
  })
  return post
}
async function likePost(userId, postId) {
  const post = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      likes: {
        connect: [{ id: userId}]
      }
    }
  })
  return post
}
async function unlikePost(userId, postId) {
  const post = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      likes: {
        disconnect: [{ id: userId}]
      }
    }
  })
  return post
}
async function getAllPosts(id) {
  const following = await prisma.user.findUnique({
    where: { id: id },
    select: { following: { select: { id: true } } },
  })

  const posts = await prisma.post.findMany({
    where: {
      author: {
        id: { in: [...following.following.map((user) => user.id), id] },
      },
    },
  })
  return posts
}

module.exports = { createPost, deletePost, updatePostPhoto, updatePostContent, getPost, likePost, unlikePost, getAllPosts }