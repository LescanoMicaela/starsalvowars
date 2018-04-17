var nn;
var droppedID;
var outside = 0;
var shiptype;
var status;
var size;
var submarine= [];
var destroyer= [];
var carrier= [];
var patrol= [];
var battleship= [];
var droppable = true;
$(".ok").toggle();
$(document).ready(function () {

    $.ajax({
        url: makeUrl(),
        dataType: 'json',

        success: function (data) {

            games = data;
            createGridsBoard();
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
            showok();

        },

        error : function (){
            notYourGM();
        }

    })
});


function gametoggle(){
    $("#playersInfo").toggle();
    $(".tables").toggle();
}

function showok(){
if ($(".shipsboard").children().length == 0){
    console.log("ok");
    $(".ok").toggle();
}else{
    console.log("not yet");
}
}

$(".ok").click(function (){
    if ($(".shipsboard").children().length != 0){
        $("#alert").text("You must place all your ships");
    }else{
        var Alpha = ["A","B","C", "D", "E", "F", "G", "H", "I", "J"];
         submarine= $(".submarine").parent().map(function() {
             return Alpha[this.id.split("")[0]] + this.id.split("")[1] ;
         })
             .get()
        destroyer= $(".destroyer").parent().map(function() {
            return Alpha[this.id.split("")[0]] + this.id.split("")[1] ;
        })
            .get()
        carrier= $(".carrier").parent().map(function() {
            return Alpha[this.id.split("")[0]] + this.id.split("")[1] ;
        })
            .get()
        patrol= $(".patrol").parent().map(function() {
            return Alpha[this.id.split("")[0]] + this.id.split("")[1] ;
        })
            .get()
        battleship= $(".battleship").parent().map(function() {
            return Alpha[this.id.split("")[0]] + this.id.split("")[1] ;
        })
            .get()
        submarine.push(Alpha[$("#submarine").parent().attr("id").split("")[0]] + $("#submarine").parent().attr("id").split("")[1]);
        destroyer.push(Alpha[$("#destroyer").parent().attr("id").split("")[0]] + $("#destroyer").parent().attr("id").split("")[1]);
        carrier.push(Alpha[$("#carrier").parent().attr("id").split("")[0]] + $("#carrier").parent().attr("id").split("")[1]);
        patrol.push(Alpha[$("#patrol").parent().attr("id").split("")[0]] + $("#patrol").parent().attr("id").split("")[1]);
        battleship.push(Alpha[$("#battleship").parent().attr("id").split("")[0]] + $("#battleship").parent().attr("id").split("")[1]);
        console.log(submarine,destroyer,carrier,patrol,battleship);
        placeShips2();


}})


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
    fetch("/api/games/players/"+gamePlayerId+"/ships", {
        method: 'POST',
        body:JSON.stringify([{ shipType: "submarine", locations: submarine },{ shipType: "destroyer", locations: destroyer },{ shipType: "carrier", locations: carrier },{ shipType: "patrol", locations: patrol },{ shipType: "battleship", locations: battleship }]),
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
            url: "/api/games/players/" + gamePlayerId + "/ships",
            data: JSON.stringify([{ shipType: "submarine", locations: submarine },{ shipType: "destroyer", locations: destroyer },{ shipType: "carrier", locations: carrier },{ shipType: "patrol", locations: patrol },{ shipType: "battleship", locations: battleship }]),
            dataType: "text",
            contentType: "application/json"
        }).done(function () {
            // window.location.reload();
            $(".placeships").toggle();
            $(".tablesdiv").toggle();
        }).fail(
            function(e){ $("#alert").text(e.responseText)
        });

    }

