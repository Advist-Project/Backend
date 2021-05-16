import express from "express"
import userInfoController from "../controllers/userInfo"

const router = express.Router()

router.post("/onboarding", userInfoController.loginOnboarding)

export = router