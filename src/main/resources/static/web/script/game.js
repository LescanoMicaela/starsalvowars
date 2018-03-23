var nn;
$(document).ready(function () {

    $.ajax({
        url: makeUrl(),
        dataType: 'json',

        success: function (data) {

            games = data;
//
            createGrids();
            colorShip ();
            getPlayerNames();
        }
//
    })
});
    function createGrids() {
        var Alpha = ["A","B","C", "D", "E", "F", "G", "H", "I", "J"];
        var Beta = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
        var tbh = document.getElementById("table-headers");
        var table = document.getElementById("table");
        var tbb = document.getElementById("table-rows");
        tr0 = document.createElement("td");
        th0 = document.createElement("tr");
        th0.append(tr0);


        for (var y = 0; y < 10; y++) {

            var td = document.createElement("td");
            td.innerHTML = y + 1;
            td.setAttribute("id" , y+1);

            th0.appendChild(td);
        }

        tbh.appendChild(th0);

        for (var J = 0; J < 10; J++) {
            var tr = document.createElement("tr");
            var td3 = document.createElement("td");
            td3.innerHTML = String.fromCharCode(65 + J);
            td3.setAttribute("id", String.fromCharCode(65 + J));
            tr.setAttribute("id" , String.fromCharCode(65 + J));
            tr.append(td3);
            for (var m = 0; m < 10; m++) {

                var td2 = document.createElement("td");
                td2.id = "U"+Alpha[J]+Beta[m];


                tr.append(td2);
            }
            tbb.append(tr);
        }
        table.append(tbh);
        table.append(tbb);
    }


    function getParameterByName(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }

    function makeUrl() {
        var gamePlayerID =  getParameterByName("gp");
        return '/api/game_view/' + gamePlayerID;
    }

    function colorShip (){


        for ( i=0; i<games.game.ships.length; i++) {
            for ( k= 0; k < games.game.ships[i].location.length; k++){
                document.getElementById("U" + games.game.ships[i].location[k]).style.background="pink";

            }
        }
    }

    function getPlayerNames(){
        var gamePlayerId= games.id;
        var you;
        var viewer;

        for ( i=0; i< games.game.gamePlayers.length; i++){
            if ( games.game.gamePlayers[i].id == games.id) {
               var p1  = games.game.gamePlayers[i].player.email;

            }
           if ( games.game.gamePlayers[i].id !== games.id){


                   var p2 = games.game.gamePlayers[i].player.email;
               }

            }

        h1 = document.getElementById("player1Name");

        h12 = document.getElementById("player2Name");

        if (p2 == undefined){
            p2 = "Waiting for oponent"
        }

            h1.innerHTML = p1 + "(you)";
            h12.innerHTML = p2;


    }
// }






