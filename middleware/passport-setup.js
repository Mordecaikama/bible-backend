const passport = require('passport')
var GoogleStrategy = require('passport-google-oauth2').Strategy
var GitHubStrategy = require('passport-github2').Strategy
var FacebookStrategy = require('passport-facebook').Strategy
// const AppleStrategy = require('passport-appleid')

const {
  googleclientID,
  googleclientSecret,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
} = require('../config')

passport.use(
  new GoogleStrategy(
    {
      clientID: googleclientID,
      clientSecret: googleclientSecret,
      callbackURL: '/api/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile)
    }
  )
)

// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: GITHUB_CLIENT_ID,
//       clientSecret: GITHUB_CLIENT_SECRET,
//       proxy: true,
//       callbackURL: '/api/auth/github/callback',
//     },
//     function (accessToken, refreshToken, profile, done) {
//       console.log(profile, 'profile', 'done ', done)
//       return done(err, user)
//     }
//   )
// )

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: '/api/auth/github/callback',
      scope: ['user:email'],
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile)
    }
  )
)

// passport.use(new AppleStrategy({
//     clientID: APPLE_SERVICE_ID,
//     teamId: APPLE_TEAM_ID,
//     callbackURL: 'https://www.example.net/auth/apple/callback',
//     keyIdentifier: 'RB1233456',
//     privateKeyPath: path.join(__dirname, "./AuthKey_RB1233456.p8")
//   },
//   function(accessToken, refreshToken, profile, done) {
//     const id = profile.id;

//   }
// ));

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: FACEBOOK_APP_ID,
//       clientSecret: FACEBOOK_APP_SECRET,
//       callbackURL: '/api/auth/facebook/callback',
//     },
//     function (accessToken, refreshToken, profile, cb) {
//       done(err, user)
//     }
//   )
// )

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})
