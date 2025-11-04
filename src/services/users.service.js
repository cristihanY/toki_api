const userRepo = require('../repository/userRepository');
const { MemberStatus } = require('../generated/prisma');
const { hashPassword } = require('../utils/passHashUtil');
const { generateIdentifier } = require('../utils/uuidUtil');
const { generateDisplayName } = require('../utils/displayNameUtil');
const { validateCreateUser, validateUpdateUser, validateUserExists } = require('../validations/userValidators');
const { use } = require('passport');


const createUser = async (input) => {
  await validateCreateUser(input);
  const identifier = input.identifier || generateIdentifier();
  const displayName = input.display_name || generateDisplayName(input.user_name);
  const passwordHash = await hashPassword(input.password_hash);

  const user = await userRepo.create({
    identifier: identifier,
    user_name: input.user_name,
    email: input.email || null,
    phone_number: input.phone_number || null,
    display_name: displayName || "",
    status: MemberStatus.ONLINE,
    password_hash: passwordHash
  });

  delete user.password_hash
  return mapUserToCamelCase(user);;
};

const updateUser = async (id, input) => {
  await validateUpdateUser(id, input);
  const updateData = {
    display_name: input.display_name || undefined,
    email: input.email || undefined,
    phone_number: input.phone_number || undefined,
    location: input.location || undefined,
    status: input.status || undefined,
  };

  if (input.password_hash) {
    const passwordHash = await hashPassword(input.password_hash);
    updateData.password_hash = passwordHash;
  }

  Object.keys(updateData).forEach(
    (key) => updateData[key] === undefined && delete updateData[key]
  );

  const user = await userRepo.update(id, updateData);
  delete user.password_hash
  return user;
};

const getUserByUserName = async (user_name) => {
  await validateUserExists(user_name);
  const user = await userRepo.findByUserName(user_name);
  delete user.password_hash
  return mapUserToCamelCase(user);
};

const deleteUserByUserName = async (user_name) => {
  await validateUserExists(user_name);
  await userRepo.findByUserName(user_name);
  return await userRepo.removeByUserName(user_name);
};

const getAllUsers = async () => {
  return await userRepo.findAll();
};

const getUserById = async (id) => {
  const user = await userRepo.findById(id);
  return user;
};

const getUserByIds = async (ids) => {
  const users = [];
  for (const id of ids) {
    const user = await getUserByIdLite(id);
    if (user) {
      users.push(user);
    }
  }
  return users;
};

const getUserByIdLite = async (id) => {
  const user = await userRepo.findById(id);
  if (!user) return null;

  return {
    id: user.id,
    userName: user.user_name,
    displayName: user.display_name,
    email: user.email,
    phoneNumber: user.phone_number,
    status: user.status,
    location: user.location,
  };
};

const mapUserToCamelCase = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    userName: user.user_name,
    displayName: user.display_name,
    email: user.email,
    phoneNumber: user.phone_number,
    status: user.status,
    location: user.location,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};


module.exports = {
  createUser,
  getUserByUserName,
  deleteUserByUserName,
  getAllUsers,
  getUserByIdLite,
  updateUser,
  getUserById,
  getUserByIds,
  mapUserToCamelCase
};