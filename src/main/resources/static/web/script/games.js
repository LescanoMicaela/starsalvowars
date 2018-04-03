var games;
$(document).ready(function () {
    var listGame = $("ol[data-id=listGames]");
    var tblbody = $("tbody[data-id=leaderBoardBody]");

    $.ajax({
        url: "http://localhost:8080/api/games",
        dataType: 'json',

        success: function (data) {

            games = data;
            createLists();
            createLeaderBoard();

        }



    })
    function createLists(){

        for ( i=0; i< games.games.length; i++){
           var li= document.createElement("li");
           if ( games.games[i].gamePlayers[1] != null) {
              var p1= games.games[i].gamePlayers[0].player.email;
               var p2= games.games[i].gamePlayers[1].player.email;
           }
           else {
               var p2 = "waiting for player to join"
           }
           var date = new Date(games.games[i].CreationDate);
            var formattedDate = date.toLocaleString();
            li.innerHTML = formattedDate + ": " + p1 + " , " + p2;
               listGame.append(li);

        }
    }

    function createLeaderBoard(){


        for (i=0; i < games.leaderboard.length; i++ ){
            var win = [];
            var lost = [];
            var tied = [];

            var totalScore= 0;
            var tr = document.createElement("tr");
            var td0= document.createElement("td");
            var td1= document.createElement("td");
            var td2= document.createElement("td");
            var td3= document.createElement("td");
            var td4= document.createElement("td");
            tr.append(td0);
            tr.append(td1);
            tr.append(td2);
            tr.append(td3);
            tr.append(td4);
            td0.innerHTML = games.leaderboard[i].email;

            tblbody.append(tr);
            for ( k=0; k < games.leaderboard[i].scores.length; k++){
                if (games.leaderboard[i].scores[k].score !=null){

                        totalScore += games.leaderboard[i].scores[k].score;

                if (games.leaderboard[i].scores[k].score == 0.5){
                        tied.push(games.leaderboard[i].scores[k].score)
                    }
                    if ( games.leaderboard[i].scores[k].score == 1){
                        win.push(games.leaderboard[i].scores[k].score)
                    }
                    if ( games.leaderboard[i].scores[k].score == 0.0){
                        lost.push(games.leaderboard[i].scores[k].score)
                    }
                }
            }
            td1.innerHTML = totalScore;
            td2.innerHTML = win.length;
            td3.innerHTML = lost.length;
            td4.innerHTML = tied.length;


        }


    };
   $("#logInBtn").click(function login(evt) {
        evt.preventDefault();
        var form = evt.target.form;
        $.post("/api/login",
            { userName: form["username"].value,
                password: form["password"].value })
            .done(function(e) { window.location.reload() })
            .fail(function(e) { console.log("failed to log in", e)})
        // $.post("/api/login", { userName: "t.almeida@ctu.gov", password: "mole" })
        //     .done(function(e) { console.log("logged in!", e); })
        //     .fail(function(e) { console.log("failed to log in", e)})
    });
    //
    $("#logOutBtn").click(function logout(evt) {
        evt.preventDefault();
        $.post("/api/logout")
            .done(function(e) { window.location.reload() })
            .fail(function(e){console.log("failed to log out", e)})
    });

});