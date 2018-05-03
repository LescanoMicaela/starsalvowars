var nn;
var Alpha = ["A","B","C", "D", "E", "F", "G", "H", "I", "J"];
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
var salvoes = [];
var droppable = true;
$(".ok").toggle();

$(document).ready(function () {

    $.ajax({
        url: makeUrl(),
        dataType: 'json',

        success: function (data) {

            games = data;
            if( games.hits_on_me != null){
                games.hits_on_me.sort(function(a, b){

                    var a1= a.turn, b1= b.turn;
                    if(a1== b1) return 0;
                    return a1> b1? 1: -1;
                });
            }
            if( games.hits_on_oponent != null) {
                games.hits_on_oponent.sort(function (a, b) {
                    var a1 = a.turn, b1 = b.turn;
                    if (a1 == b1) return 0;
                    return a1 > b1 ? 1 : -1;
                });
            }
            if ( games.game.ships.length != 0){
                $("#skip").hide();
                $(".hidethis").show();
                $("body").attr("data-style","gameview2");
                $("body").css("overflow", "auto");
                // $(".hidethis").slideToggle();
                // $(".star-wars").toggle();
                // $(".fade").toggle();
                $(".placeShips").toggle();
                $(".statusships").toggle();
                $("#playersInfo1").toggle();
                $("#playersInfo2").toggle();
                $(".tablesdiv").toggle();
                $(".log").show();
            }
            if (games.game.ships.length == 0){
                $(".log").hide();
                $("body").css("background-color", "black");
                $("body").css("background-image", "none");
                $("body").css("overflow", "hidden");
                $(".hidethis").slideToggle();
                $(".swhid").toggle();
                $(".fade").toggle();
                myFunctiontitles();
            }
            commander();
            createGridsBoard();
            rotate("submarine","rotate");
            rotate("destroyer","rotate");
            rotate("patrol","rotate4");
            rotate("battleship","rotate3");
            $("#skip").click( function(){
                skip();
                $("#skip").hide();
            });
            rotate("carrier","rotate2");
            createGrids();
            createGrids2();
            colorShip ();
            colorSalvo();
            hitOpponent();
            getPlayerNames();
            showok();
            logturns(games.hits_on_oponent, "hitonp2", "You have");
            logturns(games.hits_on_me, "hitonp1","Opponent has");

        },

        error : function (){
            notYourGM();
        }

    })
});



function gametoggle(){
    $("#playersInfo1").toggle();
    $("#playersInfo2").toggle();
    $(".tables").toggle();
}

function showok(){
    if ($(".shipsboard").children().length == 16){
        console.log("ok");
        $(".statusships").text("Are you ready?");
        $(".ok").show();
    }else{
        console.log("not yet");
        $(".ok").hide();
    }
}

function skip(){
    $("body").css("background-image", 'url("styles/images/galaxy.jpg")');
    $("body").css("overflow", "auto");
    $(".hidethis").show;
    $(".star-wars").hide();
    $(".fade").hide();
}


$(".ok").click(function (){
    if ($(".shipsboard").children().length > 16){
        $("#alert").text("You must place all your ships");
    }else{
        $(".statusships").text("Ships placed");
        submarine= modifyID($(".submarine")).get();
        destroyer= modifyID($(".destroyer")).get();
        carrier= modifyID($(".carrier")).get();
        patrol= modifyID($(".patrol")).get();
        battleship= modifyID($(".battleship")).get();
        submarine.push(modifyID2($("#submarine")));
        destroyer.push(modifyID2($("#destroyer")));
        carrier.push(modifyID2($("#carrier")));
        patrol.push(modifyID2($("#patrol")));
        battleship.push(modifyID2($("#battleship")));
        console.log(submarine,destroyer,carrier,patrol,battleship);
        placeShips2();
    }})

function modifyID(element) {
    return element.parent().map(function(){
        return Alpha[this.id.split("")[0]] + (Number(this.id.split("")[1])+1)
    })
}
function modifyID2(element){
    return (Alpha[element.parent().attr("id").split("")[0]] + (Number(element.parent().attr("id").split("")[1])+1));
}

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
};

