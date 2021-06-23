export interface IMongoDBUser {
    googleId?: string,
    kakaoId?: string,
    naverId?: string,
    userId?: number,
    username?: string,
    email?: string,
    thumbnail?: string,
    name?: string,
    phone?: string,
    company?: string,
    jobDepartment?: string,
    career?: string,
    createdAt?: string,
    __v?: number,
    _id?: string,
    orderIds?: [number], //구매내역
    likeItemIds?: [number] //찜한내역
}