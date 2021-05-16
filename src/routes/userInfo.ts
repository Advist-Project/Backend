import express from "express"
import userInfoController from "../controllers/userInfo"

const router = express.Router()

router.post("/onboarding", userInfoController.postLoginOnboarding)
router.get("/onboarding/:userId", userInfoController.getLoginOnboarding)

export = router