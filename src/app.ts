import express from 'express'
const app = express()
import routes from './routes'
import errorHandler from './middleware/error-handling'
import { user } from './middleware/user'

require('dotenv').config()

app.use(express.json())
app.use(user)
app.use('/', routes)
app.use(errorHandler)

//create user middleware with cache
app.listen(8000, () => {
    console.log(`Server is running on port ${8000}`);
  });

