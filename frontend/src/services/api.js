import axios from 'axios'

const baseURL = '127.0.0.1:3000'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const login = async (credentials) => {
  const response = await api.post('/api/login', credentials)
  return response.data
}

export const register = async (userData) => {
  const response = await api.post('/api/register', userData)
  return response.data
}

// Function to fetch the list of movies
export const fetchMovies = async () => {
  const response = await api.get('/movies')
  return response.data
}

// Function to add a new movie
export const addMovie = async (newMovie) => {
  const response = await api.post('/movies', newMovie)
  return response.data
}

// Function to update an existing movie
export const updateMovie = async (movieId, updatedMovie) => {
  const response = await api.patch(`/movies/${movieId}`, updatedMovie)
  return response.data
}

// Function to delete a movie
export const deleteMovie = async (movieId) => {
  await api.delete(`/movies/${movieId}`)
}
