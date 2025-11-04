const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUserByUserName,
  getUserByUserName
} = require('../services/users.service');

const registerUser = async (req, res) => {
  try {
    const result = await createUser(req.body);
    res.status(201).json({ message: 'Usuario registrado', data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const listUsers = async (_req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const modifyUser = async (req, res) => {
  const loggedUser = req.user;
  try {
    const result = await updateUser(parseInt(loggedUser.userId, 10), req.body);
    res.json({ message: 'Usuario actualizado', data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCurrentUserController = async (req, res) => {
  const loggedUser = req.user;
  try {
    const user = await getUserByUserName(loggedUser.userName);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCurrentUserController = async (req, res) => {
  try {
    const userName = req.params.user_name;
    await deleteUserByUserName(userName);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

function capitalizeName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

module.exports = {
  registerUser,
  listUsers,
  modifyUser,
  deleteCurrentUserController,
  getCurrentUserController
};