function logturns(hitson,tableid, player){
    if (hitson != null){
    var table= document.getElementById(tableid);
    var shipslength={
        carrier : 5,
        battleship : 4,
        destroyer: 3,
        submarine: 3,
        patrol: 2,
        totalships: 5,
    };

    for( var i = 0; i < hitson.length; i++){
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

            }}
        if (shiphits.length != 0) {
            td1.innerHTML = shiphits.join();
        }else {
            td1.innerHTML = "No hit";
        }
        td2.innerHTML = shipslength.totalships;
        tr.append(td1);
        tr.append(td2);
        table.append(tr);
    }}

    function turnLogDetail(hitson, shiplength,shiphits,player){
        shiplength[hitson.type] -=  hitson.hit.length;
        if (shiplength[hitson.type] == 0){
            $("#alert").text(player +" sunk a "+hitson.type)
            shiphits.push(hitson.type+" " + "sunk" );
            shiplength.totalships= shiplength.totalships - 1;

        }else{
            shiphits.push(hitson.type+" " + hitson.hit.length );
            }
    }}


    function commander(){
        for ( var i=0; i < games.game.gamePlayers.length; i++){
        var p1  = games.game.gamePlayers[i].player.email.split("@")[0];
    }
    $("#commanderp1").text(p1);
}
function myFunctiontitles() {
    setTimeout(function(){

        $("body").css("background-image", 'url("styles/images/galaxy.jpg")');
        $("body").css("overflow", "auto");
        $(".hidethis").show;
        $(".star-wars").hide();
        $(".fade").hide();
        $("#skip").hide();

    }, 25500);
}





// if ( hitson[i].hit[q].type == "battleship"){
//
//     battleshiphit -=  hitson[i].hit[q].hit.length;
//     if (battleshiphit == 0){
//         shiphits.push(hitson[i].hit[q].type+" " + "sunk" );
//         totalships= totalships - 1;
//     }else{
//         shiphits.push(hitson[i].hit[q].type+" " + hitson[i].hit[q].hit.length );
//     }
//
// }




// function postShips(){
//     var gamePlayerId = games.id;
//     fetch("/api/games/players/"+gamePlayerId+"/ships", {
//         method: 'POST',
//         body:JSON.stringify([{ shipType: "submarine", locations: submarine },{ shipType: "destroyer", locations: destroyer },{ shipType: "carrier", locations: carrier },{ shipType: "patrol", locations: patrol },{ shipType: "battleship", locations: battleship }]),
//         headers: new Headers({
//             contentType: 'application/json'
//         })
//     }).then(function (response) {
//         if (response.ok) {
//             window.location.reload();
//         }
//         throw new Error(response.statusText);
//     }).catch(function(error) {
//         alert('Ship not saved: ' + error.message);
//     });
//
// };

