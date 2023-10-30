import express from 'express'
import movieController from '../controllers/movieController.js'

import multer from 'multer'
import {
  authenticateUser,
  authorizePermissions,
} from '../middlewares/authMiddlewares.js'

// Set up Multer storage and file name configuration
const storage = multer.memoryStorage()
const upload = multer({ storage })

const router = express.Router()

// Retrieve all movies
router.get('/', movieController.getAllMovies)

// Retrieve movie by id
router.get('/:id', movieController.getMovieById)

// Add a new movie
router
  .route('/')
  .post(
    [authenticateUser, authorizePermissions('admin')],
    upload.single('image'),
    movieController.addMovie
  )

// update an existing movie
router
  .route('/:id')
  .patch(
    [authenticateUser, authorizePermissions('admin')],
    upload.single('image'),
    movieController.updateMovie
  )

// Delete an existing movie
router
  .route('/:id')
  .delete(
    [authenticateUser, authorizePermissions('admin')],
    movieController.deleteMovie
  )

export default router
