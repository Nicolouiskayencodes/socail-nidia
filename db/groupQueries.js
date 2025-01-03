const prisma = require('./prisma')

async function makeGroup(userid, groupName) {
  const group = await prisma.group.create({
    data: {
      name: groupName,
      members: {
        connect: {
          id: userid,
        },
      },
      admins: {
        connect: {
          id: userid
        },
      },
    },
  })
  return group
}

async function openGroup(userid, groupid) {
  const checkGroup = await prisma.group.findUnique({
    where: {
      id: groupid
    },
    include: {
      members: true,
      admins: true,
      posts: true,
    }
  })
  if (checkGroup.admins.length > 0) {
    return checkGroup
  } else {
    const update = await prisma.group.update({
      where: {id: id},
      data: {
        admins: {
          connect: {
            id: userid
    }}}},)
    return update
  }
}
async function updateGroup( userid, groupid, bannerurl, bio, sidebar){
  const group = await prisma.group.findUnique({
    where: {
      id: groupid
    },
    include: {
      admins: true
    }
  })
  if(group.admins.some(admin => {return admin.id === userid})){
    const update = await prisma.group.update({
      where: {
        id: groupid,
      },
      data: {
        banner: bannerurl,
        bio: bio,
        sidebar: sidebar,
      }
    }
  )
  return update
  } else {
    throw error("Not an admin");
  }
}
async function leaveGroup(userid, groupid) {
  const group = await prisma.group.update({
    where: {
      id: groupid
    },
    data: {
      admins: {
        disconnect: {
          id: userid
        },
      },
      members: {
        disconnect: {
          id: userid
        }
  }}})
  return group
}
async function createPost(userid, groupid, image, content) {
  const post = await prisma.post.create({
    data: {
      authorId: userid,
      groupId: groupid,
      image: image,
      content: content
    }
  })
  return post
}
async function deletePost(userId, groupId, postId) {
  await prisma.post.delete({
    where: {
      id: postId,
      group:{
        id: groupId,
        admins: {
          some: {
            id: userId
          }
      }
    }
    }
  })
}

module.exports = { makeGroup, openGroup, updateGroup, leaveGroup, createPost, deletePost }