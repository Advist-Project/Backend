import express from "express"
import itemController from "../controllers/item"

const router = express.Router()

router.get("/:itemId", itemController.getItem)
router.get("/heart/:userId", itemController.chooseHeart)
router.get("/cancelheart/:userId", itemController.cancelHeart)
router.get("/admin/allitem", itemController.allItem)
router.get("/admin/alliteminfo", itemController.allItemInfo)

export = router