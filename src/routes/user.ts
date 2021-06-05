import express from "express"
import { Cookie } from "express-session"
import userInfoController from "../controllers/userInfo"
var router = express.Router()

module.exports = function (passport) {
  // 로그인 온보딩을 지나쳐도 되는지 안되는지
  const canPassOnboarding = (req): boolean => {
    // json문자열로 변환
    const userJsonString = JSON.stringify(req.user)
    // json object로 변환
    const userJson = JSON.parse(userJsonString)
    const company = userJson.company || ""
    const jobDepartment = userJson.jobDepartment || ""
    const career = userJson.career || ""
    if (company === "" && jobDepartment === "" && career === "")
      return false
    else
      return true
  }

  // 온보딩이 이미 완료 되었을 때 이전 페이지 저장
  router.post('/login', (req, res, next) => {
    const { backUrl } = req.body
    console.log("되긴 함? " + backUrl)

    if (backUrl) {
      // req.session["redirect"] = backUrl
      // console.log('이전 페이지 :' + req.session["redirect"])
      // console.log("sessionId" + req.session.id)
      res.cookie('backUrl', backUrl);
      res.status(200).json({
        result: "경로 저장 성공"
      })
    }
    // req.session.save(() =>
    //   
    // )
  })

  // 온보딩 해야 할때 이전 페이지로 돌아가기 및 온보딩 정보 저장
  router.post("/onboarding", userInfoController.postLoginOnboarding, (req, res) => {
    console.log("로그인 온보딩 값을 저장 했습니다")
    console.log("뀨온1" + req.session["redirect"])
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization")
    res.redirect(req.session["redirect"] || "https://www.advist.kr")
    req.session["redirect"] = ""
    console.log("뀨온2 " + req.session["redirect"])
  })

  router.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }))
  router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/user/login', session: true }),
    function (req, res) {
      if (!canPassOnboarding(req)) {
        console.log("값이 하나도 없습니다")
        // 로그인 온보딩 페이지 필요
        res.redirect('https://www.advist.kr/onboarding')
      } else {
        console.log("로그인 온보딩 값이 다 있습니다")
        // console.log("뀨1" + req.session["redirect"])
        // console.log("sessionId" + req.session.id)
        // res.redirect(req.session["redirect"] || "https://www.advist.kr")
        // req.session["redirect"] = ""
        // console.log("뀨2 " + req.session["redirect"])
        console.log("뀨1" + req.cookies.backUrl)
        res.redirect(req.cookies.backUrl || "https://www.advist.kr")
        res.cookie('backUrl', '')
        console.log("뀨2" + req.cookies.backUrl)
      }

    })
  router.get('/auth/kakao', passport.authenticate('kakao'))

  router.get('/auth/kakao/callback',
    passport.authenticate('kakao', { failureRedirect: '/user/login', session: true }),
    function (req, res) {
      if (!canPassOnboarding(req)) {
        console.log("값이 하나라도 없습니다")
        // 로그인 온보딩 페이지 필요
        res.redirect('https://www.advist.kr/onboarding')
      } else {
        console.log("로그인 온보딩 값이 다 있습니다")
        res.redirect('https://www.advist.kr')
      }

    })


  router.get('/auth/naver', passport.authenticate('naver', { scope: ['email', 'profile'] }))

  router.get('/auth/naver/callback',
    passport.authenticate('naver', { failureRedirect: '/user/login', session: true }),
    function (req, res) {
      if (!canPassOnboarding(req)) {
        console.log("값이 하나라도 없습니다")
        // 로그인 온보딩 페이지 필요
        res.redirect('https://www.advist.kr/onboarding')
      } else {
        console.log("로그인 온보딩 값이 다 있습니다")
        res.redirect('https://www.advist.kr')
      }

    })

  router.get("/getuser", (req, res) => {
    console.log("sessionId" + req.session.id)
    res.send(req.user)
  })

  router.get("/auth/logout", (req, res) => {
    req.logout()
    console.log("sessionId" + req.session.id)
    req.session.destroy(() => {
      res.clearCookie('connect.sid')
      res.send('done')
    })

  })


  return router
}