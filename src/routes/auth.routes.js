const { Router } = require('express');

const { loginUser, registerUser } = require('../controllers/auth.controller')

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Endpoints for auth users
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user using username and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "yonkitoki"
 *               password:
 *                 type: string
 *                 example: "hashedPassword123"
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid username or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 */
router.post('/login', loginUser);


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user and automatically log them in
 *     description: Creates a new user and returns a JWT token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_name
 *               - email
 *               - password_hash
 *             properties:
 *               user_name:
 *                 type: string
 *                 example: "yonkitoki"
 *               password_hash:
 *                 type: string
 *                 example: "hashedPassword123"
 *               email:
 *                 type: string
 *                 example: "yonki@example.com"
 *               phone_number:
 *                 type: string
 *                 example: "+51987654321"
 *     responses:
 *       201:
 *         description: User successfully created and logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid request or user already exists
 */
router.post('/register', registerUser);

module.exports = router;