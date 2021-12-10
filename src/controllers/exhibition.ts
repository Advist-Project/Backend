import { NextFunction, Request, Response } from "express"
import _, { isObject } from "lodash"
import Exhibition from "../interfaces/exhibition";
import exhibitionService from "../service/exhibition"
import TypeCheck from "../service/typeCheck";



const bestExhibition = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const exhibition = await exhibitionService.findFirstExhibition
        console.log(exhibition)
        const itemIdArray = exhibition?.itemId
        const Items: any = await exhibitionService.referenceOfExhibition(itemIdArray)
        if (Items === -1) {
            res.status(501).json({
                error: "itemId에 오류가 있습니다."
            })
        } else {
            if (exhibition === null) {
                res.status(502).json({
                    error: "rank(우선순위)가 1등인게 없습니다."
                })
            }
            else
                exhibition.itemInfo = Items
            res.status(200).json({
                exhibition: exhibition
            })
        }
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
const exhibitions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const exhibition = await exhibitionService.findPeriodExhibition("main")
        if (exhibition === undefined || exhibition === null) {
            res.status(502).json({
                message: "해당 exhibition에 있는 exhibitionId는 없는 id입니다."
            })
        } else {
            // iteminfo 붙이는 로직
            for (let i = 0; i < exhibition?.length; i++) {
                const itemIdArray = exhibition[i]?.itemId
                const Items: any = await exhibitionService.referenceOfExhibition(itemIdArray)
                if (Items === -1) {
                    res.status(501).json({
                        error: "itemId에 오류가 있습니다."
                    })
                } else if (Items === 0) {
                    res.status(502).json({
                        error: "itemId와 itemInfo매칭에 오류가 생김"
                    })
                } else {
                    exhibition[i].itemInfo = Items
                }
            }
            res.status(200).json({
                exhibition: exhibition
            })
        }

    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

// 어드민용
const adminExhibitions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const exhibition = await exhibitionService.findPeriodExhibition("admin") as Exhibition[]
        if (exhibition === undefined || exhibition === null) {
            res.status(502).json({
                message: "해당 exhibition에 있는 exhibitionId는 없는 id입니다."
            })
        } else {
            // iteminfo 붙이는 로직
            for (let i = 0; i < exhibition.length; i++) {
                const itemIdArray = exhibition[i]?.itemId as [number]
                const Items = await exhibitionService.referenceOfExhibitionAdmin(itemIdArray) as 0 | -1 | Exhibition["itemInfo"]
                if (TypeCheck.isExhibitionInfo(Items)) {
                    exhibition[i].itemInfo = Items
                }
                else {
                    if (Items == 0) {
                        res.status(502).json({
                            error: "itemId와 itemInfo매칭에 오류가 생김"
                        })
                        throw new Error("itemId와 itemInfo매칭에 오류가 생김")
                    }
                    else if (Items == -1) {
                        res.status(501).json({
                            error: "itemId가 undefined입니다."
                        })
                        throw new Error("itemId가 undefined입니다.")
                    }
                    else {
                        res.status(500).json({
                            error: "예상하지 못한 에러가 발생했습니다."
                        })
                        throw new Error("예상하지 못한 에러가 발생했습니다.")
                    }
                }


            }
            res.status(200).json({
                exhibition: exhibition
            })
        }
    }
    catch (error: any) {
        console.log(error) // logger로 찍는 것이 더욱 바람직함
    }
}


export default {
    bestExhibition,
    exhibitions,
    adminExhibitions,
}