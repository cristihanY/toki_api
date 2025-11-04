const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const create = async (data) => prisma.channel.create({ data });

const findAll = async ({ q, limit = 20, offset = 0 } = {}) => {
  const where = q ? { name: { contains: q, mode: 'insensitive' } } : {};

  return prisma.channel.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: Number(limit),
    skip: Number(offset),
    select: {
      id: true,
      name: true,
      isPublic: true,   
      owner_user_id: true, 
      createdAt: true    
    }
  });
};

const count = async ({ q } = {}) => {
  const where = q ? { name: { contains: q, mode: 'insensitive' } } : {};
  return prisma.channel.count({ where });
};

const findByName = async (name) => {
  return prisma.channel.findUnique({
    where: { name },
  });
};

const findByOwnerId = async (ownerId) => {
  return prisma.channel.findMany({
    where: { owner_user_id: ownerId },
  });
};

const findById = async (id) => prisma.channel.findUnique({ where: { id } });

const update = async (id, data) => prisma.channel.update({ where: { id }, data });

const remove = async (id) => prisma.channel.delete({ where: { id } });

const findByChannelName = async (search) => {
  return prisma.channel.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { display_name: { contains: search, mode: 'insensitive' } }
      ]
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

module.exports = { create, findAll,count, findByName, findById, update, remove, findByOwnerId, findByChannelName };

