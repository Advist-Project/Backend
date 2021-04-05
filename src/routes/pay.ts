import express from "express";
import controller from "../controllers/pay";

const router = express.Router();

router.post('/cancel', controller.payCancel);
router.get('/verify/:receiptId', controller.payVerify);

export = router;