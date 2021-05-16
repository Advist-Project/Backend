import express from "express"
import userInfoController from "../controllers/userInfo"

const router = express.Router()

router.get("/onboarding", userInfoController.loginOnboarding)

export = router