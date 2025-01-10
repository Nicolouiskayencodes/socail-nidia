const prisma = require('./prisma.js');

async function createUser(username, password) {
  try{
  await prisma.user.create({
    data: {
      username: username,
      password: password,
    }
  })
} catch(error){
  return 'failed'
}
}
async function getLoginUser(username) {
  const user = await prisma.user.findUnique({
    where: {
      username: username
    },
    select: {
      username: true,
      password: true,
    },
  })
  if (user) { await prisma.user.update({
    where: {
      username: username
    },
    select: {
      username: true,
      password: true,
    },
    data: {
      lastActive: new Date(),
    },
  })
  return user;
}
}

async function getUser(username) {
  const user = await prisma.user.update({
    where: {
      username: username
    },
    data: {
      lastActive: new Date(),
    },
    include: {
      conversations: {
        include: {readBy: true},
      },
      following: true,
      receivedRequests: true,
      posts: {
        include: { likes: true,
          author: true,
          comments: {
            include: {
              author: true,
              likes: true,
            }
          }
        }
      }
    },
  })
  return user;
}

async function setName(id, firstName, lastName) {
  const user = await prisma.user.update({
    where: {id: id},
    data: {
      firstName: firstName,
      lastName: lastName,
    }
  })
  return user
}

async function setAvatar(id, url) {
  const user = await prisma.user.update({
    where: {id: id},
    data: { avatar: url},
  })
  return user
}

async function setBio(id, bio) {
  const user = await prisma.user.update({
    where: {id: id},
    data: {bio: bio}
  })
  return user
}

async function followRequest(userId, targetId) {
  const user = await prisma.user.update({
    where: { id: userId},
    data: {
      sentRequests: { connect: [{
        id: targetId
      }]}
    },
    include: {requests: true},
  })
  return user
}
async function acceptFollow(userId, requestId) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      receivedRequests: {
        disconnect: {
          id: requestId
        },
      },
      followedBy: {
        connect: {
          id: requestId,
        },
      }
    }
  })
}
async function unfollowUser(userId, targetId) {
  const user = await prisma.user.update({
    where: { id: userId},
    data: {
      following: { disconnect: [{
        id: targetId
      }]}
    },
    include: {following: true},
  })
  return user
}

async function getUsers() {
  const users = await prisma.user.findMany({})
  return users
}
async function getOtherUser(id) {
  const user = await prisma.user.findUnique({
    where: {
      id: id
    }
  })
  return user
}


module.exports = { createUser, getLoginUser, getUser, setName, setAvatar, setBio, followRequest, acceptFollow, unfollowUser, getUsers, getOtherUser }