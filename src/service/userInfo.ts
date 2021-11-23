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

export default
    {
        userFindOne,
        userFindUpdate
    }
