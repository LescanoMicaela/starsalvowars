///DRY THIS!!!!!!
var Alpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var droppedID;
var shiptype;
var status;
var size;
var submarine = [];
var stylesheets = [  "rgba(0, 0, 0, 0.44)", "rgba(255, 0, 0, 0.49)"];
var rand = Math.floor(Math.random() * stylesheets.length);
var destroyer = [];
var carrier = [];
var patrol = [];
var battleship = [];
var salvoes = [];
var droppable = true;
var timerId;
var jump = new Audio("audio/jump.mp3")
var tie = new Audio("audio/TIE.mp3")
var audio3 = new Audio('audio/fire.mp3');
var audio5 = new Audio('audio/tf.mp3');
var alarm = new Audio("audio/alarm.mp3")
var fire = new Audio("audio/youmayfirewhenready.mp3")
var audio4 = new Audio('audio/apology.mp3');
var audio = new Audio('audio/imperial.mp3');
// var audio = new Audio('audio/swtheme.mp3');
var audio2 = new Audio('audio/lastime.mp3');
$(".ok").toggle();

$(document).ready(function () {
    $.ajax({
        url: makeUrl(),
        dataType: 'json',
        success: function (data) {
            games = data;
            // sortData(games.hits_on_me);
            // sortData(games.hits_on_oponent);
            // $(".statusMessages").hide();
            hideAndShow();
            makePlayerCommander();
            createGridsBoard();
            hideControlsForState();
            rotateShips("submarine", "rotate");
            rotateShips("destroyer", "rotate");
            rotateShips("patrol", "rotate4");
            rotateShips("battleship", "rotate3");
            rotateShips("carrier", "rotate2");
            createGrids("table-headers", "table", "table-rows", "U");
            createGrids("table-headers2", "table2", "table-rows2", "V");
            printShipsPlaced();
            refreshPage();
            gameOver();
            colorSalvo();
            placeSalvos();
            hitOpponent();
            getPlayerNames();
            showok();
            if (games.hits !=null){

                logturns(games.hits.hits_on_oponent, "hitonp2", "You have");
                logturns(games.hits.hits_on_me, "hitonp1", "Opponent has");
            }
        },
        error: function () {
            notYourGM();
        }
    })
})

$("#skip").click(function () {
    skip();
    $("#skip").hide();
});

function hideAndShow() {
    if (games.game.ships.length != 0) {
        $("#alert2").hide();
        $("#skip").hide();
        $(".hidethis").show();
        $("body").attr("data-style", "gameview2");
        $("body").css("overflow", "auto");
        $(".placeShips").toggle();
        $(".statusships").toggle();
        $("#playersInfo1").toggle();
        $("#playersInfo2").toggle();
        $(".tablesdiv").toggle();
        $(".log").show();
    }
    if (games.game.ships.length == 0) {

        audio.pause();
        audio.play();
        $(".log").hide();
        $("body").css("background-color", "black");
        $("body").css("background-image", "none");
        $("body").css("overflow", "hidden");
        $(".hidethis").slideToggle();
        $(".swhid").toggle();
        $(".fade").toggle();
        awesomeTitles();
    }
}

function sortData(data) {
    if (data != null) {
        data.sort(function (a, b) {
            var a1 = a.turn, b1 = b.turn;
            if (a1 == b1) return 0;
            return a1 > b1 ? 1 : -1;
        });
    }
}

function gametoggle() {
    $("#playersInfo1").toggle();
    $("#playersInfo2").toggle();
    $(".tables").toggle();
}

function showok() {
    if ($(".shipsboard").children().length == 16) {
        console.log("ok");
        $(".statusships").text("Are you ready?");
        $(".ok").show();
        $(".shipsboard").hide();
        $("#alert2").text("");

    } else {
        $("#alert2").text("You can rotate ships double clicking them")
        console.log("not yet");
        $(".ok").hide();
        $(".shipsboard").show();
    }

}

