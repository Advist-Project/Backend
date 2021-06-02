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

// user에 온보딩 결과 값 넣기
const postLoginOnboarding = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { userId, company, jobDepartment, career } = req.body
        const params = {
            company: company,
            jobDepartment: jobDepartment,
            career: career
        }
        await userFindUpdate(userId, params)
        // res.status(200).json({
        //     result: "온보딩 update 성공"
        // })
        next()
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
        postLoginOnboarding
    }
