import DataTypes from 'sequelize'
import sequelize from '../config/database.js'
import User from './User.js'

const Movie = sequelize.define('Movie', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  director: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})

Movie.belongsTo(User)
User.hasMany(Movie)

export default Movie
