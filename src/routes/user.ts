import express from "express"
import userInfo from "../controllers/userInfo"
var router = express.Router()
module.exports = function (passport) {

  const toJson = (req, res) => {
    const userJsonString = JSON.stringify(req.user)
    const userJson = JSON.parse(userJsonString)
    console.log(userJson.orderIds)
    console.log(userJson.company)
    console.log(userJson.email)
    if (userJson.company === undefined || userJson.company === "")
      return 0;
    else
      return 1;
  }

  router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
  router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/user/login', session: true }),
    function (req, res) {
      console.log("req.user = " + req.user)
      // const userJsonString = JSON.stringify(req.user)
      // const userJson = JSON.parse(userJsonString)
      // console.log(userJson.orderIds)
      // console.log(userJson.company)
      // console.log(userJson.email)
      if (toJson(req, res) === 0) {
        console.log("값이 없습니다")
        res.redirect('https://www.advist.kr')
      } else {
        console.log("호호호")
        res.redirect('https://www.advist.kr')
      }

    })
  router.get('/auth/kakao', passport.authenticate('kakao'))

  router.get('/auth/kakao/callback',
    passport.authenticate('kakao', { failureRedirect: '/user/login', session: true }),
    function (req, res) {
      res.redirect('https://www.advist.kr')
    })


  router.get('/auth/naver', passport.authenticate('naver', { scope: ['email', 'profile'] }))

  router.get('/auth/naver/callback',
    passport.authenticate('naver', { failureRedirect: '/user/login', session: true }),
    function (req, res) {
      res.redirect('https://www.advist.kr')
    })

  router.get("/getuser", (req, res) => {
    res.send(req.user)
  })
  router.get("/auth/logout", (req, res) => {
    req.logout()
    req.session.destroy(() => {
      res.clearCookie('connect.sid')
      res.send('done')
    })

  })


  return router
}