function skip() {
    audio.pause();
   jump.pause();
   jump.play();
    $("body").css("background-image", 'url("styles/images/stars.png")');
    $("body").css("overflow", "auto");
    $(".hidethis").fadeIn(600);
    $(".star-wars").hide();
    $(".fade").hide();
}

$(".ok").click(function createArrayShipsLocation() {
    if ($(".shipsboard").children().length > 16) {
        $("#alert").text("You must place all your ships");
    } else {
        audio5.pause();
        audio5.play();
        $(".statusships").text("Ships placed");
        submarine = modifyID($(".submarine")).get();
        destroyer = modifyID($(".destroyer")).get();
        carrier = modifyID($(".carrier")).get();
        patrol = modifyID($(".patrol")).get();
        battleship = modifyID($(".battleship")).get();
        submarine.push(modifyID2($("#submarine")));
        destroyer.push(modifyID2($("#destroyer")));
        carrier.push(modifyID2($("#carrier")));
        patrol.push(modifyID2($("#patrol")));
        battleship.push(modifyID2($("#battleship")));
        console.log(submarine, destroyer, carrier, patrol, battleship);
        setTimeout(function () {  postShipsToBackEnd()} , 2000 );
    }
});

function modifyID(element) {
    return element.parent().map(function () {
        return Alpha[this.id.split("")[0]] + (Number(this.id.split("")[1]) + 1)
    })
}

function modifyID2(element) {
    return (Alpha[element.parent().attr("id").split("")[0]] + (Number(element.parent().attr("id").split("")[1]) + 1));
}



$("#logOutBtn").click(function logout(evt) {
    evt.preventDefault();
    $.post("/api/logout")
        .done(function (e) {
            window.location.href = "games.html"
        })
    // .fail(function(e){ $("#alert").html("failed to log out")})
});

function notYourGM() {
    $("body").html(" ");
    var div = document.createElement("div");
    div.setAttribute("class", "notgm");
    var img = document.createElement("img");
    img.setAttribute("src", "styles/images/yoda-edit.png");
    img.setAttribute("class", "yoda");
    div.innerHTML = "The dark side clouds everything, impossible to see others games is.";
    $("body").append(div);
    $("body").append(img);
}

function logturns(hitson, tableid, player) {
    if (hitson != null) {
        var table = document.getElementById(tableid);
        var shipslength = {
            carrier: 5,
            battleship: 4,
            destroyer: 3,
            submarine: 3,
            patrol: 2,
            totalships: 5
        };

        for (var i = 0; i < hitson.length; i++) {
            var shiphits2 = [];
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            var td1 = document.createElement("td");
            var td2 = document.createElement("td");
            td.innerHTML = hitson[i].turn;
            tr.append(td);
            var shiphits = [];
            if (hitson[i].hit != "null") {
                for (var q = 0; q < hitson[i].hit.length; q++) {
                    turnLogDetail(hitson[i].hit[q], shipslength, shiphits, player);
                    // LogDetail(hitson[i].hit[q], carrierhit, shiphits, totalships);
                }
            }
            if (shiphits.length != 0) {
                td1.innerHTML = shiphits.join();
            } else {
                td1.innerHTML = "No hit";
            }
            td2.innerHTML = shipslength.totalships;
            tr.append(td1);
            tr.append(td2);
            table.append(tr);
        }
    }

}

function turnLogDetail(hitson, shiplength, shiphits, player) {
    shiplength[hitson.type] -= hitson.hit.length;
    if (shiplength[hitson.type] == 0) {
        $("#alert").text(player + " sunk a " + hitson.type)
        shiphits.push(hitson.type + " " + "sunk");
        shiplength.totalships = shiplength.totalships - 1;

    } else {
        shiphits.push(hitson.type + " " + hitson.hit.length);
    }
}

function makePlayerCommander() {
    for (var i = 0; i < games.game.gamePlayers.length; i++) {
        var p1 = games.game.gamePlayers[i].player.email.split("@")[0];
    }
    $("#commanderp1").text(p1);
}

