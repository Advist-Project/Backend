import User from '../models/user';
import { IMongoDBUser } from "../interfaces/user";
import config from '../config/config'
import passport from 'passport';
import getNextSequence from './counter';
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;

module.exports = function (app) {

  //passport 실행
  app.use(passport.initialize());
  app.use(passport.session());
  
  //strategy에서 받은 정보들을 user에 입력 
  passport.serializeUser((user: IMongoDBUser, done: any) => {
   // console.log('serializeUser', user)
    return done(null, user._id); //user._id만 보내서 데이터 양을 줄임
  });

  //serializeUser에서 분해한 user._id로부터 원래 user값들을 다시 바인딩
  passport.deserializeUser((id: string, done: any) => {
    // console.log('deserializeUser', id)
    User.findById(id, (err: Error, doc: IMongoDBUser) => {
      return done(null, doc);
    })
  })


  passport.use(new GoogleStrategy({
    clientID: config.google.client,
    clientSecret: config.google.secret,
    callbackURL: "/user/auth/google/callback",
    profileFields: ['id', 'displayName', 'email', 'thumbnail']
  },

    function (_: any, __: any, profile: any, cb: any) {
      User.findOne({ googleId: profile.id }, async (err: Error, doc: IMongoDBUser) => {

        if (err) {
          return cb(err, null);
        }

        if (!doc) {
          const userId: any = await getNextSequence("userinfo")
          const newUser = new User({
            userId: userId,
            googleId: profile.id,
            username: profile.name.givenName,
            email: profile.emails[0].value,
            thumbnail: profile.photos[0].value
          });

          await newUser.save();
          cb(null, newUser);

        }
        cb(null, doc);



      })

    }));



  passport.use(new KakaoStrategy({
    clientID: config.kakao.client,
    clientSecret: config.kakao.secret,
    callbackURL: "/user/auth/kakao/callback"
  },
  function (_: any, __: any, profile: any, cb: any) {

    User.findOne({ kakaoId: profile.id }, async (err: Error, doc: IMongoDBUser) => {

      if (err) {
        return cb(err, null);
      }

      if (!doc) {
        const userId: any = await getNextSequence("userinfo")
        const newUser = new User({
          userId: userId,
          kakaoId: profile.id,
          email: profile._json.kakao_account.email,
          username: profile.displayName,
          thumbnail: profile._json.properties.profile_image
        });

        await newUser.save();
        cb(null, newUser);
      }
      cb(null, doc);
    })

  }
));


  passport.use(new NaverStrategy({
    clientID: config.naver.client,
    clientSecret: config.naver.secret,
    callbackURL: "/user/auth/naver/callback"
  },
    function (_: any, __: any, profile: any, cb: any) {

      User.findOne({ naverId: profile.id }, async (err: Error, doc: IMongoDBUser) => {

        if (err) {
          return cb(err, null);
        }

        if (!doc) {
          const userId: any = await getNextSequence("userinfo")
          const newUser = new User({
            userId: userId,
            naverId: profile.id,
            email: profile.emails[0].value,
            username: profile.displayName,
            thumbnail: profile._json.profile_image
          });

          await newUser.save();
          cb(null, newUser);
        }
        cb(null, doc);
      })

    }
  ));


  return passport;
}