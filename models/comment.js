var mongoose = require("mongoose");
var comment = mongoose.model("comment", {
    text: String,
    author: String,
    created: {
        type: Date,
        default: Date.now
    }

});
module.exports = comment