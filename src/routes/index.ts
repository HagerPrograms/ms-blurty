import express from 'express'
const routes = express()

import post from "./post"
import reply from "./reply"
import report from "./reports"
import school from "./schools"
import states from "./states"
import user from "./users"
import analytics from "./analytics"

routes.use("/post", post)
routes.use("/reply", reply)
routes.use("/reports", report)
routes.use("/schools", school)
routes.use("/states", states)
routes.use("/user", user)
routes.use("/analytics", analytics)

export default routes