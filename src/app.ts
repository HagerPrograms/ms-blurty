import express from 'express'
const app = express()
import routes from './routes'
import errorHandler from './middleware/error-handling'
import { user } from './middleware/user'
import health from './health'

require('dotenv').config()

const PORT = 8000

app.use(user)
app.use(express.json())
app.use('/', health)
app.use('/', routes)
app.use(errorHandler)
//create user middleware with cache
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

