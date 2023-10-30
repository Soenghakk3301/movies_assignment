import { Sequelize } from 'sequelize'

const sequelize = new Sequelize('movie_test', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch((error) => {
    console.error('Unable to connect to the database: ', error)
  })

sequelize
  .sync()
  .then(() => {
    console.log('Book table created successfully!')
  })
  .catch((error) => {
    console.error('Unable to create table : ', error)
  })

export default sequelize
