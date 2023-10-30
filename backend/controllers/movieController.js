import { StatusCodes } from 'http-status-codes'
import Movie from '../models/Movie.js'
import User from '../models/User.js'
import { checkPermissions } from '../utils/checkPermissions.js'
import { deleteImage, saveImage } from '../utils/utils.js'

// Retrieve all movies
const getAllMovies = async (req, res) => {
  const movies = await Movie.findAll({
    include: {
      model: User,
      attributes: ['id', 'name', 'role'],
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'userId', 'UserId'],
    },
  })

  if (!movies) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'No movies found' })
  }

  const movieCount = movies.length

  res.status(StatusCodes.OK).json({ movies, movieCount })
}

// Retrieve a movie by ID
const getMovieById = async (req, res) => {
  const { id } = req.params
  const movie = await Movie.findByPk(id)

  checkPermissions(req.user, movie)

  if (!movie) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Movie not found' })
  }

  res.json(movie)
}

// Add a new movie
const addMovie = async (req, res) => {
  const { title, director, year } = req.body
  const { userId } = req.user

  const imageFile = req.file

  if (!imageFile) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Image file is required' })
  }

  const imageName = saveImage(imageFile) // Implement the saveImage function

  const movie = await Movie.create({
    title,
    director,
    year,
    image: imageName,
    UserId: userId,
  })

  res
    .status(StatusCodes.CREATED)
    .json({ message: 'Movie added successfully', movie })
}

// Update an existing movie
const updateMovie = async (req, res) => {
  const { id } = req.params
  const { title, director, year } = req.body
  const imageFile = req.file // Assuming you allow updating the image

  const movie = await Movie.findByPk(id)

  if (!movie) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'Movie not found' })
  }

  checkPermissions(req.user, movie)

  // Check if an image file was provided, and save it if necessary
  if (imageFile) {
    // delete previous image
    if (movie.image) {
      deleteImage(movie.image) // Implement the deleteImage function
    }
    // save image
    const imageName = saveImage(imageFile)
    // update image
    await Movie.update(
      { title, director, year, image: imageName },
      { where: { id } }
    )
  } else {
    await Movie.update({ title, director, year }, { where: { id } })
  }

  res.json({ message: 'Movie updated successfully' })
}

// Delete an existing movie with image
const deleteMovie = async (req, res) => {
  const { id } = req.params

  const movie = await Movie.findByPk(id)
  if (!movie) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'Movie not found' })
  }

  checkPermissions(req.user, movie)

  const imageName = movie.image

  if (imageName) {
    deleteImage(imageName) // Implement the deleteImage function
  }

  await Movie.destroy({ where: { id } })
  res.status(StatusCodes.OK).json({ message: 'Movie deleted successfully' })
}

export default {
  getAllMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  getMovieById,
}
