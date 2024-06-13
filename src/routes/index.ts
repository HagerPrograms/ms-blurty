import express from 'express'
const routes = express()
import post from "./post"
import reply from "./reply"
import report from "./reports"
import school from "./schools"
import states from "./states"
import user from "./users"

routes.use("/post", post)
routes.use("/reply", reply)
routes.use("/report", report)
routes.use("/school", school)
routes.use("/states", states)
routes.use("/user", user)

export default routes