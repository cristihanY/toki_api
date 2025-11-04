const { Router } = require('express');
const authenticateJWT = require('../middleware/auth.handler');
const { 
  registerChannel, editChannel,
  getChannel, joinChannelHandler, 
  updateChannelMemberStatusHandler,
  listAllChannels, leaveChannelHandler,
  searchChannelHandler } = require('../controllers/channels.controller');

const router = Router();

router.use(authenticateJWT);

/**
 * @swagger
 * tags:
 *   name: Channels
 *   description: Endpoints for managing channels
 */

/**
 * @swagger
 * /api/channel/channels:
 *   post:
 *     summary: Create a new channel
 *     description: Allows an authenticated user to create a new channel.
 *     tags:
 *       - Channels
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - display_name
 *             properties:
 *               display_name:
 *                 type: string
 *                 example: "Tech Discussions"
 *               description:
 *                 type: string
 *                 example: "Channel for tech related talks"
 *               isPublic:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Channel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Channel created"
 */
router.post("/channels", registerChannel);

/**
 * @swagger
 * /api/channel/channels/{id}:
 *   get:
 *     summary: Get channel by ID
 *     description: Retrieves detailed information about a specific channel by its ID.
 *     tags:
 *       - Channels
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Channel ID
 *     responses:
 *       200:
 *         description: Channel retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *       404:
 *         description: Channel not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router.get("/channels/:id", getChannel);

/**
 * @swagger
 * /api/channel/channels/search/all:
 *   get:
 *     summary: Search channels
 *     description: Search for channels by name or display name (case-insensitive).
 *     tags:
 *       - Channels
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term to filter channels (matches `name` or `display_name`)
 *     responses:
 *       200:
 *         description: Channels retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *       400:
 *         description: Search term missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: No channels found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/channels/search/all", searchChannelHandler);

/**
 * @swagger
 * /api/channel/channels/{id}:
 *   put:
 *     summary: Update channel
 *     description: Allows the owner of the channel to update its display name, description, or visibility.
 *     tags:
 *       - Channels
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Channel ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               display_name:
 *                 type: string
 *                 example: "New Display Name"
 *               description:
 *                 type: string
 *                 example: "Updated channel description"
 *               isPublic:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Channel updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *       400:
 *         description: Invalid request or not authorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Channel not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router.put("/channels/:id", editChannel);

/**
 * @swagger
 * /api/channel/channels/{id}/join:
 *   put:
 *     summary: Join a channel
 *     description: Allows a user to join a channel with a specific joinedType.
 *     tags:
 *       - Channels
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Channel ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               joinedType:
 *                 type: string
 *                 enum: [INVITE, JOIN]   # 👈 según tu enum JoinedType
 *                 example: "JOIN"
 *     responses:
 *       200:
 *         description: User successfully joined the channel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Invalid request or not authorized
 */
router.put("/channels/:id/join", joinChannelHandler);

/**
 * @swagger
 * /api/channel/channels/members/me:
 *   get:
 *     summary: List all channels of the logged user
 *     description: Returns all channels where the authenticated user is a member.
 *     tags:
 *       - Channels
 *     responses:
 *       200:
 *         description: List of channels retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *       400:
 *         description: Invalid request or not authorized
 */
router.get("/channels/members/me", listAllChannels);

/**
 * @swagger
 * /api/channel/channels/members/{channelMemberId}/status:
 *   patch:
 *     summary: Update a channel member's status
 *     description: Updates the membership status of a user in a channel. The logged-in user must be a member of the channel.
 *     tags:
 *       - Channels
 *     parameters:
 *       - in: path
 *         name: channelMemberId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The channel member ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberStatus:
 *                 type: string
 *                 description: New status of the member
 *                 enum: [ONLINE, OFFLINE, AWAY, BUSY]
 *                 example: ONLINE
 *     responses:
 *       200:
 *         description: Channel member status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: Updated member entity
 *       400:
 *         description: Invalid request or error while updating status
 */
router.patch("/channels/members/:channelMemberId/status", updateChannelMemberStatusHandler);


/**
 * @swagger
 * /api/channel/channels/{id}/leave:
 *   delete:
 *     summary: Leave a channel
 *     description: Allows the logged-in user to leave a specific channel.
 *     tags:
 *       - Channels
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Channel ID the user wants to leave
 *     responses:
 *       200:
 *         description: User left the channel successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   example: "User 15 left channel 123"
 *       400:
 *         description: Invalid request or not authorized
 */
router.delete("/channels/:id/leave", leaveChannelHandler);

module.exports = router;

