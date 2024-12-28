const prisma = require('./prisma.js');

async function createUser(username, password) {
  await prisma.user.create({
    data: {
      username: username,
      password: password,
    }
  })
}
async function getLoginUser(username) {
  const user = await prisma.user.update({
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

async function getUser(username) {
  const user = await prisma.user.update({
    where: {
      username: username
    },
    data: {
      lastActive: new Date(),
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

async function followUser(userId, targetId) {
  const user = await prisma.user.update({
    where: { id: userId},
    data: {
      following: { connect: [{
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


module.exports = { createUser, getLoginUser, getUser, setName, setAvatar, setBio, followUser, getUsers, getOtherUser }