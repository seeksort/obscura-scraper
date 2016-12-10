var 
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var articleSchema = new Schema({
    title:      String,
    location:   String,
    slug:       String,
    url:        String,
    img:        String,
    comments:   [{
        type: Schema.Types.ObjectId,
        ref: "Comment" 
    }]
});

var Article = mongoose.model("Article", articleSchema);
module.exports = Article;