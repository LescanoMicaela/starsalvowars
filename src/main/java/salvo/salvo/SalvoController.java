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
           hitInShipdto.put("locations_left", shipsSize.get(shipType));
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


    @RequestMapping(path = "/games/players/{nn}/salvos", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> getSalvos(@PathVariable Long nn,
                                                         Authentication authentication,
                                                         @RequestBody List<String> salvoes) {
        GamePlayer gameplayernn = repositorygameplayer.findOne(nn);
        if ( authentication == null){
            return new ResponseEntity<>(makeMap("error", "You need to be logged in"), HttpStatus.UNAUTHORIZED);
        } if( gameplayernn == null){
            return new ResponseEntity<>(makeMap("error", "No such gameplayer"), HttpStatus.UNAUTHORIZED);
        } if ( gameplayernn.getPlayer() != authUser(authentication)) {
            return new ResponseEntity<>(makeMap("error", "Not your game"), HttpStatus.UNAUTHORIZED);
        } else {
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
        Map<String, Integer> shipsLength = new LinkedHashMap<>();
        shipsLength.put("destroyer", 3);
        shipsLength.put("submarine", 3);
        shipsLength.put("patrol", 2);
        shipsLength.put("battleship", 4);
        shipsLength.put("carrier", 5);
//        private Map<String, Object> makeMap(String key, Object value) {
//            Map<String, Object> map = new HashMap<>();
//            map.put(key, value);
//            return map;
//        }
        if ( gamePlayernn.getPlayer().getId() != authUser(authentication).getId() ){
            return new ResponseEntity<>(makeMap("error", "NOT YOUR GAMEPLAYER"), HttpStatus.UNAUTHORIZED);

        } else {
            if( opononet !=null){
                Set<Ship> opononetShips = opononet.getShips();
                Set<Salvo> player1Salvo = gamePlayernn.getSalvoes();
                Set<Ship> player1Ships = gamePlayernn.getShips();
                Set<Salvo> oponentSalvo = opononet.getSalvoes();
            Map<String, Object> dto = new LinkedHashMap<>();
            dto.put("id", nn);
            dto.put("game", makeGameDTO2(game, gamePlayernn));
            dto.put("player", currentDTO(authentication));
            dto.put("hits_on_oponent", allShipsHitInSalvoes(player1Salvo,opononetShips,shipsLength));
            dto.put("hits_on_me", allShipsHitInSalvoes(oponentSalvo,player1Ships, shipsLength));
            return new ResponseEntity<>(dto, HttpStatus.OK);
        } else {
                Map<String, Object> dto = new LinkedHashMap<>();
                dto.put("id", nn);
                dto.put("game", makeGameDTO2(game, gamePlayernn));
                dto.put("player", currentDTO(authentication));
                return new ResponseEntity<>(dto, HttpStatus.OK);
            }
        }
    }



    private Player authUser(Authentication authentication) {
        return repositoryPlayer.findByUserName(authentication.getName());
    }
    private boolean isGuest(Authentication authentication) {
        return authentication == null || authentication instanceof AnonymousAuthenticationToken;
    }
}