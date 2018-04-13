var nn;
var droppedID;
var outside = 0;
var shiptype;
var status;
var size;
$(document).ready(function () {

    $.ajax({
        url: makeUrl(),
        dataType: 'json',

        success: function (data) {

            games = data;
            createGridsBoard();
            // rotateShips("submarine");
            // rotateShips("patrol");
            // rotateShips("destroyer");
            // rotateShips("battleship");
            // rotateShips("carrier");
            // document.getElementById("submarine").addEventListener("click", function(){
            // })
            rotate("submarine","rotate");
            rotate("destroyer","rotate");
            rotate("patrol","rotate4");
            rotate("battleship","rotate3");
            rotate("carrier","rotate2");

            createGrids();
            createGrids2();
            colorShip ();
            colorSalvo();
            getPlayerNames();


        },

        error : function (){
            notYourGM();
        }

    })
});

$("#logOutBtn").click(function logout(evt) {
    evt.preventDefault();
    $.post("/api/logout")
        .done(function(e) { window.location.href = "games.html" })
        // .fail(function(e){ $("#alert").html("failed to log out")})
});

    function notYourGM(){
       $("body").html(" ");
       var div = document.createElement("div");
       div.setAttribute("class", "notgm");
       var img = document.createElement("img");
       img.setAttribute("src", "https://www.maxim.com/.image/t_share/MTQyMjgyNzA4ODcyMDc5MTg5/rawgif.gif");
       div.innerHTML = "NOT YOUR GAME";
        $("body").append(div);
        $("body").append(img);


    }
function postShips(){
    var gamePlayerId = games.id;

    fetch("api/games/players/"+gamePlayerId+"/ships", {
        method: 'POST',
        body:JSON.stringify([{ shipType: shipType, locations: shipLocations },{ shipType: shipType, locations: shipLocations }]),
        headers: new Headers({
            contentType: 'application/json'
        })
    }).then(function (response) {
        if (response.ok) {
            window.location.reload();
        }
        throw new Error(response.statusText);
    }).catch(function(error) {
        alert('Ship not saved: ' + error.message);
    });

};

    function placeShips2() {
        gamePlayerId = games.id;
        $.post({
            url: "api/games/players/" + gamePlayerId + "/ships",
            data: JSON.stringify([{shipType: shipType, locations: locations}, {
                shipType: shipType,
                locations: locations
            }, {shipType: shipType, locations: locations}]),
            dataType: "text",
            contentType: "application/json"
        }).done(function () {
            window.location.reload();
        }).fail(
            function(e){ $("#alert").text(e.responseText)
        });

    }

function rotate(ship, rot){
    $("#"+ship).dblclick(function(){
        console.log("holi"+ship)
        $(this).toggleClass(rot);
        $('.'+ ship).remove();
        var droppedID2 = $(this).parent().attr('id');
        size = $(this).attr("data-type");
        // if ( $("#"+ship).hasClass(rot) == false){
            console.log($("#"+ship).hasClass(rot));
        if ( $("#"+ship).hasClass(rot) == true) {
            for (i = 1; i < size; i++) {
                var div2 = document.createElement("div");
                div2.setAttribute("class", ship);
                var split = droppedID2.split("");
                var abc = Number(split[0]) + i;
                console.log("abc" + abc);
                var num = split[1];
                console.log("num" + num);
                console.log("" + abc + "" + num);
                $("#" + "" + abc + "" + num).append(div2);
            }
        }if ( $("#"+ship).hasClass(rot) == false) {
                        $('.' + ship).remove();
                        for (k = 1; k < size; k++) {
                            var div3 = document.createElement("div");
                            div3.setAttribute("class", ship);
                            var split = droppedID2.split("");
                            var abc = split[0];
                            var num = Number(split[1]) + k;
                            $("#" + "" + abc + "" + num).append(div3);
                }


        }})};




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
                document.getElementById("U" + games.game.ships[i].location[k]).setAttribute("class", "ships");

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

function createGrids2() {
    var Alpha = ["A","B","C", "D", "E", "F", "G", "H", "I", "J"];
    var Beta = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    var tbh = document.getElementById("table-headers2");
    var table = document.getElementById("table2");
    var tbb = document.getElementById("table-rows2");
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
            td2.id = "V"+Alpha[J]+Beta[m];


            tr.append(td2);
        }
        tbb.append(tr);
    }
    table.append(tbh);
    table.append(tbb);
}