function placeShips2() {
    gamePlayerId = games.id;
    $.post({
        url: "/api/games/players/" + gamePlayerId + "/ships",
        data: JSON.stringify([{ shipType: "submarine", locations: submarine },{ shipType: "destroyer", locations: destroyer },{ shipType: "carrier", locations: carrier },{ shipType: "patrol", locations: patrol },{ shipType: "battleship", locations: battleship }]),
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
            for (i = 1; i < size; i++) {
                var div2 = document.createElement("div");
                div2.setAttribute("class", ship);
                var split3 = droppedID2.split("");
                var abc = Number(split3[0]) + i;
                var num = split3[1];
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


    // for (var y = 0; y < 10; y++) {
    //
    //     var td = document.createElement("td");
    //     td.innerHTML = y + 1;
    //     td.setAttribute("id" , y+1);
    //
    //     th0.appendChild(td);
    // }
    //
    // tbh.appendChild(th0);

    for (var J = 0; J < 10; J++) {
        var tr = document.createElement("tr");
        // var td3 = document.createElement("td");
        // td3.innerHTML = String.fromCharCode(65 + J);
        // td3.setAttribute("id", String.fromCharCode(65 + J));
        // tr.setAttribute("id" , String.fromCharCode(65 + J));
        // tr.append(td3);
        for (var m = 0; m < 10; m++) {

            var td2 = document.createElement("td");
            td2.id = "U"+Alpha[J]+Beta[m];


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
    var gamePlayerID =  getParameterByName("gp");
    return '/api/game_view/' + gamePlayerID;
}

function colorShip (){
    for ( i=0; i<games.game.ships.length; i++) {
        for ( k= 0; k < games.game.ships[i].location.length; k++){
            document.getElementById("U" + games.game.ships[i].location[k]).setAttribute("class", "ships");
            if ( games.game.ships[i].location[0].split("")[1] != games.game.ships[i].location[1].split("")[1]){
                var td =document.getElementById("U" + games.game.ships[i].location[games.game.ships[i].location.length -1]);
                var img = document.createElement("img");
                img.setAttribute("src", "styles/images/" +""+games.game.ships[i].style+".png");
                img.setAttribute("class", "absoluteships");
            }else{
                var td =document.getElementById("U" + games.game.ships[i].location[games.game.ships[i].location.length -1]);
                var img = document.createElement("img");
                img.setAttribute("src", "styles/images/" +""+games.game.ships[i].style+"2.png");
                img.setAttribute("class", "absoluteships");
            }
        }
        td.append(img);
    }
}

function getPlayerNames(){
    var gamePlayerId= games.id;
    var you;
    var viewer;

    for ( i=0; i< games.game.gamePlayers.length; i++){
        if ( games.game.gamePlayers[i].id == games.id) {
            var p1  = games.game.gamePlayers[i].player.email.split("@")[0];

        }
        if ( games.game.gamePlayers[i].id !== games.id){


            var p2 = games.game.gamePlayers[i].player.email.split("@")[0];
        }

    }

    h1 = document.getElementById("player1Name");

    h12 = document.getElementById("player2Name");

    if (p2 == undefined){
        p2 = "Waiting for oponent"
    }

    h1.innerHTML =  p1 + " (you)";
    h12.innerHTML = p2;


};

function hitOpponent(){
    if (games.hits_on_oponent != null){

        for (var i =0; i < games.hits_on_oponent.length; i++){
            if (games.hits_on_oponent[i].hit !=null){
                for ( var k= 0; k < games.hits_on_oponent[i].hit.length; k++){
                    if (games.hits_on_oponent[i].hit[k].hit !=null){
                        for ( var z=0; z < games.hits_on_oponent[i].hit[k].hit.length; z++){
                            document.getElementById("V" + games.hits_on_oponent[i].hit[k].hit[z]).setAttribute("class", "hit");
                            var td5 = document.getElementById("V" + games.hits_on_oponent[i].hit[k].hit[z]);
                            var img = document.createElement("img");
                            img.setAttribute("class","firesalvo");
                            img.setAttribute("src","styles/images/fire.png");
                            td5.append(img);
                        }
                    }}
            }}}
};




function createGrids2() {
    var Alpha = ["A","B","C", "D", "E", "F", "G", "H", "I", "J"];
    var Beta = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    var tbh = document.getElementById("table-headers2");
    var table = document.getElementById("table2");
    var tbb = document.getElementById("table-rows2");
    tr0 = document.createElement("td");
    th0 = document.createElement("tr");
    th0.append(tr0);


    // for (var y = 0; y < 10; y++) {
    //
    //     var td = document.createElement("td");
    //     td.innerHTML = y + 1;
    //     td.setAttribute("id" , y+1);
    //
    //     th0.appendChild(td);
    // }

    // tbh.appendChild(th0);

    for (var J = 0; J < 10; J++) {
        var tr = document.createElement("tr");
        // var td3 = document.createElement("td");
        // td3.innerHTML = String.fromCharCode(65 + J);
        // td3.setAttribute("id", String.fromCharCode(65 + J));
        // tr.setAttribute("id" , String.fromCharCode(65 + J));
        // tr.append(td3);
        for (var m = 0; m < 10; m++) {

            var td2 = document.createElement("td");
            td2.id = "V"+Alpha[J]+Beta[m];


            tr.append(td2);
        }
        tbb.append(tr);
    }
    // table.append(tbh);
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


    // for (var y = 0; y < 10; y++) {
    //
    //     var td = document.createElement("td");
    //     td.innerHTML = y + 1;
    //     td.setAttribute("id" , y+1);
    //
    //     th0.appendChild(td);
    // }
    // tbh.appendChild(th0);
    for (var J = 0; J < 10; J++) {
        var tr = document.createElement("tr");
        // var td3 = document.createElement("td");
        // td3.innerHTML = String.fromCharCode(65 + J);
        // td3.setAttribute("id", String.fromCharCode(65 + J));
        // tr.setAttribute("id" , String.fromCharCode(65 + J));
        // tr.append(td3);
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

                console.log("ID", droppedID, event);
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
                                console.log( $("#" + abc0+""+num0).children().attr("id") )
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
                            console.log( $("#" + abc1+""+num1).children().attr("id") )
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
                showok()};

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
                    var img1= document.createElement("img");
                    img1.setAttribute("src","styles/images/miss.png");
                    var tdsalvo1 =document.getElementById("V" + games.game.salvoes[i][""+k].location[y]);
                    img1.setAttribute("class", "firesalvo");
                    tdsalvo1.append(img1);
                    // document.getElementById("V" + games.game.salvoes[i][""+k].location[y]).innerHTML = games.game.salvoes[i][""+k].turn;
                }

                else {
                    if (document.getElementById("U" + games.game.salvoes[i][""+k].location[y]).classList.contains("ships")){
                        var img= document.createElement("img");
                        img.setAttribute("src","styles/images/fire.png");
                        var tdsalvo =document.getElementById("U" + games.game.salvoes[i][""+k].location[y]);
                        img.setAttribute("class", "firesalvo");
                        tdsalvo.append(img);
                        // document.getElementById("U" + games.game.salvoes[i][""+k].location[y]).setAttribute("class", "hit");

                        // document.getElementById("U" + games.game.salvoes[i][""+k].location[y]).innerHTML = games.game.salvoes[i][""+k].turn;

                    }
                    else {

                        document.getElementById("U" + games.game.salvoes[i]["" + k].location[y]).setAttribute("class", "salvo0");
                        // document.getElementById("U" + games.game.salvoes[i][""+k].location[y]).innerHTML = games.game.salvoes[i][""+k].turn
                        var img3= document.createElement("img");
                        img3.setAttribute("src","styles/images/miss.png");
                        var tdsalvo3 =document.getElementById("U" + games.game.salvoes[i][""+k].location[y]);
                        img3.setAttribute("class", "firesalvo");
                        tdsalvo3.append(img3);
                    }
                }
            }
        }
    }


    $("#table2 td").click( function(){
        var tdid = $(this).attr("id");
        console.log(tdid);
        $("#alert").text("");
        if(  tdid.split("").length == 4 ){
            var salvolocation= tdid.split("")[1] + "10";
        }else{
            var salvolocation= tdid.split("")[1] + tdid.split("")[2];
        }
        if (  $("#"+tdid).hasClass("salvoshot") == false && tdid.split("").length > 1 ) {
            if (salvoes.length < 5) {
                $("#alert").text("You can place up to 5 salovos");
                $("#" + tdid).addClass("salvoshot");
                if (salvoes.indexOf(salvolocation) == -1 && salvoes.length < 5 && $("#" + tdid).hasClass("salvo2") == false  && $("#" + tdid).hasClass("hit") == false ) {
                    console.log(tdid);
                    salvoes.push(salvolocation);

                }
            } else {

                console.log("hola k pay")
            }
        } else{
            if ($("#" + tdid).hasClass("salvo2") == false  && $("#" + tdid).hasClass("hit") == false ){
                console.log("bye salvo");
                $("#" + tdid).removeClass("salvoshot");
                var index = salvoes.indexOf(salvolocation);
                salvoes.splice(index, 1);
            }}
        showbuttonfire();
    });

    function showbuttonfire(){
        if ( salvoes.length == 0){
            $(".fire").hide();
        }if ( salvoes.length > 0){
            $(".fire").show(500);
        }
    };



    $("#oksalvo").click(function(){
        if (salvoes.length < 6 && salvoes.length!=0 ){
            gamePlayerId = games.id;
            $.post({
                url: "/api/games/players/" + gamePlayerId + "/salvos",
                data: JSON.stringify(salvoes),
                dataType: "text",
                contentType: "application/json"}).done(function () {
                window.location.reload();
            }).fail(
                function(e){ console.log(e.responseText);
                });
        }

    })

}

