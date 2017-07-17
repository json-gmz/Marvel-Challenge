$(function() {
    var timestamp = + new Date();
    $.ajax({
        method: "POST",
        url: "data/md5.php",
        data: { action: "getmd5", ts: timestamp, privateKey: privatekey, publicKey: publickey }
    }).done(function( hash ) {
        if ( hash != "" && hash != 0 ) {
            $.ajax({
                method: "GET",
                url: "http://gateway.marvel.com/v1/public/comics",
                data: { apikey: publickey, ts: timestamp, hash: hash }
            }).done(function( response ) {
                console.log(response);
            })
            .fail(function() {
                alert("Error loading characters.");
            });
        }
    })
    .fail(function() {
        alert("Error generating md5.");
    });;
});