function createGridsBoard() {
    var Alpha = ["A","B","C", "D", "E", "F", "G", "H", "I", "J"];
    var Beta = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    var tbh = document.getElementById("board-headers");
    var table = document.getElementById("board");
    var tbb = document.getElementById("board-rows");
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
            td2.id = ""+J+""+Beta[m];
            td2.ondragover = function allowDrop(event){
                event.preventDefault();
            };
            td2.ondrop = function drop(event){
                event.preventDefault();
                var content = event.dataTransfer.getData("content");
                size = document.getElementById(content).getAttribute("data-type");
                droppedID = event.target.id;
                console.log("1", (Number(droppedID.split("")[1])));
                console.log("2", (Number(droppedID.split("")[1])) + Number(size)-2);
            // && (Number(droppedID.split("")[1]) < ((Number(droppedID.split("")[1])) + Number(size)-2))
                if ($(this).children().length == 0 ){
                    event.target.appendChild(document.getElementById(content));
                    console.log($(this).attr("id"));
                    shiptype = $(this).children().attr("id");
                    status =  $(this).children().attr("class");
                    if ($("#"+content).hasClass("rotate") || $("#"+content).hasClass("rotate2") || $("#"+content).hasClass("rotate3") || $("#"+content).hasClass("rotate4")){
                        for (i = 1; i < size; i++) {
                            var split = droppedID.split("");
                            var abc = Number(split[0]) + i;
                            var num = split[1];
                            var div2 = document.createElement("div");
                            div2.setAttribute("class", shiptype);
                            $("#" + "" + abc + "" + num).append(div2);
                    }}else{

                        for (i = 1; i < size; i++) {
                            var split = droppedID.split("");
                            var abc = split[0];
                            var num = Number(split[1]) + i;
                            var div2 = document.createElement("div");
                            div2.setAttribute("class", shiptype);
                            $("#" + "" + abc + "" + num).append(div2);
                        }
                    }
                        }
            };

            tr.append(td2);
        }
        tbb.append(tr);
    }
    table.append(tbh);
    table.append(tbb);
}

function drag(ev){
        ev.dataTransfer.setData("content", ev.target.id);
    $('.'+ ev.target.id).remove();
}




function colorSalvo(){
    for ( i=0; i<games.game.salvoes.length; i++) {
        for ( k= 0; k < games.game.salvoes[i].length; k++){
            for (y=0; y< games.game.salvoes[i][""+k].location.length; y++){
                if (games.id == games.game.salvoes[i][""+k].player_id){


                        document.getElementById("V" + games.game.salvoes[i][""+k].location[y]).setAttribute("class", "salvo2");

                    document.getElementById("V" + games.game.salvoes[i][""+k].location[y]).innerHTML = games.game.salvoes[i][""+k].turn;
                }

                else {
                    if (document.getElementById("U" + games.game.salvoes[i][""+k].location[y]).classList.contains("ships")){
                        document.getElementById("U" + games.game.salvoes[i][""+k].location[y]).setAttribute("class", "hit");
                        document.getElementById("U" + games.game.salvoes[i][""+k].location[y]).innerHTML = games.game.salvoes[i][""+k].turn;

                    }
                    else {

                        document.getElementById("U" + games.game.salvoes[i]["" + k].location[y]).setAttribute("class", "salvo0");
                        document.getElementById("U" + games.game.salvoes[i][""+k].location[y]).innerHTML = games.game.salvoes[i][""+k].turn
                    }
                }
            }
        }
    }

    // $(function (){
    //     $('.draggable').draggable({
    //         cursor: 'move',
    //         revert: true
    //     });
    // });
    //
    // $(function() {
    //     $('.dropin2').droppable({
    //         drop: handleDrop,
    //         out: function() {
    //             $( this ).droppable( "option", "disabled", false );
    //         },
    //     });
    // });
    //
    // function handleDrop( event, ui ) {
    //
    //     ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
    //     ui.draggable.draggable( 'option', 'revert', false );
    //     $( this ).droppable( "option", "disabled", true );
    //
    //
    // }



}

