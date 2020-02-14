var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var localStrategy = require("passport-local");
var passport = require("passport");
var session = require("express-session");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seed");
var User = require("./models/user");
var campgroundRoutes = require("./routes/campgrounds")
var commentRoutes = require("./routes/commits")
var indexRoutes = require("./routes/index")
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
  useNewUrlParser: true
});
// seedDB()

app.use(
  session({
    secret: "my mom is the best woman",
    resave: false,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.set("view engine", "ejs");
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)
app.use(indexRoutes)



app.listen(process.env.PORT || 8080, function () {
  console.log("the yelpcomp server is runing ");
});