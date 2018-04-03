package salvo.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

import static java.util.stream.Collectors.toList;

@RestController
@RequestMapping("/api")

public class SalvoController {

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
//        dto.put("scores", player.getScores(game).getScore());
//        dto.put("score", player.getScore(game).getScore());


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
    @RequestMapping("/games")
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

    public Map<String, Object> currentDTO(Authentication authentication){
        Map<String,Object> dto = new LinkedHashMap<>();
            dto.put("id",  authUser(authentication).getId());
            dto.put("name", authUser(authentication).getUserName());
        return dto;
    }
//    @RequestMapping("/games")
//    public List<Map> getGamesId() {
//
//        return repositorygame.findAll()
//                .stream()
//                .map(game -> makeGameDTO(game))
//                .collect(toList());
//    }
//
//



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




    @RequestMapping("/game_view/{nn}")
    public Map<String, Object> viewGamePlayer(@PathVariable Long nn) {
        Map <String, Object> dto = new LinkedHashMap<String, Object>();
       GamePlayer gamePlayernn = repositorygameplayer.findOne(nn);
       Game game = gamePlayernn.getGame();
        dto.put("id", nn);
        dto.put("game", makeGameDTO2(game, gamePlayernn));


        return dto;




    }


    private Player authUser(Authentication authentication) {
        return repositoryPlayer.findByUserName(authentication.getName());
    }
    private boolean isGuest(Authentication authentication) {
        return authentication == null || authentication instanceof AnonymousAuthenticationToken;
    }
}