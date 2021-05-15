import express from "express"
import adminController from "../controllers/admin"

const router = express.Router()

router.get("/payment", adminController.getAdminPaymentHistory)
router.get("/paymentdetail/:orderId", adminController.getDetailOfAdminPaymentHistory)

router.post("/refund", adminController.refund)

export = router