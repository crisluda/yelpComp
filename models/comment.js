var mongoose = require("mongoose");
var comment = mongoose.model("comment", {
    text: String,
    author: String,
});
module.exports = comment