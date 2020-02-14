var express = require("express")
var router = express.Router()
var Campground = require("../models/campground")
var comments = require("../models/comment")
router.get("/", function (req, res) {
    // console.log(req.user)
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/campgrounds", {
                campgrounds: campgrounds
                // currentUser: req.user
            });
        }
    });
});

router.post("/", isLogedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {
        name: name,
        image: image,
        description: description
    };
    Campground.create(newCampground, function (err, campgrounds) {
        if ((err, campgrounds)) {
            console.log(err);
        } else res.redirect("campgrounds");
    });
    res.redirect("campgrounds");
});

router.get("/new", isLogedIn, function (req, res) {
    res.render("campgrounds/new");
});

router.get("/:id", function (req, res) {
    Campground.findById(req.params.id)
        .populate("comments")
        .exec(function (err, foundCampground) {
            if (err) {
                console.log(err);
            } else {
                console.log(foundCampground);
                res.render("campgrounds/show", {
                    campground: foundCampground
                });
            }
        });
});

function isLogedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router