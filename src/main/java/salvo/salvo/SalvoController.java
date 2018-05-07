package salvo.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.*;


import static java.util.stream.Collectors.toList;
import static salvo.salvo.GameState.PLACESHIPS;

@RestController
@RequestMapping("/api")

public class SalvoController {
    @Autowired
    private ShipRepository repositoryship;
    @Autowired
    private GameRepository repositorygame;
    @Autowired
    private GamePlayerRepository repositorygameplayer;
    @Autowired
    private ShipRepository shipRepository;
    @Autowired
    private SalvoRepository salvoRepository;
    @Autowired
    private PlayerRepository repositoryPlayer;
    @Autowired
    private ScoreRepository repositoryscore;





    private Map<String, Object> makeGameDTO(Game game) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        Set<GamePlayer> gamePlayers = game.getGamePlayers();
        dto.put("id", game.getId());
        dto.put("CreationDate", game.getCreationDate());
        dto.put("gamePlayers", gamePlayers.stream()
                                            .map(gamePlayer -> makegamePlayerDTO(gamePlayer))
                                            .collect(toList()));
        return dto;
    }

    private Map<String, Object> makegamePlayerDTO(GamePlayer gamePlayer) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", gamePlayer.getId());
        dto.put("player", makeplayerDTO(gamePlayer.getPlayer()));
        if(gamePlayer.getScore() !=null){

            dto.put("score", gamePlayer.getScore().getScore());
        }
        else{
            dto.put("score", null);
        }
        return dto;
    }

    private Map<String, Object> makeplayerDTO(Player player) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", player.getId());
        dto.put("email", player.getUserName());
        return dto;
    }




    private Map<String, Object> makeShipDTO(Ship ship) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();

        dto.put("style", ship.getShipType());
        dto.put("location", ship.getLocations());
        return dto;
    }

    private Map<String, Object> makeSalvoDTO(Salvo salvo){
        Map<String, Object> dto = new LinkedHashMap<>();
       dto.put("turn", salvo.getTurn());
        dto.put("player_id", salvo.getGamePlayer().getId());
        dto.put("location", salvo.getSalvoLocations());
        return dto;
        }

    private List<Object> makeSalvosDTO(GamePlayer gamePlayer) {
        List<Object> salvoList = new ArrayList<>();
        Set<Salvo> salvos = gamePlayer.getSalvoes();
        salvoList = salvos.stream()
                .map( salvo -> makeSalvoDTO(salvo))
                .collect(toList());
        return  salvoList;
    }

    private GamePlayer getOponent (GamePlayer gameplayer1){
        Game game = gameplayer1.getGame();
        GamePlayer oponent = game.getGamePlayers().stream().filter( a -> !a.equals(gameplayer1)).findFirst().orElse(null);
        return oponent;
    }

    private Map<String, Integer> makeFleet() {
        Map<String, Integer> map = new HashMap<>();
        map.put("destroyer", 3);
        map.put("submarine", 3);
        map.put("patrol", 2);
        map.put("battleship", 4);
        map.put("carrier", 5);
        map.put("total", 5);
        return map;
    }


    private Integer getShipsLeft (GamePlayer gameplayer){
       Integer total;

        Map<String, Integer> shipsLength = makeFleet();
        GamePlayer oponent = getOponent(gameplayer);
        Set<Ship> opononetShips = oponent.getShips();
        Set<Salvo> player1Salvo = gameplayer.getSalvoes();
        Set<Ship> player1Ships = gameplayer.getShips();
        Set<Salvo> oponentSalvo = oponent.getSalvoes();
        allShipsHitInSalvoes(player1Salvo,opononetShips,shipsLength);
        total = shipsLength.get("total");
//       allShipsHitInSalvoes(oponentSalvo,player1Ships, shipsLengthoponent);
//       dto.put("Left_me_ships", shipsLengthoponent.get("total"));
        return total;
    }



    private Map<String, Object> makehitsDTO (GamePlayer gameplayer){
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
//        Map<String, Integer> shipsLength = makeMap2("destroyer", 3, "submarine", 3);
        Map<String, Integer> shipsLength = makeFleet();
        Map<String, Integer> shipsLengthoponent = makeFleet();
        GamePlayer oponent = getOponent(gameplayer);
        Set<Ship> opononetShips = oponent.getShips();
        Set<Salvo> player1Salvo = gameplayer.getSalvoes();
        Set<Ship> player1Ships = gameplayer.getShips();
        Set<Salvo> oponentSalvo = oponent.getSalvoes();
        dto.put("hits_on_oponent", allShipsHitInSalvoes(player1Salvo,opononetShips,shipsLength));
        dto.put("hits_on_me", allShipsHitInSalvoes(oponentSalvo,player1Ships, shipsLengthoponent));
        return dto;
    }

    private List<Object> allShipsHitInSalvoes( Set<Salvo> salvoes, Set<Ship> ships, Map<String,Integer> shipsSize){
       List<Object> allSalvosInAllShips = salvoes.stream()
               .sorted( (salvo1,salvo2) -> salvo1.getTurn() - salvo2.getTurn())
               .map( salvo -> shipsHitInSalvo(salvo, ships, shipsSize)).filter( location -> !location.isEmpty())
               .collect(toList());
       return allSalvosInAllShips;
    }


    private Map<String,Object> shipsHitInSalvo(Salvo salvo, Set<Ship> ships, Map<String,Integer> shipsSize) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        Integer turn = salvo.getTurn();
        List<String> hitsInOneShip = new ArrayList<>();
        List<Object> SalvoOnAllShips = new ArrayList<>();
            SalvoOnAllShips = ships.stream()
                    .map(ship -> locationsHitInShip(salvo, ship, shipsSize)).filter( location -> !location.isEmpty())
                    .collect(toList());
        dto.put("turn", turn);
        if ( !SalvoOnAllShips.isEmpty()){
            dto.put("hit", SalvoOnAllShips);
            } else {
                dto.put("hit", "null");
            }
        return dto;
    }
