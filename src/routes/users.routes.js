const { Router } = require('express');
const {
  registerUser,
  listUsers,
  modifyUser,
  getCurrentUserController,
  deleteCurrentUserController
} = require('../controllers/users.controller');
const authenticateJWT = require('../middleware/auth.handler');

const router = Router();

router.use(authenticateJWT);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints for managing users
 */

/**
 * @swagger
 * /api/identity/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_name
 *               - email
 *             properties:
 *               user_name:
 *                 type: string
 *                 description: User's username
 *                 example: "yonkitoki"
 *               password_hash:
 *                 type: string
 *                 description: Hashed password (optional)
 *                 example: "hashedPassword123"
 *               email:
 *                 type: string
 *                 description: Unique email address
 *                 example: "yonki@example.com"
 *               phone_number:
 *                 type: string
 *                 description: Phone number (optional, E.164 format recommended)
 *                 example: "+51987654321"
 *     responses:
 *       201:
 *         description: User successfully created
 *       400:
 *         description: Invalid request
 */
router.post('/users', registerUser);

/**
 * @swagger
 * /api/identity/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', listUsers);

/**
 * @swagger
 * /api/identity/users/me:
 *   put:
 *     summary: Update the authenticated user's information
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               display_name:
 *                 type: string
 *                 description: User's display name
 *                 example: "Yonki Toki"
 *               email:
 *                 type: string
 *                 description: Unique email address
 *                 example: "yonki@example.com"
 *               phone_number:
 *                 type: string
 *                 description: Phone number (optional, E.164 format recommended)
 *                 example: "+51987654321"
 *               location:
 *                 type: string
 *                 description: User's location (optional)
 *                 example: "Lima, Peru"
 *               status:
 *                 type: string
 *                 description: User status
 *                 example: "online"
 *               password_hash:
 *                 type: string
 *                 description: Hashed password (optional)
 *                 example: "hashedPassword123"
 *     responses:
 *       200:
 *         description: User successfully updated
 *       400:
 *         description: Invalid request
 */
router.put('/users/me', modifyUser);

/**
 * @swagger
 * /api/identity/users/me:
 *   get:
 *     summary: Get the currently logged-in user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []   # JWT requerido
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 identifier:
 *                   type: string
 *                 user_name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Unauthorized, JWT missing or invalid
 *       404:
 *         description: User not found
 */
router.get('/users/me', getCurrentUserController);


/**
 * @swagger
 * /api/identity/me/{user_name}:
 *   delete:
 *     summary: Delete the currently authenticated user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: user_name
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user to delete
 *     responses:
 *       204:
 *         description: User successfully deleted
 *       400:
 *         description: Bad request or user not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/users/me/:user_name', deleteCurrentUserController);

module.exports = router;