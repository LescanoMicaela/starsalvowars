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
        return dto;
    }

    private Map<String, Object> makeplayerDTO(Player player) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", player.getId());
        dto.put("email", player.getUserNameName());
        return dto;
    }

    @RequestMapping("/games")
    public List<Map> getGamesId() {

        return repositorygame.findAll()
                .stream()
                .map(game -> makeGameDTO(game))
                .collect(toList());
    }




    private Map<String, Object> makeGameDTO2(Game game) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        Set<GamePlayer> gamePlayers = game.getGamePlayers();
        dto.put("id", game.getId());
        dto.put("created", game.getCreationDate());

        dto.put("gamePlayers", gamePlayers.stream()
                .map(gamePlayer -> makegamePlayerDTO(gamePlayer))
                .collect(toList()));
        return dto;
    }

    @RequestMapping("/game_view/{nn}")
    public Map<String, Object> viewGamePlayer(@PathVariable Long nn) {
        Map <String, Object> dto = new LinkedHashMap<String, Object>();
       GamePlayer gamePlayernn = repositorygameplayer.findOne(nn);
       Game game = gamePlayernn.getGame();
        dto.put("id", nn);
        dto.put("game", makeGameDTO2(game));

        return dto;




    }



}