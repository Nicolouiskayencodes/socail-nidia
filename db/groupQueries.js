const prisma = require('./prisma')

async function getGroups() {
  const groups = await prisma.group.findMany({
    orderBy: {
      name: 'asc'
    }
  })
  return groups
}

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
      posts: {
        include: {
          author: true,
          likes: true,
          comments: true,
        }
      },
    }
  })
  if (checkGroup.admins.length > 0 || !checkGroup.members.some(member => {return member.id === userid})) {
    return checkGroup
  } else {
    const update = await prisma.group.update({
      where: {id: groupid},
      data: {
        admins: {
          connect: {
            id: userid
    }}},
    include: {
      members: true,
      admins: true,
      posts: {include:
        {
          author: true,
          likes: true
        }
      },
    },
  },)
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
async function joinGroup(userId, groupId) {
  const group = await prisma.group.update({
    where: {
      id: groupId
    },
    data: {
      members: {
        connect: {
          id: userId
        }
      }
    }
  })
  return group
}
async function addAdmin(adminId, groupId, memberId) {
  const group = await prisma.group.update({
    where: {
      id: groupId,
      admins: {
        some: {
          id: adminId,
        },
      },
    },
    data: {
      admins: {
        connect: {
          id: memberId
        }
      }
    }
  })
  return group
}


module.exports = { makeGroup, openGroup, updateGroup, leaveGroup, createPost, deletePost, joinGroup, addAdmin, getGroups }