package salvo.salvo;


import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
public class Salvo {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private Integer turn;

    @ElementCollection
    @Column(name="SalvoLocations")
    private List<String> SalvoLocations = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name ="gamePlayer_id")
    private GamePlayer gamePlayer;

    public Salvo(){

    }

    public Salvo ( Integer turn, GamePlayer gamePlayer, List<String> salvolocations)
    {
        this.turn= turn;
        this.gamePlayer = gamePlayer;
        this.SalvoLocations = salvolocations;
    }

    public long getId() {
        return id;
    }



    public Integer getTurn() {
        return turn;
    }

    public void setTurn(Integer turn) {
        this.turn = turn;
    }

    public List<String> getSalvoLocations() {
        return SalvoLocations;
    }

    public void setSalvoLocations(List<String> salvoLocations) {
        SalvoLocations = salvoLocations;
    }

    public GamePlayer getGamePlayer() {
        return gamePlayer;
    }

    public void setGamePlayer(GamePlayer gamePlayer) {
        this.gamePlayer = gamePlayer;
    }
}
