const prisma = require('./prisma.js');

async function createUser(username, password) {
  await prisma.user.create({
    data: {
      username: username,
      password: password,
    }
  })
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


module.exports = { createUser, getUser, setName, setAvatar, setBio }