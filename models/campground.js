var mongoose = require("mongoose");

var Campground = mongoose.model("Campground", {
    name: String,
    image: String,
    description: String
});
module.exports = Campground
// var campgroundSchema = new mongoose.Schema({
//     name: String,
//     image: String,
//     description: String
// });
// module.exports = mongoose.model("Campground", campgroundSchema)