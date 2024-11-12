import express from "express" 
import UserCtrl from "./user.controller.js"

const router = express.Router()

router.route("/").get(UserCtrl.apiGetUsers)

export default router 
