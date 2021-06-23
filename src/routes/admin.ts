import express from "express"
import adminController from "../controllers/admin"

const router = express.Router()

router.get("/payment", adminController.getAdminPaymentHistory)
router.get("/paymentdetail/:orderId", adminController.getDetailOfAdminPaymentHistory)

router.get("/user", adminController.getUserInfos)

router.post("/refund", adminController.refund)
router.post("/newexhibition", adminController.newExhibitionSave)
router.post("/updateexhibition", adminController.updateExhibition)

export = router