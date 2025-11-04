// src/validators/userValidators.js
const userRepo = require('../repository/userRepository');

const validateCreateUser = async (input) => {
  if (!input.user_name) {
    throw new Error("User name is required");
  }

  if (!input.password_hash) {
    throw new Error("password is required");
  }

  const existingUser = await userRepo.findByUserName(input.user_name);
  if (existingUser) {
    throw new Error("User name already exists");
  }

  if (input.email) {
    console.log("Email " ,input.email)
    const existingUserByEmail = await userRepo.findByEmail(input.email);
    if (existingUserByEmail) {
      throw new Error("Email already in use by another user");
    }
  }
};

const validateUpdateUser = async (id, input) => {
  if (!id) {
    throw new Error("User ID is required");
  }

  const user = await userRepo.findById(id);
  if (!user) {
    throw new Error("User not found");
  }

  if (!input || Object.keys(input).length === 0) {
    throw new Error("At least one field must be provided for update");
  }

  if (input.email) {
    const existingUser = await userRepo.findByEmail(input.email);
    if (existingUser && existingUser.id !== id) {
      throw new Error("Email already in use by another user");
    }
  }
};

const validateUserExists = async (user_name) => {
  if (!user_name) throw new Error("user_name is required");

  const user = await userRepo.findByUserName(user_name);
  if (!user) throw new Error("User not found");
};

module.exports = {
  validateCreateUser,
  validateUserExists,
  validateUpdateUser
};