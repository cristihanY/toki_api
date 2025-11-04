const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

const create = async (data) => prisma.channelMember.create({ data })

const findAll = async () => prisma.channelMember.findMany()

const findById = async (id) => prisma.channelMember.findUnique({ where: { id } })

const findByUserId = async (userId) => {
  return prisma.channelMember.findMany({
    where: { userId },
    orderBy: {
      joinedAt: 'desc'
    }
  });
};

const findByUserIdAndChannelId = async (userId, channelId) => {
  return prisma.channelMember.findFirst({
    where: {
      userId,
      channelId
    }
  });
};

const findByIdAndUserId = async (id, userId) => {
  return await prisma.channelMember.findFirst({
    where: {
      id,
      userId
    }
  });
};

const findByChannelId = async (channelId) => prisma.channelMember.findMany({ where: { channelId } })

const update = async (id, data) => prisma.channelMember.update({ where: { id }, data })

const remove = async (id) => prisma.channelMember.delete({ where: { id } })

module.exports = {
  create,
  findAll,
  findById,
  findByUserId,
  findByChannelId,
  findByUserIdAndChannelId,
  findByIdAndUserId,
  update,
  remove,
}