//
    ///// get hits and sunks
    private Map<String, Object> locationsHitInShip(Salvo salvo, Ship ship, Map<String,Integer> shipsSize) {
        Map<String, Object> hitInShipdto = new LinkedHashMap<String, Object>();
        List<String> hits = new ArrayList<String>();

        Integer turn = salvo.getTurn();
        String shipType = ship.getShipType();
        List<String> locsalvo = salvo.getSalvoLocations();
        List<String> locship = ship.getLocations();
       hits = locsalvo.stream()
                .filter(s -> locship.contains(s)).collect(toList());
       if ( hits.size() != 0) {
           hitInShipdto.put("hit", hits);
           hitInShipdto.put("type", shipType);
           shipsSize.put(shipType, shipsSize.get(shipType) - hits.size());
           if( shipsSize.get(shipType) == 0){
               shipsSize.put("total",shipsSize.get("total") -1);
           }
           hitInShipdto.put("locations_left", shipsSize.get(shipType));

           hitInShipdto.put("shipsLeft", shipsSize.get("total"));

    //        return scores.stream().filter(p -> p.getGame().equals(game)).findFirst().orElse(null);
    //       } else{
    //           hitInShipdto.put("hits", "no hit");
       }
        return hitInShipdto;
    }


//    private List<String> listofhits

    /// primera version hacer listas y comaprar.
    private List<String> myshiplocation (GamePlayer gameplayer){
        List<List<String>> myshiplocationlist = new ArrayList<>();
        List<String> myshipslocation = new ArrayList<>();
        Set<Ship> myships = gameplayer.getShips();
        myshiplocationlist = myships.stream()
                .map( m -> m.getLocations())
                .collect(toList());
        myshiplocationlist.forEach(locationList -> locationList.forEach(location -> myshipslocation.add(location)));
        System.out.println(myshipslocation);
        return myshipslocation;
    }

    private List<String> mysalvoslocation (GamePlayer gameplayer){
        List<List<String>> mysalvolocationlist = new ArrayList<>();
        List<String> mysalvoslocation = new ArrayList<>();
        Set<Salvo> mysalvoes = gameplayer.getSalvoes();
        mysalvolocationlist = mysalvoes.stream()
                .map( m -> m.getSalvoLocations())
                .collect(toList());
        mysalvolocationlist.forEach(locationList -> locationList.forEach(location -> mysalvoslocation.add(location)));
        System.out.println(mysalvoslocation);
        return mysalvoslocation;
    }




    private Map<String, Object> makeplayerScoreDTO(Player player) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", player.getId());
        dto.put("email", player.getUserName());



        return dto;
    }


    private Map<String, Object> playerforLeader(GamePlayer gamePlayer){
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        if(gamePlayer.getScore() !=null){

            dto.put("score", gamePlayer.getScore().getScore());
        }
        else{
            dto.put("score", null);
        }
        return dto;
    }



    private Map<String, Object> makeLeaderBoardDTO(Player player){
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        Set<GamePlayer> gameplayers = player.getGamePlayers();

        dto.put("id", player.getId());
        dto.put("email", player.getUserName());
        dto.put("scores", gameplayers.stream().map(x -> playerforLeader(x)).collect(toList()));
        return dto;

    }

