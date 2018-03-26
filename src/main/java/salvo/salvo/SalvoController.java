package salvo.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

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
        if(gamePlayer.getScore() !=null){

            dto.put("id", gamePlayer.getId());
            dto.put("player", makeplayerDTO(gamePlayer.getPlayer()));
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
        dto.put("email", player.getUserNameName());
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

//    private Set<Score> makeScoreDTO(Player player){
//      Player p = repositoryPlayer.findOne(player);
//    }

    private List<Object> makeSalvoDTO(GamePlayer gamePlayer) {
        List<Object> salvoList = new ArrayList<>();
        Set<Salvo> salvos = gamePlayer.getSalvoes();
        for (Salvo salvo : salvos) {
           Map<String, Object> salvoMap = new LinkedHashMap<>();
           salvoMap.put("turn", salvo.getTurn());
            salvoMap.put("player_id", salvo.getGamePlayer().getId());
            salvoMap.put("location", salvo.getSalvoLocations());
            salvoList.add( salvoMap);
        }


        return salvoList;
    }
//
//    private Map<String, Object> makeScoreDTO(Score score) {
//        Map<String, Object> dto = new LinkedHashMap<String, Object>();
//        dto.put("score", score.getScore());
//        return dto;
//    }


    @RequestMapping("/games")
    public List<Map> getGamesId() {

        return repositorygame.findAll()
                .stream()
                .map(game -> makeGameDTO(game))
                .collect(toList());
    }




    private Map<String, Object> makeGameDTO2(Game game, GamePlayer gm) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        Set<GamePlayer> gamePlayers = game.getGamePlayers();
        List<Ship> ships = gm.getShips();


        dto.put("id", game.getId());
        dto.put("created", game.getCreationDate());

        dto.put("gamePlayers", gamePlayers.stream()
                .map(gamePlayer -> makegamePlayerDTO(gamePlayer))
                .collect(toList()));

        dto.put("ships", ships.stream()
                .map(ship -> makeShipDTO(ship))
                .collect(toList()));

        dto.put("salvoes", gamePlayers.stream()
                .map(gp -> makeSalvoDTO(gp))
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



}