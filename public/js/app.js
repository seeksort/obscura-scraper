// On Page Load: populate Texas articles
$(document).ready(function(){
    setTimeout(function(){
        var place = 'Texas';
        var query = 'texas';
        $.ajax({
            url: '/find/' + query,
            context: document.body,
            method: 'GET'
        }).done(function(res){
            $('.collapsible').empty();
            res.forEach(function(article){
                var commentsCount = article.comments.length;
                $('.collapsible').append(
                    '<li><div class="collapsible-header">' + 
                    article.location.toUpperCase() + ' - ' + article.title + '</div>' + 
                    '<div class="collapsible-body" article-data="' + 
                    article._id + '"><p>' + 
                    article.slug +'<a href="' + article.url + '"> Read more...</a><br>' + 
                    '<a class="waves-effect waves-light btn get-comments-btn" href="#modal1">Comments (<span>' +  commentsCount + '</span>)</a><a class="waves-effect waves-light btn leave-comment-btn" href="#modal2">Leave a Comment</a></p></div>'
                )
            })
            $('#cool-sites-text').empty();
            $('#cool-sites-text').append(
                '<h4>Cool sites in <span id="place-name" class="pink-text text-darken-4">' + place + '</span></h4>'
            );
        })
    }, 500);
});

// Listener: populate articles when button clicked
$(document.body).on('click', '.location-btn', function(){
    var place = $(this).text();
    var query = place.slice(0,1).toLowerCase() + $(this).text().slice(1);
    $.ajax({
        url: '/find/' + query,
        method: 'GET'
    }).done(function(res){
        $('.collapsible').empty();
        res.forEach(function(article){
                var commentsCount = article.comments.length;
            $('.collapsible').append(
                '<li><div class="collapsible-header">' + 
                article.location.toUpperCase() + ' - ' + article.title + '</div>' + 
                '<div class="collapsible-body" article-data="' + 
                article._id + '"><p>' + 
                article.slug +'<a href="' + article.url + '"> Read more...</a><br>' + 
                '<a class="waves-effect waves-light btn get-comments-btn" href="#modal1">Comments (<span>' +  commentsCount + '</span>)</a><a class="waves-effect waves-light btn leave-comment-btn" href="#modal2">Leave a Comment</a></p></div>'
            )
        })
        $('#cool-sites-text').empty();
        $('#cool-sites-text').append(
            '<h4>Cool sites in <span id="place-name" class="pink-text text-darken-4">' + place + '</span></h4>'
            );
    })
});

// Listener: populate comments
$(document.body).on('click', '.get-comments-btn', function(){
    var articleId = $(this).parents('div').attr('article-data');
    console.log('articleId ' + articleId)
    $.ajax({
        url: '/comments/' + articleId,
        method: 'GET'
    }).done(function(res){
        console.log(res);
        $('#modal1 > div > div > ul').empty();
        res.forEach(function(comment){
            $('#modal1 > div > div > ul').append(
                '<li class="collection-item"><h5>' + comment.comment_title + '</h5><h6>by ' + 'COMMENT AUTHOR PLACEHOLDER' +  '</h6><p>' + comment.body + '</p><a class="waves-effect waves-light btn comment-delete-btn" id="' + comment._id + '">Delete Comment</a></li>'
                );
        })

    })
});


// Listener: pop up comment box TODO
$(document.body).on('click', '.leave-comment-btn', function(){
    var query = $(this).text().slice(0,1).toLowerCase() + $(this).text().slice(1);
    console.log(query)
    $.ajax({
        url: '/find/' + query,
        method: 'GET'
    }).done(function(res){
        $('.collapsible').empty();
        res.forEach(function(article){
            var commentsCount = res.comments.length;
            $('.collapsible').append(
                '<li><div class="collapsible-header">' + 
                article.location.toUpperCase() + ' - ' + article.title + '</div>' + 
                '<div class="collapsible-body"><p>' + 
                article.slug +'<a href="/' + article.url + '"> Read more...</a><br>' + 
                '<a class="waves-effect waves-light btn">Comments (<span>' + commentsCount + '</span>)</a><a class="waves-effect waves-light btn">Leave a Comment</a></p></div>'
            )
        })
    })
});

// Listener: DELETE comment request and remove comment from DOM
$(document.body).on('click', '.comment-delete-btn', function(){
    var commentId = $(this).attr('id');
    $.ajax({
        url: 'comments/delete/' + commentId,
        method: 'DELETE'
    }).done(function(res){
        $('#' + commentId).parent().remove();
        console.log(res);
    })
})
// Modal listener
$('.modal').modal();