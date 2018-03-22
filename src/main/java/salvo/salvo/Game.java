package salvo.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Set;

import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Entity
    public class Game {

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        private long id;
        private Date CreationDate;

        @OneToMany(mappedBy="game", fetch=FetchType.EAGER)
        Set<GamePlayer> gamePlayers;




    public Game( ) {

        this.CreationDate =  new Date();

    }

    public Date getCreationDate() {
        return CreationDate;
    }

    public void setCreationDate(Date creationDate) {
        CreationDate = creationDate;
    }

    public void addGamePlayer(GamePlayer gamePlayer) {
        gamePlayer.setGame(this);
        gamePlayers.add(gamePlayer);
    }



    public Set<GamePlayer> getGamePlayers() {
        return gamePlayers;
    }


    //    @JsonIgnore
    public List<Player> getPlayers() {
        return gamePlayers.stream().map(sub -> sub.getPlayer()).collect(Collectors.toList());
    }

    public List<Long> getIDPlayers() {
        return gamePlayers.stream().map(sub -> sub.getId()).collect(Collectors.toList());
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}