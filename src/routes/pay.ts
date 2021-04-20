import express from "express"
import bootPayController from "../controllers/bootPay"
import orderReceiptController from "../controllers/orderReceipt"

const router = express.Router()

router.post("/cancel", bootPayController.payCancel)
router.get("/checkorder/:userId", orderReceiptController.CheckOrder)
router.get("/verify/:receiptId", bootPayController.payVerify)
router.get("/deletion/:orderId", bootPayController.payStop)

export = router
