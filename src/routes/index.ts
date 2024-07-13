import express from 'express'
const routes = express()

import post from "./post"
import reply from "./reply"
import report from "./reports"
import school from "./schools"
import states from "./states"
import user from "./users"
import analytics from "./analytics"

//contains getting posts and interacting with posts
routes.use("/posts", post)
//contains getting replies and interacting with replies
routes.use("/replies", reply)
//contains getting reports and interacting with reports
routes.use("/reports", report)
//contains getting schools and interacting with schools
routes.use("/schools", school)
//contains getting states and interacting with states
routes.use("/states", states)
//contains getting users and interacting with users
routes.use("/users", user)
//contains getting analytics and interacting with analytics
routes.use("/analytics", analytics)

export default routes