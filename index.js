const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const session = require("express-session");


const app = express();
const username = "kelly";
const password = "secret";

const localStrategy = new LocalStrategy({
        usernameField: "myusername",
        passwordField: "mypassword"
    }, (formUsername, formPassword, done) => {
    console.log("Inside localStrategy")
    console.log("Username:", formUsername);
    console.log("Password:", formPassword);
    if (username === formUsername && password === formPassword) {
        const user = {
            username: formUsername,
            password: formPassword
        };
        return done(null, user);
    }
    return done(null, false);
});

passport.serializeUser(function(user, done) {
    console.log("in serialize", user)
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    console.log("in deserialze", username)
    done(null, {username, password});
});

passport.use(localStrategy);
app.use(session({secret: "somethingalsjfklasjfk"}))
app.use(bodyParser.urlencoded());
app.use(passport.initialize());
app.use(passport.session());


app.set('view engine', 'ejs');

app.get("/", function(req, res) {
    res.render('loginform');
});

app.post("/", passport.authenticate('local'), function(req, res) {
    console.log(req.body);
    const formUsername = req.body.username;
    const formPassword = req.body.password;
    if (username === formUsername && password === formPassword) {
        return res.redirect("/");
    } else {
        return res.send("failure")
    }
});

const ensureAuthenticated = (req, res, next) => {
    console.log("Authenticated:", req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next()
    }
    return res.sendStatus(401);
}

app.get(
    "/kellynakedpics", 
    ensureAuthenticated, (req, res) => {
        res.render("nakedpics")
    });

app.listen(3000, () => console.log("app is running"));
