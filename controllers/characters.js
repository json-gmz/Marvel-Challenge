$(function() {
    getCharacters();
    
    $("#search-character").keyup(function(){
        getCharacters();
    });

    $("#icon-search").click(function(){
        getCharacters();
    });
});

function nextPage(){
    offsetdefault = offsetdefault + 10;
    getCharacters();
    window.scrollTo(0, 0);
}

function prevPage(){
    offsetdefault = offsetdefault - 10;
    getCharacters();
    window.scrollTo(0, 0);
}

function sortBy(sort){
    $(".sortbyoption").removeClass("active");
    $("#sortby"+sort).addClass("active");
    offsetdefault = 0;
    orderbydefault = sort;
    getCharacters();
}

function getCharacters(sort = ""){
    var timestamp = + new Date();
    
    $.ajax({
        method: "POST",
        url: "data/md5.php",
        data: { action: "getmd5", ts: timestamp, privateKey: privatekey, publicKey: publickey }
    }).done(function( hash ) {
        if ( hash != "" && hash != 0 ) {
            
            if ( offsetdefault < 0 ) {
                offsetdefault = 0;
            }

            var parameters = {};
            parameters["apikey"] = publickey;
            parameters["ts"] = timestamp;
            parameters["hash"] = hash;
            parameters["limit"] = 10;
            parameters["orderBy"] = orderbydefault;
            parameters["offset"] = offsetdefault;
            
            if ( $("#search-character").val() != "" ) {
                parameters["nameStartsWith"] = $("#search-character").val();
            }
            
            if ( sort != "" ) {
                parameters["orderBy"] = sort;
            }
            
            
            $.ajax({
                method: "GET",
                url: "http://gateway.marvel.com/v1/public/characters",
                data: parameters
            }).done(function( response ) {
                var characters = response.data.results;
                var html = "";
                if ( characters.length > 0 ) {
                    $.each( characters, function( key, data ) {
                        
                        var htmlcomic = "";
                        if ( data.comics.items.length > 0 ) {
                            var countcomic = 0;
                            $.each( data.comics.items, function( key, comic ) {
                                if ( countcomic < 4 ) {
                                    htmlcomic = htmlcomic + "<div class='col-sm-6 related-comic'>"+comic.name+"</div>";
                                    countcomic = countcomic + 1;
                                }
                            });
                        } else {
                            htmlcomic = "<div class='col-sm-12 text-center not-founds'>No related comics :(</div>";
                        }
                        
                        html = html + "<div class='col-sm-6 container-char'>\
                                            <div class='row'>\
                                                <div class='col-sm-5'>\
                                                    <img class='img-character' src='"+data.thumbnail.path+"."+data.thumbnail.extension+"'>\
                                                </div>\
                                                <div class='col-sm-7'>\
                                                    <div class='name-char'>"+data.name+"</div>\
                                                    <div class='description-short-char'>"+ (data.description!="" ? data.description.slice(0,250) : "Description not available") +"...</div>\
                                                    <div class='button-view-more'>VIEW MORE</div>\
                                                </div>\
                                            </div>\
                                            <div class='row'>\
                                                <div class='col-sm-12'>\
                                                    <div class='col-sm-12 related-comics'>Related comics</div>\
                                                    <div class='col-sm-12 '>\
                                                        "+htmlcomic+"\
                                                    </div>\
                                                </div>\
                                            </div>\
                                        </div>";
                    });
                } else {
                    html = "<div class='col-sm-12 text-center not-founds'>No related characters :(<div>";
                }
                $("#block-characters").html(html);
            })
            .fail(function() {
                alert("Error loading characters.");
            });
        }
    })
    .fail(function() {
        alert("Error generating md5.");
    });
}