function awesomeTitles() {
    setTimeout(function () {
        audio.pause();
        jump.pause();
        jump.play();
        $("body").css("background-image", 'url("styles/images/stars.png")');
        $("body").css("overflow", "auto");
        $(".swhid").slideToggle(800);
        $(".hidethis").fadeIn(300);
        // $(".star-wars").hide();
        $(".fade").hide();
        $("#skip").hide();

    }, 36500);
}



function refreshPage() {
    if ( games.Status == "WAITING_FOR_OPPONENT_TO_PLACE_SHIPS" || games.Status == "WAIT_FOR_OPPONENT_TO_PLACE_SALVOS" || (games.Status == "WAIT_FOR_OPPONENT" && games.game.ships.length !=0) ) {
        timerId = setTimeout(function () {
            window.location.reload();
            refreshPage();
        }, 5500);
    }
}

function stopRefreshing() {
    clearTimeout(timerId);
}


function postShipsToBackEnd() {
    gamePlayerId = games.id;
    $.post({
        url: "/api/games/players/" + gamePlayerId + "/ships",
        data: JSON.stringify([{shipType: "submarine", locations: submarine}, {
            shipType: "destroyer",
            locations: destroyer
        }, {shipType: "carrier", locations: carrier}, {shipType: "patrol", locations: patrol}, {
            shipType: "battleship",
            locations: battleship
        }]),
        dataType: "text",
        contentType: "application/json"
    }).done(function () {
        window.location.reload();
    }).fail(
        function (e) {
            $("#alert").text(e.responseText)
        });

}

function rotateShips(ship, rot){
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

            for (var w = 1; w < (size ); w++) {
                var split2 = droppedID2.split("");
                var abc2 = split2[0];
                var num2 = Number(split2[1]) + w;
                if ($("#" + ship).hasClass(rot) == true && num2 > 9 ) {
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
        if(droppable == true){
            // showok();
            $(this).toggleClass(rot);
        }
        // if ( $("#"+ship).hasClass(rot) == false){

        if ( $("#"+ship).hasClass(rot) == true) {
            createDivsAndAppendVertical(size,ship,droppedID2);
        }if ( $("#"+ship).hasClass(rot) == false) {
            $('.' + ship).remove();
            createDivsAndAppendHorizontal(size,ship,droppedID2);
        }})};

function createDivsAndAppendVertical(size,ship,droppedID2){
    for (i = 1; i < size; i++) {
        var div2 = document.createElement("div");
        div2.setAttribute("class", ship);
        var split3 = droppedID2.split("");
        var abc = Number(split3[0]) + i;
        var num = split3[1];
        $("#" + "" + abc + "" + num).append(div2);
    }
}

function createDivsAndAppendHorizontal(size,ship,droppedID2){
    for (k = 1; k < size; k++) {
        var div3 = document.createElement("div");
        div3.setAttribute("class", ship);
        var split = droppedID2.split("");
        var abc = split[0];
        var num = Number(split[1]) + k;
        $("#" + "" + abc + "" + num).append(div3);
    }
}

