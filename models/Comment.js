var 
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var commentSchema = new Schema({
    commenter_name: String,
    comment_title:  String,
    body:           String,
    date:           String
});

var Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;