function rotate(ship, rot){
    $("#"+ship).dblclick(function(){
        console.log("holi"+ship)
        // document.getElementById(ship).setAttribute("class","shipab");
        droppable = true;

        console.log(1,droppable);
        size = $(this).attr("data-type");
        $('.'+ ship).remove();
        var droppedID2 = $(this).parent().attr('id');
        if ( droppedID2 !=null) {
            for (var q = 1; q < (size); q++) {
                var split0 = droppedID2.split("");
                var abc0 = Number(split0[0]) + q;
                var num0 = split0[1];
                if ($("#" + ship).hasClass(rot) == false && abc0 > 9) {
                    droppable = false;
                    console.log(1,"Not enough space to rotate vertical ship here");
                    $("#alert").text("Not enough space to space to rotate the ship");
                }
                if ($("#" + ship).hasClass(rot) == false && $("#" + abc0 + "" + num0).children().length != 0 ) {
                    droppable = false;
                    console.log(2,"Not enough space to place the ship here")
                    $("#alert").text("Not enough space to place the ship here");
                }}

            for (var w = 1; w < (size - 1); w++) {
                var split2 = droppedID2.split("");
                var abc2 = split2[0];
                var num2 = Number(split2[1]) + w;
                if ($("#" + ship).hasClass(rot) == true && num0 > (10-size)) {
                    droppable = false;
                    console.log(3,"Not enough space to space to rotate the ship")
                    $("#alert").text("Not enough space to space to rotate the ship");
                }
                if ($("#" + ship).hasClass(rot) == true && $("#" + abc2 + "" + num2).children().length != 0) {
                    droppable = false;
                    console.log(4,"Not enough space to place the ship here")
                    $("#alert").text("Not enough space to place the ship here");
                }
            }
        }
        if(droppable){
            // showok();
            $(this).toggleClass(rot);
        }
        // if ( $("#"+ship).hasClass(rot) == false){

        if ( $("#"+ship).hasClass(rot) == true) {
            for (i = 1; i < size; i++) {
                var div2 = document.createElement("div");
                div2.setAttribute("class", ship);
                var split = droppedID2.split("");
                var abc = Number(split[0]) + i;
                var num = split[1];
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
    var Beta = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
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
                if ($(this).children().length == 0 ){
                    $('.'+ content).remove();
                    // console.log($(this).attr("id"));
                    status =  $(this).children().attr("class");
                    if ( ($("#"+content).hasClass("rotate") || $("#"+content).hasClass("rotate2") || $("#"+content).hasClass("rotate3") || $("#"+content).hasClass("rotate4") ) ){
                        if( Number(droppedID.split("")[0]) > ((10-(size-1)) ) || Number(droppedID.split("")[0]) == ((10-(size-1)) ) ){
                            droppable = false;
                            console.log("Not enough space here");
                            $("#alert").text("Not enough space to place a ship here");
                            // console.log(((10-size)+2));
                            // console.log(Number(droppedID.split("")[0]) + "is bigger than"+ ((10-size+1)) );
                        }else{
                            for ( var q=0; q < size; q++){
                                var split0 = droppedID.split("");
                                var abc0 = Number(split0[0]) + q;
                                var num0 = split0[1];
                                // console.log($("#" + abc0+""+num0).children().length == 0)
                                if($("#" + abc0+""+num0).children().length != 0 && $("#" + abc0+""+num0).children().attr("id") != content ) {
                                    droppable =false;
                                    console.log("Theres a ship here already");
                                    $("#alert").text("Theres a ship placed here already");
                                }
                                console.log(droppable)
                            }
                            if (droppable){
                        event.target.appendChild(document.getElementById(content));
                                showok();
                                // document.getElementById(content).setAttribute("class","shipab");
                                shiptype = $(this).children().attr("id");
                        for (i = 1; i < size; i++) {
                            var split = droppedID.split("");
                            var abc = Number(split[0]) + i;
                            var num = split[1];
                            var div2 = document.createElement("div");
                            div2.setAttribute("class", shiptype);
                            $("#" + "" + abc + "" + num).append(div2);
                        }}}}else{

                        if( Number(droppedID.split("")[1]) > ((10-size)+1) || Number(droppedID.split("")[1]) == ((10-size)+1) ){
                            console.log("Not enough space here");
                            $("#alert").text("Not enough space here to place this ship");
                            droppable = false;
                            // console.log(((10-size)+2));
                            // console.log(Number(droppedID.split("")[1]) + "is bigger than"+ ((10-size+1)) );
                        }else{
                            var split1 = droppedID.split("");
                            var abc1 = split1[0];
                            var num1 = Number(split1[1])+ 1;
                            // if ( ($("#" + abc1+""+num1).children().length == 0) && shiptype !==){
                            for ( var q=0; q < size; q++){
                                var split0 = droppedID.split("");
                                var abc0 = split0[0];
                                var num0 = Number(split0[1]) + q;
                                // console.log($("#" + abc0+""+num0).children().length == 0)
                                        if($("#" + abc0+""+num0).children().length != 0 && $("#" + abc0+""+num0).children().attr("id") != content) {
                                    droppable =false;
                                    console.log("theres a ship here already");
                                            $("#alert").text("Theres a ship placed here already");
                                        }
                                        console.log(droppable)
                            }
                            if ( droppable ){
                                event.target.appendChild(document.getElementById(content));
                                showok();
                                // document.getElementById(content).setAttribute("class","shipab");
                                shiptype = $(this).children().attr("id");
                                for (i = 1; i < size; i++) {
                                    var split = droppedID.split("");
                                    var abc = split[0];
                                    var num = Number(split[1]) + i;
                                    var div2 = document.createElement("div");
                                    div2.setAttribute("class", shiptype);
                                    $("#" + "" + abc + "" + num).append(div2);

                            }}else{
                                console.log("Not space to place the ship here");
                                $("#alert").text("Not space to place the ship here");

                            }
                        }
                    }
                        }else{
                    console.log("Theres a ship placed here already");
                    $("#alert").text("Theres a ship placed here already");
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
    var img = new Image();
    ev.dataTransfer.setDragImage(img, 10, 0);
    $("#alert").text("");
    droppable = true;
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