function createGrids(tableheaders, tableElement, tablerows, letter) {
    // var Alpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    var Beta = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    var tbh = document.getElementById(tableheaders);
    var table = document.getElementById(tableElement);
    var tbb = document.getElementById(tablerows);
    tr0 = document.createElement("td");
    th0 = document.createElement("tr");
    th0.append(tr0);
    for (var r = 0; r < 10; r++) {
        var tr = document.createElement("tr");
        for (var m = 0; m < 10; m++) {
            var td2 = document.createElement("td");
            td2.id = letter + Alpha[r] + Beta[m];
            tr.append(td2);
        }
        tbb.append(tr);
    }
    // table.append(tbh);
    table.append(tbb);
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function makeUrl() {
    var gamePlayerID = getParameterByName("gp");
    return '/api/game_view/' + gamePlayerID;
}

function printShipsPlaced() {
    for (i = 0; i < games.game.ships.length; i++) {
        for (k = 0; k < games.game.ships[i].location.length; k++) {
            var td = document.getElementById("U" + games.game.ships[i].location[games.game.ships[i].location.length - 1]);
            document.getElementById("U" + games.game.ships[i].location[k]).setAttribute("class", "ships");
            var img = document.createElement("img");
            img.setAttribute("class", "absoluteships");
            if (games.game.ships[i].location[0].split("")[1] != games.game.ships[i].location[1].split("")[1]) {
                img.setAttribute("src", "styles/images/" + "" + games.game.ships[i].style + ".png");
            } else {
                img.setAttribute("src", "styles/images/" + "" + games.game.ships[i].style + "2.png");
            }
        }
        td.append(img);
    }
}


function hitOpponent() {
    if (games.hits != null) {
        for (var n = 0; n < games.hits.hits_on_oponent.length; n++) {
            if (games.hits.hits_on_oponent[n].hit != null) {
                for (var k = 0; k < games.hits.hits_on_oponent[n].hit.length; k++) {
                    if( games.hits.hits_on_oponent[n].hit[k].hit != null) {
                        for (var z = 0; z < games.hits.hits_on_oponent[n].hit[k].hit.length; z++) {
                            document.getElementById("V" + games.hits.hits_on_oponent[n].hit[k].hit[z]).setAttribute("class", "hit");
                            var td5 = document.getElementById("V" + games.hits.hits_on_oponent[n].hit[k].hit[z]);
                            var img = document.createElement("img");
                            img.setAttribute("class", "firesalvo");
                            img.setAttribute("src", "styles/images/fire.png");
                            td5.append(img);
                        }
                    }
                }
            }
        }
    }
}
function getPlayerNames() {
    for (i = 0; i < games.game.gamePlayers.length; i++) {
        if (games.game.gamePlayers[i].id == games.id) {
            var p1 = games.game.gamePlayers[i].player.email.split("@")[0];
        }
        if (games.game.gamePlayers[i].id !== games.id) {
            var p2 = games.game.gamePlayers[i].player.email.split("@")[0];
        }
    }
    h1 = document.getElementById("player1Name");
    h12 = document.getElementById("player2Name");
    if (p2 == undefined) {
        p2 = "Waiting for oponent"
    }
    h1.innerHTML = p1 + " (you)";
    h12.innerHTML = "Rebel scum "+p2;
}


function createGridsBoard() {
    var Beta = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var tbh = document.getElementById("board-headers");
    var table = document.getElementById("board");
    var tbb = document.getElementById("board-rows");
    tr0 = document.createElement("td");
    th0 = document.createElement("tr");
    th0.append(tr0);
    for (var r = 0; r < 10; r++) {
        var tr = document.createElement("tr");
        for (var m = 0; m < 10; m++) {
            var td2 = document.createElement("td");
            td2.id = "" + r + "" + Beta[m];
            td2.ondragover = function allowDrop(event) {
                event.preventDefault();
            };
            td2.ondrop = forDropInTd;

            tr.append(td2);
        }
        tbb.append(tr);
    }
    table.append(tbh);
    table.append(tbb);
}

function forDropInTd(event){
    console.log("dropInTD", this);

    event.preventDefault();
    var content = event.dataTransfer.getData("content");
    shiptype = $("#"+content).attr("id");
    console.log("type",shiptype);
    size = document.getElementById(content).getAttribute("data-type");
    droppedID = event.target.id;
    console.log("ID", droppedID, event);
    if ($(this).children().length == 0 ){
        // $('.'+ content).remove();
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
                    console.log(Number(split0[0]) +""+split0[1], content)
                    console.log( $("#"+Number(split0[0])+1+  split0[1]).children() )
                    if($("#" + abc0+""+num0).children().length != 0  && ($("#" + Number(split0[0])+1 +""+split0[1]).children().attr("class") != content) && $("#" + abc0+""+num0).children().attr("class") != content ) {
                        droppable =false;
                        console.log("Theres a ship here already");
                        $("#alert").text("Theres a ship placed here already");
                    }
                    console.log(droppable)
                }
                if (droppable == true) {
                    $('.'+ content).remove();
                    $("#"+content).attr("id");
                    event.target.appendChild(document.getElementById(content));
                    showok();
                    shiptype = $("#"+content).attr("id");
                    console.log("type",shiptype)
                    console.log("showme", droppedID)
                    createDivsAndAppendVertical(size,shiptype,droppedID);
                }
            }}else{

            if( Number(droppedID.split("")[1]) > ((10-size)+1) || Number(droppedID.split("")[1]) == ((10-size)+1) ){
                console.log("Not enough space here");
                $("#alert").text("Not enough space here to place this ship");
                droppable = false;
            }else{
                for ( var q=0; q < size; q++){
                    var split0 = droppedID.split("");
                    var abc0 = split0[0];
                    var num0 = Number(split0[1]) + q;
                    console.log( Number(droppedID)+1)
                    console.log($("#" + Number(droppedID)+1).children().attr("id"))
                    // console.log(  abc0+""+ num0, $("#" + abc0+""+num0).children().attr("id"),  $("#" + abc0+""+num0).children().attr("class"), content)
                    if($("#" + abc0+""+num0).children().length != 0 && ($("#" + (Number(droppedID)+1)).children().attr("id") != content) && $("#" + abc0+""+num0).children().attr("class") != content ) {
                        droppable =false;
                        console.log("theres a ship here already");
                        $("#alert").text("Theres a ship placed here already");
                    }
                    console.log(droppable)
                }
                if (droppable == true) {
                    $('.'+ content).remove();
                    event.target.appendChild(document.getElementById(content));
                    showok();
                    // document.getElementById(content).setAttribute("class","shipab");
                    shiptype = $("#"+content).attr("id");
                    console.log("type",shiptype)
                    createDivsAndAppendHorizontal(size,shiptype,droppedID)
                } else {
                    console.log("Not space to place the ship here");
                    $("#alert").text("Not space to place the ship here");
                }
            }
        }
    }else{
        console.log("Theres a ship placed here already");
        $("#alert").text("Theres a ship placed here already");
    }
    showok();
}

