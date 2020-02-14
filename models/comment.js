var mongoose = require("mongoose");
var comment = mongoose.model("comment", {
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },

});
module.exports = comment