import express from "express"
import userInfo from "../controllers/userInfo"
var router = express.Router()
module.exports = function (passport) {

  // const isOkOnboarding = async () => {
  //   try {
  //     const user = await userInfo.userFindOne()
  //   } catch (error) {
  //     console.log("isOkOnboarding" + error.message)
  //     return -1
  //   }
  // }

  router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
  router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/user/login', session: true }),
    function (req, res) {
      console.log("req.user = " + req.user)
      const userJsonString = JSON.stringify(req.user)
      const userJson = JSON.parse(userJsonString)
      console.log(userJson.orderIds)
      console.log(userJson.company)
      console.log(userJson.email)
      res.redirect('https://www.advist.kr')
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