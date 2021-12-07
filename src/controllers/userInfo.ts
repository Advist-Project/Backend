import { NextFunction, Request, Response } from "express"
import userInfoService from "../service/userInfo"

// user에 온보딩 결과 값 넣기
const postLoginOnboarding = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { userId, company, jobDepartment, career } = req.body
        const params = {
            company: company,
            jobDepartment: jobDepartment,
            career: career
        }
        await userInfoService.userFindUpdate(userId, params)
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
        postLoginOnboarding
    }
