const prisma = require('./prisma')

async function makeConversation(userarray) {
  const usersQuery = []
  const userIds = []
  let exists = true;
  let conversationId = null;
  userarray.map(user => {
    usersQuery.push({id: user.id})
    userIds.push(user.id)
  })
  const users = await prisma.user.findMany({
      where: {
        id: {in: userIds},
      },
      include: {
        conversations: {
          include: {
            Users:true,
          },
          },
          
      }
    })
    for(i=1; i<users.length; i++){
      if (!users[0].conversations.some(conversation => {return (conversation.Users.some(user => {return user.id === users[i].id}) && conversation.Users.length === users.length)})) {
        exists = false
      } else {
        users[0].conversations.forEach(conversation => {if (conversation.Users.length === users.length){
          if (conversation.Users.every(user => {return (userIds.includes(user.id))})){ conversationId = conversation.id }
        }})

        } 
      }
    if(exists === false ) {
      const conversation = await prisma.conversation.create({
        data: {
          Users: {
              connect: usersQuery
          },
        },
      })
      return conversation;
    } else {
      const conversation = await prisma.conversation.findUnique({ where: {
        id: conversationId,},
        include: { Users: true,},
      })
      return conversation;
    }
  }
  async function getConversation(conversationid, userid) {
    await prisma.conversation.update({
      where: {
        id: conversationid
      },
      data: {
        readBy: {
          connect: [{
            id: userid
          }],
          },
        },
    })
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationid,
        Users: {
          some:{
            id: userid
        }}
      },
      include: {
        Users: true,
        Messages: {
          include: {author: true},
        },
      }
    })
    return conversation
  }

  module.exports = { makeConversation, getConversation }