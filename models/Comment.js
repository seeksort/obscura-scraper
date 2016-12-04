var 
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var commentSchema = new Schema({
    comment_title: String,
    body: String,
    date: Date
});

var Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;