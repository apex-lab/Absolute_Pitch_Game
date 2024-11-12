import express from "express"
import cors from "cors" 
import absolute_pitch from "./api/absolutepitch.route.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1/absolutepitch", absolute_pitch)
app.use("*",(req,res) => res.status(404).json({error: "not found"}))

export default app 