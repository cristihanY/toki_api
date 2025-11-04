const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const create = async (data) => prisma.user.create({ data });

const findAll = async () => prisma.user.findMany();

const findById = async (id) => prisma.user.findUnique({ where: { id } });

const findByUserName = async (user_name) => {
  return prisma.user.findUnique({
    where: { user_name }
  });
};

const findByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

const removeByUserName = async (user_name) => prisma.user.delete({ where: { user_name } });

const update = async (id, data) => prisma.user.update({ where: { id }, data });

const remove = async (id) => prisma.user.delete({ where: { id } });

module.exports = {
  create,
  findAll,
  findById,
  findByUserName,
  findByEmail,
  removeByUserName,
  update,
  remove,
};
