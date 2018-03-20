var games;
$(document).ready(function () {
    var listGame = $("ol[data-id=listGames]");

    $.ajax({
        url: "http://localhost:8080/api/games",
        dataType: 'json',

        success: function (data) {

            games = data;
            createLists();
        }



    })
    function createLists(){
        for ( i=0; i< games.length; i++){
           var li= document.createElement("li");
           if ( games[i].gamePlayers[1] != null) {
              var p1= games[i].gamePlayers[0].player.email;
               var p2= games[i].gamePlayers[1].player.email;
           }
           else {
               var p2 = "waiting for player to join"
           }
           var date = new Date(games[i].CreationDate);
            var formattedDate = date.toLocaleString();
            li.innerHTML = formattedDate + ": " + p1 + " , " + p2;
               listGame.append(li);

        }
    }
});