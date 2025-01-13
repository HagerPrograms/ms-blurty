import express from 'express'
const app = express()
import routes from './routes'
import errorHandler from './middleware/error-handling'
import { user } from './middleware/user'
import health from './health'
import config from 'config' 

require('dotenv').config('')

const PORT = config.get('PORT') ?? 8000

app.use(express.json())
app.use(user)
app.use('/', routes)
app.use('/', health)
app.use(errorHandler)
//create user middleware with cache
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

