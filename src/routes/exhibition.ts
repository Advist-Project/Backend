import express from "express"
import exhibitionController from "../controllers/exhibition"

const router = express.Router()

router.get("/", exhibitionController.exhibitions)
router.get("/best", exhibitionController.bestExhibition)
router.get("/admin", exhibitionController.adminExhibitions)

export = router