var mongoose = require("mongoose");

//schema for the comment section

var CommentSchema = mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
});

// exporting

module.exports = mongoose.model("Comment", CommentSchema);