////make salvo dto///
//

    @RequestMapping(path = "/players", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> createUser(@RequestParam String username, @RequestParam String password){
         if (username.isEmpty() || password.isEmpty()) {
        return new ResponseEntity<>(makeMap("error", "Empty field"), HttpStatus.FORBIDDEN);
    }
    Player user = repositoryPlayer.findByUserName(username);
  if (user != null) {
        return new ResponseEntity<>(makeMap("error", "Name in use"), HttpStatus.FORBIDDEN);
    }
    Player newUser = repositoryPlayer.save(new Player(username, password));
  return new ResponseEntity<>(makeMap("Username", newUser.getUserName()),  HttpStatus.CREATED);
}

    private Map<String, Object> makeMap(String key, Object value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }

    @RequestMapping(path = "/games", method = RequestMethod.GET)
    public Map<String,Object> getGamesId(Authentication authentication) {
        Map<String, Object> gameNewdto = new LinkedHashMap<String, Object>();

        gameNewdto.put("games", repositorygame.findAll().stream().map(game -> makeGameDTO(game)).collect(toList()));
        gameNewdto.put("leaderboard", repositoryPlayer.findAll().stream().map(x -> makeLeaderBoardDTO(x)).collect(toList()));
        if(authentication != null) {
            gameNewdto.put("player", currentDTO(authentication));
        } else {
            gameNewdto.put("player","null");
        }

        return gameNewdto;
    }


    @RequestMapping(path = "/games", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> createUser(Authentication authentication){

        if (authentication == null) {
            return new ResponseEntity<>(makeMap("error", "You need to be logged in to create a game"), HttpStatus.UNAUTHORIZED);
        }else{
            Game newGame = repositorygame.save(new Game());
            GamePlayer newGamePlayer = repositorygameplayer.save(new GamePlayer(newGame,authUser(authentication)));
            return new ResponseEntity<>(makeMap("GamePlayer", newGamePlayer.getId()),  HttpStatus.CREATED);
        }

    }

    @RequestMapping(path = "/games/players/{nn}/ships", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> ships(@PathVariable Long nn, Authentication authentication, @RequestBody Set<Ship> ships) {
        GamePlayer gameplayernn = repositorygameplayer.findOne(nn);
//
        if ( authentication == null){
            return new ResponseEntity<>(makeMap("error", "You need to be logged in"), HttpStatus.UNAUTHORIZED);
        } else if( gameplayernn == null){
            return new ResponseEntity<>(makeMap("error", "No such gameplayer"), HttpStatus.UNAUTHORIZED);
        } else if ( gameplayernn.getPlayer() != authUser(authentication)){
            return new ResponseEntity<>(makeMap("error", "Not your game"), HttpStatus.UNAUTHORIZED);
        } else if ( gameplayernn.getShips().size() != 0){
            return new ResponseEntity<>(makeMap("error","Ships have been already placed"), HttpStatus.FORBIDDEN);
        } else {
           for(Ship ship: ships){
//               Ship newship = new Ship()
               ship.setGamePlayer(gameplayernn);
               ships.add(ship);
               repositoryship.save(ship);
           }
            return new ResponseEntity<>(makeMap("SUCCESS", "Ships created "),(HttpStatus.CREATED));
        }
    }

    public Map<String, Object> currentDTO(Authentication authentication){
        Map<String,Object> dto = new LinkedHashMap<>();
            dto.put("id",  authUser(authentication).getId());
            dto.put("name", authUser(authentication).getUserName());
        return dto;
    }


    @RequestMapping(path = "/games/players/{nn}/scores", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> scores(@PathVariable Long nn, Authentication authentication) {
        GamePlayer gameplayernn = repositorygameplayer.findOne(nn);
        if ( authentication == null){
            return new ResponseEntity<>(makeMap("error", "You need to be logged in"), HttpStatus.UNAUTHORIZED);
        } else if( gameplayernn == null){
            return new ResponseEntity<>(makeMap("error", "No such gameplayer"), HttpStatus.UNAUTHORIZED);
        } else if ( gameplayernn.getPlayer() != authUser(authentication)){
            return new ResponseEntity<>(makeMap("error", "Not your game"), HttpStatus.UNAUTHORIZED);
        }
        if (getGameState(gameplayernn) != GameState.GAMEOVER_LOSE || getGameState(gameplayernn) != GameState.GAMEOVER_WIN ){
            return new ResponseEntity<>(makeMap("error", "Game not finished"), HttpStatus.UNAUTHORIZED);
        }
        else {
           getGameState(gameplayernn);
            }
            return new ResponseEntity<>(makeMap("SUCCESS", "Scores created"),(HttpStatus.CREATED));
        }





    @RequestMapping(path = "/games/players/{nn}/salvos", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> getSalvos(@PathVariable Long nn,
                                                         Authentication authentication,
                                                         @RequestBody List<String> salvoes) {
        GamePlayer gameplayernn = repositorygameplayer.findOne(nn);
        if ( authentication == null){
            return new ResponseEntity<>(makeMap("error", "You need to be logged in"), HttpStatus.UNAUTHORIZED);
        } if( gameplayernn == null){
            return new ResponseEntity<>(makeMap("error", "No such gameplayer"), HttpStatus.UNAUTHORIZED);
        }
        if ( gameplayernn.getPlayer() != authUser(authentication)) {
            return new ResponseEntity<>(makeMap("error", "Not your game"), HttpStatus.UNAUTHORIZED);
        } else {
            if ( getGameState(gameplayernn) != GameState.PLACESALVOS){
                return new ResponseEntity<>(makeMap("error", "not allowed to place salvos yet"), HttpStatus.FORBIDDEN);
            }
            Salvo newsalvo = new Salvo();
            newsalvo.setSalvoLocations(salvoes);
            newsalvo.setGamePlayer(gameplayernn);
            newsalvo.setTurn(gameplayernn.getSalvoes().size()+1);

            /// necesito filtrar los turnos por player id ///
            if ( newsalvo.getTurn() == gameplayernn.getSalvoes().size()+1 || newsalvo.getTurn() == null ) {
                salvoRepository.save(newsalvo);
                return new ResponseEntity<>(makeMap("SUCCESS", "Salvo shot"),(HttpStatus.CREATED));
            }else{
                return new ResponseEntity<>(makeMap("error", "You already shot this turn"), HttpStatus.FORBIDDEN);
            }
        }
        }


    private Map<String, Object> makeGameDTO2(Game game, GamePlayer gm) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        Set<GamePlayer> gamePlayers = game.getGamePlayers();
        Set<Ship> ships = gm.getShips();


        dto.put("id", game.getId());
        dto.put("created", game.getCreationDate());

        dto.put("gamePlayers", gamePlayers.stream()
                .map(gamePlayer -> makegamePlayerDTO(gamePlayer))
                .collect(toList()));

        dto.put("ships", ships.stream()
                .map(ship -> makeShipDTO(ship))
                .collect(toList()));

        dto.put("salvoes", gamePlayers.stream()
                .map(gp -> makeSalvosDTO(gp))
                .collect(toList()));
        return dto;
    }

    @RequestMapping(path ="game/{nn}/players", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> gameidplayers(@PathVariable Long nn, Authentication authentication) {
        Game gamenn = repositorygame.findOne(nn);
        if ( authentication == null){
            return new ResponseEntity<>(makeMap("error", "You need to be logged in"), HttpStatus.UNAUTHORIZED);
        } if( gamenn == null){
            return new ResponseEntity<>(makeMap("error", "No such game"), HttpStatus.FORBIDDEN);
        } if ( gamenn.getPlayers().size() > 1){
            return new ResponseEntity<>(makeMap("error", "Game is full"), HttpStatus.FORBIDDEN);
        } if ( gamenn.getPlayers().contains(authUser(authentication))){
            return new ResponseEntity<>(makeMap("error", "You are already in this game"), HttpStatus.FORBIDDEN);
        }else {
            GamePlayer newGamePlayer = repositorygameplayer.save(new GamePlayer(gamenn ,authUser(authentication)));
            return new ResponseEntity<>(makeMap("GamePlayer", newGamePlayer.getId()),  HttpStatus.CREATED);
        }
    }



    @RequestMapping("/game_view/{nn}")
    public ResponseEntity<Map<String, Object>> viewGamePlayer(@PathVariable Long nn, Authentication authentication) {
        GamePlayer gamePlayernn = repositorygameplayer.findOne(nn);
        Game game = gamePlayernn.getGame();
        GamePlayer opononet = getOponent(gamePlayernn);
        if ( gamePlayernn.getPlayer().getId() != authUser(authentication).getId() ){
            return new ResponseEntity<>(makeMap("error", "NOT YOUR GAMEPLAYER"), HttpStatus.UNAUTHORIZED);

        } else {
            if( opononet !=null){
            Map<String, Object> dto = new LinkedHashMap<>();
            dto.put("id", nn);
            dto.put("game", makeGameDTO2(game, gamePlayernn));
            dto.put("player", currentDTO(authentication));
            dto.put("hits", makehitsDTO (gamePlayernn));
            dto.put("ships_left_me",  getShipsLeft (getOponent(gamePlayernn)));
            dto.put("ships_left_oponent", getShipsLeft(gamePlayernn));

            dto.put("Status", getGameState (gamePlayernn));

            return new ResponseEntity<>(dto, HttpStatus.OK);
        } else {
                Map<String, Object> dto = new LinkedHashMap<>();
                dto.put("id", nn);
                dto.put("game", makeGameDTO2(game, gamePlayernn));
                dto.put("Status", GameState.WAIT_FOR_OPPONENT);
                return new ResponseEntity<>(dto, HttpStatus.OK);
            }
        }
    }

    private GameState getGameState (GamePlayer gamePlayer ){
        GamePlayer gamePlayerOpp =  getOponent(gamePlayer);
        GamePlayer gp1;
        GamePlayer gp2;

        if ( gamePlayer.getId() < gamePlayerOpp.getId()){
            gp1 = gamePlayer;
            gp2 = gamePlayerOpp;
        } else{
            gp1 = gamePlayerOpp;
            gp2 = gamePlayer;
        }
//        if (( gp2 == gamePlayer && getShipsLeft(gamePlayer) == 0) || ( gp2 == gamePlayerOpp && getShipsLeft(gamePlayerOpp) == 0) ){
//            return GameState.GAMEOVER;
//        }
        if (( gp2 == gamePlayer && getShipsLeft(gamePlayer) == 0) || ( gp1 == gamePlayer && getShipsLeft(gamePlayer) == 0)){

            Score newscore = new Score(1.0,gamePlayer.getPlayer(),gamePlayer.getGame());
            repositoryscore.save(newscore);
            return GameState.GAMEOVER_WIN;
        }
        if (( gp2 == gamePlayer && getShipsLeft(gamePlayerOpp) == 0) || ( gp1 == gamePlayer && getShipsLeft(gamePlayerOpp) == 0)){

            Score newscore2 = new Score(0.0,gamePlayer.getPlayer(),gamePlayer.getGame());
            repositoryscore.save(newscore2);
            return GameState.GAMEOVER_LOSE;
        }

        if (gamePlayer.getShips().size() == 0){
            return GameState.PLACESHIPS;
        }
        if ( gamePlayerOpp.getShips().size() == 0) {
            return GameState.WAITING_FOR_OPPONENT_TO_PLACE_SHIPS;
        }
        if ( gp1.getSalvoes().size() == 0 && gp1 == gamePlayer){
            return GameState.PLACESALVOS;
        } else if ( gp1.getSalvoes().size() == 0 && gp1 == gamePlayerOpp ){
            return GameState.WAIT_FOR_OPPONENT_TO_PLACE_SALVOS;
        }
        if ( gp1.getSalvoes().size() > gp2.getSalvoes().size()){
            if (gp1 == gamePlayer) {
                return GameState.WAIT_FOR_OPPONENT_TO_PLACE_SALVOS;
            }else{
                return GameState.PLACESALVOS;
            }
        }
        if (gp1.getSalvoes().size() != 0 && gp2.getSalvoes().size() != 0 && gp1.getSalvoes().size() == gp2.getSalvoes().size() ) {
            if (gp1 == gamePlayer) {
               return GameState.PLACESALVOS;
           }else{
               return GameState.WAIT_FOR_OPPONENT_TO_PLACE_SALVOS;
           }
        }


        return null;

    }


    private Player authUser(Authentication authentication) {
        return repositoryPlayer.findByUserName(authentication.getName());
    }
    private boolean isGuest(Authentication authentication) {
        return authentication == null || authentication instanceof AnonymousAuthenticationToken;
    }
}