import express from "express";
import controller1 from "../controllers/bootPay";
import controller2 from "../controllers/orderReceipt";

const router = express.Router();

router.post('/cancel', controller1.payCancel)
router.get('/checkorder/:userId', controller2.CheckOrder)
router.get('/verify/:receiptId', controller1.payVerify)

export = router;