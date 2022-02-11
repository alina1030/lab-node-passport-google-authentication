const { compareSync } = require('bcrypt');
const passport = require('passport')
// const LocalStrategy = require('passport-local').Strategy;

const UserModel = require('./database')

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: "989638940746-nu8cg8gjpbcfslr3p67qdvin8v1ru6e5.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:5000/auth/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(accessToken, profile);
    UserModel.findOne({ googleId: profile.id}, (err,user) =>{  
    if (err) return cb(err,null);
    if(!user){
        let newUser = new UserModel({
            googleId: profile.id,
            name: profile.displayName
        })

        newUser.save();
        return cb(null,newUser);
    }else{
        return cb(null, user)
      }
   })
 }
));
passport.serializeUser(function(user,done){
    done(null, user.id);
});

passport.deserializeUser(function (id,done){
    UserModel.findById(id,function(err, user){
        done(err,user);
    });
});