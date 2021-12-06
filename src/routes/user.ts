import express from "express"
import { RequestHandler, ParamsDictionary, Request } from "express-serve-static-core"
import { ParsedQs } from "qs"
import userInfoController from "../controllers/userInfo"
import passport from "passport"


var router = express.Router()

// 로그인 온보딩을 지나쳐도 되는지 안되는지
const canPassOnboarding = (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): boolean => {
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

// // 온보딩이 이미 완료 되었을 때 이전 페이지 저장
// router.post('/login', (req, res, next) => {
//   const { backUrl } = req.body
//   console.log("되긴 함? " + backUrl)

//   if (backUrl) {
//     res.cookie('backUrl', backUrl);
//     res.status(200).json({
//       result: "경로 저장 성공"
//     })
//   }
// })

// 온보딩 해야 할때 이전 페이지로 돌아가기 및 온보딩 정보 저장
router.post("/onboarding", userInfoController.postLoginOnboarding)

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
      res.redirect("https://www.advist.kr/oauth")
    }

  })
router.get('/auth/kakao', passport.authenticate('kakao', { scope: ['email', 'profile'] }))

router.get('/auth/kakao/callback',
  passport.authenticate('kakao', { failureRedirect: '/user/login', session: true }),
  function (req, res) {
    if (!canPassOnboarding(req)) {
      console.log("값이 하나라도 없습니다")
      // 로그인 온보딩 페이지 필요
      res.redirect('https://www.advist.kr/onboarding')
    } else {
      console.log("로그인 온보딩 값이 다 있습니다")
      res.redirect("https://www.advist.kr/oauth")
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
      res.redirect("https://www.advist.kr/oauth")
    }

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


export default router