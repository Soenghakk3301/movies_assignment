import express from 'express'
import authController from '../controllers/authController.js'

const router = express.Router()

// register
router.post('/register', authController.register)

// login
router.post('/login', authController.login)

// logout
router.get('/logout', authController.logout)

export default router
