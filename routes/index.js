var express = require("express")
var router = express.Router()
var passport = require("passport")
var User = require("../models/user")
router.get("/", function (req, res) {
    res.render("landing");
});

router.get("/register", function (req, res) {
    res.render("register");
});

router.post("/register", function (req, res) {
    req.body.username;
    req.body.password;
    User.register(
        new User({
            username: req.body.username
        }),
        req.body.password,
        function (err, user) {
            if (err) {
                console.log(err);
                return res.redirect("register");
            } else {
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/campgrounds");
                });
            }
        }
    );
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
        // failureFlash: true
    }),
    (req, res) => {
        res.send("login works");
    }
);

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

function isLogedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router