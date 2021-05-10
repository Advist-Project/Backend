import express from "express"
import bootPayController from "../controllers/bootPay"
import orderReceiptController from "../controllers/orderReceipt"

const router = express.Router()

router.post("/cancel", bootPayController.payCancel)
router.get("/verify/:receiptId", bootPayController.payVerify)

router.get("/checkorder/:userId", orderReceiptController.checkOrder)
router.get("/complete/:orderId", orderReceiptController.completeOrder)
router.get("/aftercomplete/:orderId", orderReceiptController.afterCompleteOrder)

router.post("/coachingdate", orderReceiptController.saveCoachingDate)
router.post("/coachingcontent", orderReceiptController.saveConsultationOfCoaching)
router.post("/userinfo", orderReceiptController.saveUserInfo)

export = router
