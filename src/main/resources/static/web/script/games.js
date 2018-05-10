var games;
var audio5 = new Audio('audio/theme.mp3');
$(document).ready(function () {
    var listGame = $("ol[data-id=listGames]");
    var tblbody = $("tbody[data-id=leaderBoardBody]")
    $("#alert").html(" ");


    $.ajax({
        url: "http://localhost:8080/api/games",
        dataType: 'json',

        success: function (data) {

            games = data;
            audio5.pause();
            audio5.play();
            showtitle1()
            firsPage();
            createLists();
            createLeaderBoard();
            welcomeMessage();
            showtitle()
            $(".renter").click(function()
            { var url = $(this).data("id");
                window.location.href = "game.html?gp=" +""+url;
            });
            $(".join").click(function()
            { var id = $(this).data("id");
                $.post("/api/game/"+""+id+"/players")
                    .done(function(e){ window.location.href = "game.html?gp=" +""+e.GamePlayer})
                    .fail( function(e){ console.log("nope")})
            });

        }



    });

    function firsPage(){
        if (games.player !== "null") {
            $("body").css("background-image", 'url("styles/images/SbaPLTm.jpg")');
            $("#allGamesView").show();
        }
    }

    function showtitle(){
        if (games.player == "null") {
            audio5.pause();
            audio5.play();
            setTimeout(function () {
                $("body").css("background-image", 'url("styles/images/SbaPLTm.jpg")');
                $("#allGamesView").fadeIn(1000)
            }, 5000)
        }};


    function showtitle1(){
        if (games.player == "null") {
            audio5.pause();
            audio5.play();
            setTimeout(function () {
                $("#gameTitle").fadeIn(3000).fadeOut(1500)
            }, 100)
        }};
    function createLists() {
        var p1;
        var p2;
        var btn = document.createElement("button");

        for (i = 0; i < games.games.length; i++) {


            var li = document.createElement("li");
            if (games.games[i].gamePlayers[1] != null) {
                var p1 = games.games[i].gamePlayers[0].player.email;
                var p2 = games.games[i].gamePlayers[1].player.email;
            }
            else {
                var p1 = games.games[i].gamePlayers[0].player.email;
                var p2 = "waiting for player to join"

            }
            var date = new Date(games.games[i].CreationDate);
            var formattedDate = date.toLocaleString();

            li.innerHTML = formattedDate + ": " + p1 + " , " + p2;
            listGame.append(li);
            if (games.player !== "null") {
                var btn = document.createElement("button");
                var btnjoin = document.createElement("button");
                btn.setAttribute("class", "renter");
                btnjoin.setAttribute("class", "join");

                for (var k = 0; k < games.games[i].gamePlayers.length; k++) {
                    if (games.player.name === games.games[i].gamePlayers[k].player.email) {
                        btn.setAttribute("data-id", games.games[i].gamePlayers[k].id)
                    } else {
                        if (games.games[i].gamePlayers.length < 2) {
                            btnjoin.setAttribute("data-id", games.games[i].id);

                        }
                    }
                }
                if (games.player.name === p1 || games.player.name === p2) {
                    btn.innerHTML = "enter " ;
                    if ($("li:contains(p1)") || $("li:contains(p2)")) {
                        li.append(btn);
                    }
                }
                if (games.player.name !== p1 && p2 == "waiting for player to join") {
                    btnjoin.innerHTML = "join ";
                    if ($("li:contains(p2)")) {
                        li.append(btnjoin);
                    }
                }

            }
        }

    }

    function createLeaderBoard(){


        for (i=0; i < games.leaderboard.length; i++ ){
            var win = [];
            var lost = [];


            var totalScore= 0;
            var tr = document.createElement("tr");
            var td0= document.createElement("td");
            var td1= document.createElement("td");
            var td2= document.createElement("td");
            var td3= document.createElement("td");

            tr.append(td0);
            tr.append(td1);
            tr.append(td2);
            tr.append(td3);

            td0.innerHTML = games.leaderboard[i].email;

            tblbody.append(tr);
            for ( k=0; k < games.leaderboard[i].scores.length; k++){
                if (games.leaderboard[i].scores !=null){

                        totalScore += games.leaderboard[i].scores[k]

                    if ( games.leaderboard[i].scores[k] == 1){
                        win.push(games.leaderboard[i].scores[k])
                    }
                    if ( games.leaderboard[i].scores[k]== 0.0){
                        lost.push(games.leaderboard[i].scores[k])
                    }
                }
            }
            td1.innerHTML = totalScore;
            td2.innerHTML = win.length;
            console.log(win.length);
            td3.innerHTML = lost.length;



        }


    };

    // $(".join").click(function()
    // { var id = $(this).data("id");
    //     $.post("/api/game/"+""+id+"/players")
    //         .done(function(e){ window.location.href = "game.html?gp=" +""+e.GamePlayer})
    //         .fail( function(e){ $("#alert").text(e.responseJSON.error)})
    // });

   $("#logInBtn").click(function login(evt) {
        evt.preventDefault();
        var form = evt.target.form;
        if ( validate() == true){

            $.post("/api/login",
                { userName: form["username"].value,
                    password: form["password"].value })
                .done(function(e) { window.location.reload()})
                .fail(function(e) { $("#alert").html("Wrong username or password")})
        }
        // $.post("/api/login", { userName: "t.almeida@ctu.gov", password: "mole" })
        //     .done(function(e) { console.log("logged in!", e); })
        //     .fail(function(e) { console.loveng("failed to log in", e)})
    });
    //

    $("#signUpBtn").click(function signin(evt){
        evt.preventDefault();
        var form = evt.target.form;
        if (validate() == true){

            $.post("/api/players", { username: form["username"].value,  password: form["password"].value  })
                .done(login(evt))
                .fail( function(e){ $("#alert").text(e.responseJSON.error)})

        }
    });

    $("#create").click(function createGame(){
        var url = $(this).data("id");
        $.post("/api/games")
            // .done(function(e){ console.log(e.GamePlayer)})
            .done(function(e){  window.location.href = "game.html?gp=" +""+e.GamePlayer})
            .fail( function(e){ $("#alert").text(e.responseJSON.error)})

    });

    $("#logOutBtn").click(function logout(evt) {
        evt.preventDefault();
        $.post("/api/logout")
            .done(function(e) { window.location.reload() })
            .fail(function(e){ $("#alert").html("failed to log out")})
    });

    function welcomeMessage(){
     if ( games.player !=="null"){
         $("#login-form").toggle();
         $("#welcome").html("Welcome " + games.player.name.split("@")[0])
         $("#create").show();
     }else{
         $("#logout-form").toggle();
         $("#create").hide();
         $("#welcome").html("Battle of Yavin")
     }
    }



    function validate() {
        var email = document.getElementById('email').value;

        var emailFilter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;

        if (!emailFilter.test(email)) {
            $("#alert").html('Please enter a valid e-mail address');
            return false;
        }
        if (($("#password").val().trim().length === 0)){
            $("#alert").html('Password can not be blank');
            return false;

        } else{

            return true;

        }
    }

    function login(evt) {
        evt.preventDefault();
        var form = evt.target.form;
        if (validate() == true) {

            $.post("/api/login",
                {
                    userName: form["username"].value,
                    password: form["password"].value
                })
                .done(function (e) {
                    window.location.reload()
                })

        }
    };




});