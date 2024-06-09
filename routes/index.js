const express = require('express')
const routes = express()
const post = "./post"
const reply = "./reply"
const report = "./report"
const school = "./school"
const states = "./states"
const user = "./user"

routes.use("/post", post)
routes.use("/reply", reply)
routes.use("/report", report)
routes.use("/school", school)
routes.use("/states", states)
routes.use("/user", user)

module.exports = routes;