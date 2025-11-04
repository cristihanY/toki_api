const channelRepo = require('../repository/channelRepository');
const channelMemberService = require('../services/channelMembers.service');
const { getUserByIdLite } = require('./users.service');
const { getUserByIds, getUserById } = require('../services/users.service');
const { validateCreateChannel, validateChannelExist, validateIsChannelOwner } = require('../validations/channelValidators');


const createChannel = async (ownerId, input = {}) => {
  await validateCreateChannel(ownerId, input);

  const channelData = {
    owner_user_id: ownerId,
    name: input.display_name,
    display_name: input.display_name || "",
    description: input.description,
    isPublic: input.isPublic ?? true,
  };

  Object.keys(channelData).forEach(key => channelData[key] === undefined && delete channelData[key]);

  const channel = await channelRepo.create(channelData);
  const chanelmember = await channelMemberService.createChannelMember(channel.id, ownerId, joinedType = "CREATE")
  return {channel: channel, chanelmember: chanelmember};
};

const getChannelById = async (id) => {
  await validateChannelExist(id);
  const channel = await channelRepo.findById(id);
  const owner = await getUserByIdLite(channel.owner_user_id);
  const relatedMembers = await channelMemberService.findChannelMembers(id);
  const firstMemberIds = relatedMembers.map(member => member.userId);
  const users = await getUserByIds(firstMemberIds);
  return {
    ...channel,
    owner: owner,
    memberInfo: users,
  };
};

const updateChannel = async (id, userId, input = {}) => {
  await validateIsChannelOwner(id, userId);
  const channel = await channelRepo.findById(id);
  const channelData = {
    display_name: input.display_name || channel.display_name,
    description: input.description ?? channel.description,
    isPublic: input.isPublic ?? channel.isPublic,
  };

  Object.keys(channelData).forEach(
    key => channelData[key] === undefined && delete channelData[key]
  );

  const updatedChannel = await channelRepo.update(id, channelData);
  return updatedChannel;
};

const searchChannels = async (userId, search) => {
  const channels = await channelRepo.findByChannelName(search);
  const joinedChannelIds = await getUserJoinedChannelIds(userId);

  return channels.map(channel => ({
    ...channel,
    isJoin: joinedChannelIds.includes(channel.id),
  }));
};

const getUserJoinedChannelIds = async (userId) => {
  // Devuelve lista de IDs de canales donde el usuario está unido
  const asociatedChannels = await channelMemberService.listMembersByUserId(userId);
  return asociatedChannels.map(r => r.channelId);
};


const deleteChannel = async (id) => {
  await validateChannelExist(id);
  channelRepo.remove(id)
};

const listAllChannelsByUserId = async (userId) => {
  const asociatedChannels = await channelMemberService.listMembersByUserId(userId);

  const result = [];
  for (const channelMember of asociatedChannels) {
    const channel = await channelRepo.findById(channelMember.channelId);
    const relatedMembers = await channelMemberService.findChannelMembers(channelMember.channelId);
    if (channel) {
      const firstMemberIds = relatedMembers.slice(0, 4).map(member => member.userId);
      const users = await getUserByIds(firstMemberIds);
      result.push({
        ...channelMember,
        channel: channel,
        memberInfo: users,
        totalMember: relatedMembers.length
      });
    }
  }

  return result;
};

const joinChannelMember = async (channelId, userId, joinedType) => {
  await validateChannelExist(channelId);
  const user = await getUserById(userId);

  const request = {
    joinedType: joinedType,
    status: user.status
  };

  const result = await channelMemberService.createChannelMember(channelId, userId, request);
  return result;
};

const updateChannelMemberStatus = async (channelMemberId, userId, memberStatus) => {
  const result = await channelMemberService.handleChannelMemberUserStatus(channelMemberId, userId, memberStatus);
  return result;
}

const leaveChannelMember = async (channelId, userId) => {
  await validateChannelExist(channelId);
  const channelMember = await channelMemberService.findByUserIdAndChannelId(userId, channelId);
  if( channelMember ) {
    await channelMemberService.removeChannelMember(channelMember.id);
  } else {
    throw new Error("Channel not a member");
  }
}

module.exports = {
  createChannel,
  getChannelById,
  updateChannel,
  deleteChannel,
  listAllChannelsByUserId,
  joinChannelMember,
  leaveChannelMember,
  updateChannelMemberStatus,
  searchChannels
};