function drag(ev) {
    ev.dataTransfer.setData("content", ev.target.id);
    // var img = new Image();
    // img.scr = "images/"+ ev.target.id+".png";
    // ev.dataTransfer.setDragImage(img, 8900000, 0);
    $("#alert").text("");
    droppable = true;
}

function colorSalvo() {
    for (i = 0; i < games.game.salvoes.length; i++) {
        for (k = 0; k < games.game.salvoes[i].length; k++) {
            for (y = 0; y < games.game.salvoes[i]["" + k].location.length; y++) {
                if (games.id == games.game.salvoes[i]["" + k].player_id) {
                    document.getElementById("V" + games.game.salvoes[i]["" + k].location[y]).setAttribute("class", "salvo2");
                    showResultOfFiredSslvo("V", "miss");

                } else {
                    if (document.getElementById("U" + games.game.salvoes[i]["" + k].location[y]).classList.contains("ships")) {
                        showResultOfFiredSslvo("U","fire");
                    }
                    else {
                        document.getElementById("U" + games.game.salvoes[i]["" + k].location[y]).setAttribute("class", "salvo0");
                        showResultOfFiredSslvo("U","miss");
                    }
                }
            }
        }
    }
}

function showResultOfFiredSslvo(letter,imgName ){
    var img1 = document.createElement("img");
    img1.setAttribute("src", "styles/images/" + imgName +".png");
    var tdsalvo1 = document.getElementById(letter + games.game.salvoes[i]["" + k].location[y]);
    img1.setAttribute("class", "firesalvo");
    tdsalvo1.append(img1);
}

