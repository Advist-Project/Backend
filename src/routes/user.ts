import express from "express"
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
      return false;
    else
      return true;
  }

  router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
  router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/user/login', session: true }),
    function (req, res) {
      if (!canPassOnboarding(req)) {
        console.log("값이 하나도 없습니다")
        // 로그인 온보딩 페이지 필요
        res.redirect('https://www.advist.kr')
      } else {
        console.log("로그인 온보딩 값이 다 있습니다")
        console.log(req.path)
        res.redirect('https://www.advist.kr')
      }

    })
  router.get('/auth/kakao', passport.authenticate('kakao'))

  router.get('/auth/kakao/callback',
    passport.authenticate('kakao', { failureRedirect: '/user/login', session: true }),
    function (req, res) {
      if (!canPassOnboarding(req)) {
        console.log("값이 하나라도 없습니다")
        // 로그인 온보딩 페이지 필요
        res.redirect('https://www.advist.kr')
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
        res.redirect('https://www.advist.kr')
      } else {
        console.log("로그인 온보딩 값이 다 있습니다")
        res.redirect('https://www.advist.kr')
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


  return router
}