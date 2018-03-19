package salvo.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Entity
public class Player {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private long id;
    private String UserName;

    @OneToMany(mappedBy="player", fetch=FetchType.EAGER)
    Set<GamePlayer> gamePlayers;

    public Player() { }

    public Player( String email) {
        this.UserName = email;

    }


    public String getUserNameName() {
        return UserName;
    }

    public void setUserName(String userName) {
        this.UserName = userName;
    }



    public String toString() {
        return  this.UserName;
    }

    public void addGamePlayer(GamePlayer gamePlayer) {
        gamePlayer.setPlayer(this);
        gamePlayers.add(gamePlayer);
    }
    @JsonIgnore
    public List<Game> getGame() {
        return gamePlayers.stream().map(sub -> sub.getGame()).collect(Collectors.toList());
    }
}