function hideControlsForState(){
    if ( games.Status == "WAIT_FOR_OPPONENT_TO_PLACE_SALVOS"){

        $(".salvo").hide();
        $(".statusMessages").text("Rebels are attacking us. Get on target, maximum firepower.");
        $(".statusMessages").css("background-color", stylesheets[rand]);
        // $(".statusMessages").text("Reloading!");
        // $(".statusMessages").show();
    }
    else if ( games.Status == "WAIT_FOR_OPPONENT"){
        $(".salvo").hide();
        $(".statusMessages").text("Waiting for opponent");
        // $(".statusMessages").text("Reloading!");
        $(".statusMessages").show();
    } else if(games.Status == "WAITING_FOR_OPPONENT_TO_PLACE_SHIPS"){
        $(".salvo").hide();
        $(".statusMessages").text("Waiting for opponent to place ships");
        // $(".statusMessages").text("Reloading!");
        // $(".statusMessages").show();
    }
    else {
            $(".salvo").show();
             $(".statusMessages").hide();
    }
}

function gameOver(){
    if ( games.Status == "GAMEOVER_LOSE"){
        for (var i = 0; i < games.game.gamePlayers.length; i++) {
            var p1 = games.game.gamePlayers[i].player.email.split("@")[0];
        }
        audio2.pause();
        audio2.play();
    $(".statusMessages").text("You have failed me for the last time, Admiral " + p1);
    // $(".statusMessages").text("Reloading!");
    $(".statusMessages").show();
    } else if(games.Status == "GAMEOVER_WIN"){
        for (var i = 0; i < games.game.gamePlayers.length; i++) {
            var p1 = games.game.gamePlayers[i].player.email.split("@")[0];
        }
        audio4.pause();
        audio4.play();
        $(".statusMessages").text("i believe i owe you an apology, " +p1+". Your work exceeds all expectations");
        // $(".statusMessages").text("Reloading!");
        $(".statusMessages").show();
    }

}



function placeSalvos() {
    $("#table2 td").click(function () {
        var tdid = $(this).attr("id");
        console.log(tdid);
        $("#alert").text("");
        if (tdid.split("").length == 4) {
            var salvolocation = tdid.split("")[1] + "10";
        } else {
            var salvolocation = tdid.split("")[1] + tdid.split("")[2];
        }
        if ($("#" + tdid).hasClass("salvoshot") == false) {
            if (salvoes.length < 5) {
                $("#alert").text("You can place up to 5 salvos");
                if (salvoes.indexOf(salvolocation) == -1 && salvoes.length < 5 && $("#" + tdid).hasClass("salvo2") == false && $("#" + tdid).hasClass("hit") == false) {
                    $("#" + tdid).addClass("salvoshot");
                    salvoes.push(salvolocation);
                }
            } else {
                $("#alert").text("");
            }
        } else if ($("#" + tdid).hasClass("salvo2") == false && $("#" + tdid).hasClass("hit") == false) {
            console.log("bye salvo");
            $("#" + tdid).removeClass("salvoshot");
            var index = salvoes.indexOf(salvolocation);
            salvoes.splice(index, 1);
        }
        showButtonFire();
    })
}

function showButtonFire() {
    if (salvoes.length == 0) {
        $(".fire").hide();
    }
    if (salvoes.length > 0) {
        fire.play();
        $(".fire").show(500);
    }
}

$("#oksalvo").click(function postSalvoInfoToBack() {
    if (salvoes.length < 6 && salvoes.length != 0) {
        audio3.play();
        $("#oksalvo").toggle();
        setTimeout(function () {
            gamePlayerId = games.id;
            $.post({
                url: "/api/games/players/" + gamePlayerId + "/salvos",
                data: JSON.stringify(salvoes),
                dataType: "text",
                contentType: "application/json"
            }).done(function () {
                window.location.reload();
            }).fail(
                function (e) {
                    console.log(e.responseText);
                }
            );

        }, 800)
    }
})
;

