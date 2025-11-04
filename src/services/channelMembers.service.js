const channelMemberRepo = require('../repository/channelMemberRepository');
const { MemberStatus, MembershipState, JoinedType } = require('../generated/prisma');
const { validateChannelMemberExist, validateIfUserIsMember} = require('../validations/channelMemberValidators');


const createChannelMember = async (channelId, userId, request) => {
  await validateIfUserIsMember(channelId, userId)
  const member = await channelMemberRepo.create({
    channelId: channelId,
    userId: userId,
    status: request.status || MemberStatus.ONLINE,
    membership_state: MembershipState.ACTIVE,
    joinedType: request.joinedType || JoinedType.JOIN,
    isAccepted: request.joinedType === JoinedType.INVITE ? false : true
  });
  return member;
};

const updateChannelMember = async (id, input) => {
  const updateData = {
    status: input.status || undefined,
    membership_state: input.membership_state || undefined,
    joinedType: input.joinedType || undefined,
    isAccepted: input.isAccepted !== undefined ? input.isAccepted : undefined,
  };

  Object.keys(updateData).forEach(
    (key) => updateData[key] === undefined && delete updateData[key]
  );

  return await channelMemberRepo.update(id, updateData);
};

const findChannelMembers = async (channelId) => {
  return await channelMemberRepo.findByChannelId(channelId);
};

const findByUserIdAndChannelId = async (userId, channelId) => {
  return await channelMemberRepo.findByUserIdAndChannelId(userId, channelId);
};

const isMember = async (userId, channelId) => {
  const member = await findByUserIdAndChannelId(userId, channelId);
  return !!member;
};

const handleChannelMemberUserStatus = async (id, userId, memberStatus) => {
  await validateChannelMemberExist(id, userId);
  return await updateChannelMember(id, { status: memberStatus });
};

const listMembersByUserId = async (userId) => {
  return await channelMemberRepo.findByUserId(userId);
};

const removeChannelMember = async (id) => {
  return await channelMemberRepo.remove(id);
};

const getUserChannels = async (userId) => {
  console.log(`🔎 Buscando canales para userId=${userId}`);
  const members = await listMembersByUserId(userId);
  const channelIds = members.map(m => m.channelId);
    console.log(`🔎 Buscando canales `, channelIds);
  return channelIds;
};

module.exports = {
  createChannelMember,
  updateChannelMember,
  findChannelMembers,
  findByUserIdAndChannelId,
  removeChannelMember,
  listMembersByUserId,
  getUserChannels,
  handleChannelMemberUserStatus,
  isMember
};
