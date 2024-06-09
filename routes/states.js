const express = require('express')
const app = express()

app.get('/', (req, res, next) => {
    return res.send("HELLO")
})

module.export = app