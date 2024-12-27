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
  const user =await prisma.user.findUnique({
    where: {
      username: username
    }
  })
  return user;
}



module.exports = { createUser, getUser }