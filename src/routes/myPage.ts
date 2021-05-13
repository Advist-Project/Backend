import express from "express"
import mypageController from "../controllers/myPage"

const router = express.Router()

router.get("/payment/:userId", mypageController.getMyPaymentHistory)
router.get("/paymentdetail/:orderId", mypageController.getDetailOfMyPaymentHistory)

export = router