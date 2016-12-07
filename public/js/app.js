// Listener: populate articles when button clicked
$(document.body).on('click', '.location-btn', function(){
    var query = $(this).text().slice(0,1).toLowerCase() + $(this).text().slice(1);
    console.log(query)
    $.ajax({
        url: '/find/' + query,
        method: 'GET'
    }).done(function(res){
        $('.collapsible').empty();
        res.forEach(function(article){
            $('.collapsible').append(
                '<li><div class="collapsible-header">' + 
                article.location.toUpperCase() + ' - ' + article.title + '</div>' + 
                '<div class="collapsible-body" article-data="' + 
                article._id + '"><p>' + 
                article.slug +'<a href="' + article.url + '"> Read more...</a><br>' + 
                '<a class="waves-effect waves-light btn get-comments-btn">Comments (<span>0</span>)</a><a class="waves-effect waves-light btn leave-comment-btn">Leave a Comment</a></p></div>'
            )
        })
    })
});

// Listener: populate comments TODO
$(document.body).on('click', '.get-comments-btn', function(){
    var articleId = $(this).parents('div').attr('article-data');
    $.ajax({
        url: '/comments/' + articleId,
        method: GET
    }).done(function(res){
        // TODO define what should be retrieved and sent back
    })
});

// Listener: pop up comment box TODO
$(document.body).on('click', 'get-comments-btn', function(){
    var query = $(this).text().slice(0,1).toLowerCase() + $(this).text().slice(1);
    console.log(query)
    $.ajax({
        url: '/find/' + query,
        method: 'GET'
    }).done(function(res){
        $('.collapsible').empty();
        res.forEach(function(article){
            $('.collapsible').append(
                '<li><div class="collapsible-header">' + 
                article.location.toUpperCase() + ' - ' + article.title + '</div>' + 
                '<div class="collapsible-body"><p>' + 
                article.slug +'<a href="/' + article.url + '"> Read more...</a><br>' + 
                '<a class="waves-effect waves-light btn">Comments (<span>0</span>)</a><a class="waves-effect waves-light btn">Leave a Comment</a></p></div>'
            )
        })
    })
});