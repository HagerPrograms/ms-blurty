import express from 'express'
const app = express()

import routes from './routes'
import errorHandler from './middleware/error-handling'

app.use(express.json())
app.use(errorHandler)
app.use('/', routes)


app.listen(8000, () => {
    console.log(`Server is running on port ${8000}`);
  });