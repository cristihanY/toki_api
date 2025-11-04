const {
  createChannel,
  getChannelById,
  updateChannel,
  listAllChannelsByUserId,
  joinChannelMember,
  leaveChannelMember,
  updateChannelMemberStatus,
  searchChannels
} = require('../services/channels.service');

const registerChannel = async (req, res) => {
  const loggedUser = req.user;
  try {
    const result = await createChannel(loggedUser.userId, req.body);
    res.status(201).json({ message: 'Channel created', data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getChannel = async (req, res) => {
  try {
    const result = await getChannelById(parseInt(req.params.id));
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const searchChannelHandler = async (req, res) => {
  const { search } = req.query;
  const loggedUser = req.user; // viene del JWT (middleware)
  
  try {
    const result = await searchChannels(loggedUser.userId, search);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error en searchChannelHandler:", error);
    res.status(404).json({ message: error.message });
  }
};


const editChannel = async (req, res) => {
  const loggedUser = req.user;
  try {
    const result = await updateChannel(parseInt(req.params.id), loggedUser.userId, req.body);
    res.status(200).json({ message: 'Channel updated', data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const listAllChannels = async (req, res) => {
  const loggedUser = req.user;
  try {
    const result = await listAllChannelsByUserId(loggedUser.userId);
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const joinChannelHandler = async (req, res) => {
  const loggedUser = req.user;
  const channelId = parseInt(req.params.id);
  const { joinedType } = req.body;

  try {
    const result = await joinChannelMember(channelId, loggedUser.userId, joinedType);
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

};

const leaveChannelHandler = async (req, res) => {
    const loggedUser = req.user;
  try {
    const result = await leaveChannelMember(parseInt(req.params.id), loggedUser.userId);
    return res.status(200).json({ data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateChannelMemberStatusHandler = async (req, res) => {
    const loggedUser = req.user;
    const { memberStatus } = req.body;
  try {
    const result = await updateChannelMemberStatus(parseInt(req.params.channelMemberId), loggedUser.userId, memberStatus);
    return res.status(200).json({ data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  registerChannel,
  editChannel,
  getChannel,
  listAllChannels,
  joinChannelHandler,
  leaveChannelHandler,
  updateChannelMemberStatusHandler,
  searchChannelHandler
};
