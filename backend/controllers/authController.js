import { StatusCodes } from 'http-status-codes'
import CustomAPIError from '../errors/index.js'
import User from '../models/User.js'
import { createTokenUser, attachCookiesToResponse } from '../utils/index.js'

import bcrypt from 'bcrypt'

// Register a new user
const register = async (req, res) => {
  const { email, name, password } = req.body

  const emailAlreadyExists = await User.findOne({ email })
  if (emailAlreadyExists) {
    throw new CustomAPIError.BadRequestError('Email already exists')
  }

  // first registered user is an admin
  const isFirstAccount = (await User.count()) === 0
  const role = isFirstAccount ? 'admin' : 'user'

  // Hash the user's password
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  })

  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })

  res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

// Login
const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new CustomAPIError.BadRequestError(
      'Please provide email and password'
    )
  }
  const user = await User.findOne({ email })

  if (!user) {
    throw new CustomAPIError.UnauthenticatedError('Invalid Credentials')
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)

  if (!isPasswordCorrect) {
    throw new CustomAPIError.UnauthenticatedError('Invalid Credentials')
  }

  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })

  res.status(StatusCodes.OK).json({ user: tokenUser })
}

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  })
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' })
}

export default {
  login,
  register,
  logout,
}
