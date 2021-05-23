import express from "express"
import itemController from "../controllers/item"

const router = express.Router()

router.get("/:itemId", itemController.getItem)
router.get("/heart/:userId", itemController.chooseHeart)
router.get("/cancelheart/:userId", itemController.cancelHeart)

export = router