import express from "express"
import mypageController from "../controllers/myPage"
import reviewController from "../controllers/review"

const router = express.Router()

router.get("/payment/:userId", mypageController.getMyPaymentHistory)
router.get("/paymentdetail/:orderId", mypageController.getDetailOfMyPaymentHistory)
router.get("/uncheckedall/:userId", mypageController.deleteAllLikesList)

router.post("/review", reviewController.makeReview)

export = router