import express from "express"
import itemController from "../controllers/item"

const router = express.Router()

router.get("/:itemId", itemController.getItem)

export = router