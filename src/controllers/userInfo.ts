import { NextFunction, Request, Response } from "express"
import user from "../models/user"

// userId로 user정보 찾기
const userFindOne = async (id: number) => {
    try {
        return await user.findOne(
            { userId: id })
    }
    catch (error) {
        console.log("userFindOne" + error.message)
    }
}

// user정보 업데이트
const userFindUpdate = async (id: number, param: any) => {
    try {
        await user.findOneAndUpdate(
            { userId: id },
            { $set: param },
            { new: true })
    }
    catch (error) {
        console.log("userFindUpdate" + error.message)
    }
}
// 로그인 온보딩 기존 값 보여주기-> 필요 없는듯..ㅎ
// const getLoginOnboarding = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const userId = parseInt(req.params.userId)
//         const userInfo = await userFindOne(userId)
//         if (userInfo === null || userInfo === undefined) {
//             res.status(501).json({
//                 message: "userId에 맞는 정보가 없습니다"
//             })
//         } else {
//             const onboarding = {
//                 "userId": userInfo["userId"] || "",
//                 "realEmail": userInfo["realEmail"] || "",
//                 "company": userInfo["company"] || "",
//                 "jobDepartment": userInfo["jobDepartment"] || "",
//                 "career": userInfo["career"] || ""
//             }
//             res.status(200).json({
//                 result: onboarding
//             })
//         }

//     }
//     catch (error) {
//         res.status(500).json({
//             message: error.message
//         })
//     }
// }

// user에 온보딩 결과 값 넣기
const postLoginOnboarding = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { userId, realEmail, company, jobDepartment, career } = req.body
        const params = {
            realEmail: realEmail,
            company: company,
            jobDepartment: jobDepartment,
            career: career
        }
        await userFindUpdate(userId, params)
        res.status(200).json({
            result: "온보딩 update 성공"
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
export default
    {
        userFindOne,
        userFindUpdate,
        // getLoginOnboarding,
        postLoginOnboarding
    }
