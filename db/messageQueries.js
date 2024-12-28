const prisma = require('./prisma')

async function sendMessage(conversationid, userid, imageurl, content) {
  await prisma.conversation.update({
    where: {
      id: conversationid
    },
    data: {
      readBy: {
        set: [],
        },
      },
  })
  await prisma.message.create({
    data: {
      conversationId: conversationid,
      authorId: userid,
      image: imageurl,
      content: content,
    },
  }
  )
}

async function updateMessage(messageid, userid, content) {
  await prisma.message.update({
    where: {
      id: messageid,
      authorId: userid
    },
    data: {
      content: content,
    },
  }
  )
}
async function deleteMessage( messageid, userid ) {
  await prisma.message.delete({
    where: {
      id: messageid,
      authorId: userid
    },
  }
  )
}

module.exports = { sendMessage, updateMessage, deleteMessage}