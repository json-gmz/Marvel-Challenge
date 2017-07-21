$(function() {
    getCharacters();
    
    $("#search-character").keyup(function(){
        getCharacters();
    });

    $("#icon-search").click(function(){
        getCharacters();
    });
});

function sortBy(sort){
    $(".sortbyoption").removeClass("active");
    $("#sortby"+sort).addClass("active");
}

function getCharacters(sort = ""){
    var timestamp = + new Date();
    
    $.ajax({
        method: "POST",
        url: "data/md5.php",
        data: { action: "getmd5", ts: timestamp, privateKey: privatekey, publicKey: publickey }
    }).done(function( hash ) {
        if ( hash != "" && hash != 0 ) {

            var parameters = {};
            parameters["apikey"] = publickey;
            parameters["ts"] = timestamp;
            parameters["hash"] = hash;
            parameters["limit"] = 10;
            parameters["orderBy"] = "-modified";
            
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
                console.log(characters);
                var html = "";
                if ( characters.length > 0 ) {
                    $.each( characters, function( key, data ) {
                        html = html + "<div class='col-sm-6 container-char'>\
                                            <div class='row'>\
                                                <div class='col-sm-6'>\
                                                    <img src='./front/img/icons/characters.png'>\
                                                </div>\
                                                <div class='col-sm-6'>\
                                                    <div class='name-char'>"+data.name+"</div>\
                                                    <div class='description-short-char'>"+data.description.slice(0,150)+"...</div>\
                                                    <div class='button-view-more'>VIEW MORE</div>\
                                                </div>\
                                            </div>\
                                            <div class='row'>\
                                                <div class='col-sm-12'>\
                                                    <div class='col-sm-12 related-comics'>Related comics</div>\
                                                    <div class='col-sm-6'>comic 1</div>\
                                                    <div class='col-sm-6'>comic 2</div>\
                                                    <div class='col-sm-6'>comic 3</div>\
                                                    <div class='col-sm-6'>comic 4</div>\
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