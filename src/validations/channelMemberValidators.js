const channelMemberRepo = require('../repository/channelMemberRepository');

const validateChannelMemberExist = async (id, userId) => {
  const currentCm = await channelMemberRepo.findByIdAndUserId(id, userId);
  
    if (!currentCm) {
      throw new Error(
        `ChannelMember not found for userId=${userId}, channelMemberId=${id}`
      );
    }

};

const validateIfUserIsMember = async (channelId, userId) => {
  const currentCm = await channelMemberRepo.findByUserIdAndChannelId(userId, channelId);

  if (currentCm) {
    throw new Error(
      `User ${userId} is already a member of channel ${channelId}`
    );
  }
  
};


module.exports = {
  validateChannelMemberExist,
  validateIfUserIsMember
};