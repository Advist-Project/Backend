import express from "express"
import bootPayController from "../controllers/bootPay"
import orderReceiptController from "../controllers/orderReceipt"

const router = express.Router()

router.post("/cancel", bootPayController.payCancel)
router.get("/verify/:receiptId", bootPayController.payVerify)
router.get("/deletion/:orderId", bootPayController.payStop)

router.get("/checkorder/:userId", orderReceiptController.checkOrder)
router.get("/complete/:orderId", orderReceiptController.completeOrder)
router.post("/userinfo", orderReceiptController.saveUserInfo)

export = router
