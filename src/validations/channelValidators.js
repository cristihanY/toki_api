const channelRepo = require('../repository/channelRepository');

const validateCreateChannel = async (ownerId, input) => {
  if (!ownerId) throw new Error('ownerId is required');
  if (!input.display_name) throw new Error('Channel display name is required');

  const existing = await channelRepo.findByName(input.display_name);
  if (existing) throw new Error('Channel name already exists');
};

const validateChannelExist = async (id) => {
  const channel = await channelRepo.findById(id);
  if (!channel) throw new Error("Channel not found");
};

const validateIsChannelOwner = async (id, userId) => {
  const channel = await channelRepo.findById(id);
  if (!channel) throw new Error("Channel not found");

  if (channel.owner_user_id !== userId) {
    throw new Error("Unauthorized: user is not the owner of the channel");
  }

  return channel;
};

module.exports = {
  validateCreateChannel,
  validateChannelExist,
  validateIsChannelOwner
};