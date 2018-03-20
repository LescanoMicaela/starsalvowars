package salvo.salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;

import static java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME;

@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class, args);
	}


	@Bean
	public CommandLineRunner initData(PlayerRepository repositoryplayer, GameRepository repositorygame, GamePlayerRepository repositorygamePlayer) {
		return (String... args) -> {

		    Player bauer = new Player( "j.bauer@ctu.gov");
		    repositoryplayer.save(bauer);
		    Player obrian = new Player("c.obrian@ctu.gov");
			repositoryplayer.save(obrian);
			Player kim = new Player("kim_bauer@gmail.com");
			repositoryplayer.save(kim);
			Player almeida = new Player("t.almeida@ctu.gov");
			repositoryplayer.save(almeida);
            Player palmer = new Player("d.palmer@whitehouse.gov");
            repositoryplayer.save(palmer);
            Game game1 = new Game();
            Game game2 = new Game();
            Game game3 = new Game();
            Game game4 = new Game();
            Game game5 = new Game();
            Game game6 = new Game();
            Game game7 = new Game();
            Game game8 = new Game();
            Date gametime = game1.getCreationDate();
            Date gametime2 = Date.from(gametime.toInstant().plusSeconds(3600));
            Date gametime3 = Date.from(gametime.toInstant().plusSeconds(7200));
            Date gametime4 = Date.from(gametime.toInstant().plusSeconds(10800));
            Date gametime5 = Date.from(gametime.toInstant().plusSeconds(14400));
            Date gametime6 = Date.from(gametime.toInstant().plusSeconds(18000));
            game2.setCreationDate(gametime2);
            game3.setCreationDate(gametime3);
            game4.setCreationDate(gametime4);
            game5.setCreationDate(gametime5);
            game6.setCreationDate(gametime6);
            repositorygame.save(game1);
            repositorygame.save(game2);
            repositorygame.save(game3);
            repositorygame.save(game4);
            repositorygame.save(game5);
            repositorygame.save(game6);
            repositorygame.save(game7);
            repositorygame.save(game8);
            GamePlayer GP1_1 = new GamePlayer(game1,bauer);
            GamePlayer GP1_2 = new GamePlayer(game1,obrian);
            GamePlayer GP2_1 = new GamePlayer(game2,bauer);
            GamePlayer GP2_2 = new GamePlayer(game2,obrian);
            GamePlayer GP3_1 = new GamePlayer(game3,obrian);
            GamePlayer GP3_2 = new GamePlayer(game3,almeida);
            GamePlayer GP4_1 = new GamePlayer(game4,obrian);
            GamePlayer GP4_2 = new GamePlayer(game4,bauer);
            GamePlayer GP5_1 = new GamePlayer(game5,almeida);
            GamePlayer GP5_2 = new GamePlayer(game5,bauer);
            GamePlayer GP6_1 = new GamePlayer(game6, kim);
            GamePlayer GP7_1 = new GamePlayer(game7, almeida);
            GamePlayer GP8_1 = new GamePlayer(game8, kim);
            GamePlayer GP8_2 = new GamePlayer(game8, almeida);
            repositorygamePlayer.save(GP1_1);
            repositorygamePlayer.save(GP1_2);
            repositorygamePlayer.save(GP2_1);
            repositorygamePlayer.save(GP2_2);
            repositorygamePlayer.save(GP3_1);
            repositorygamePlayer.save(GP3_2);
            repositorygamePlayer.save(GP4_1);
            repositorygamePlayer.save(GP4_2);
            repositorygamePlayer.save(GP5_1);
            repositorygamePlayer.save(GP5_2);
            repositorygamePlayer.save(GP6_1);
            repositorygamePlayer.save(GP7_1);
            repositorygamePlayer.save(GP8_1);
            repositorygamePlayer.save(GP8_2);





		};

	}
}


//Games:
//        2/17/2018, 3:20:15 PM: j.bauer@ctu.gov, c.obrian@ctu.gov
//2/17/2018, 4:20:15 PM: j.bauer@ctu.gov, c.obrian@ctu.gov
//2/17/2018, 5:20:15 PM: c.obrian@ctu.gov, t.almeida@ctu.gov
//2/17/2018, 6:20:15 PM: j.bauer@ctu.gov, c.obrian@ctu.gov
//2/17/2018: 7:20:15 PM: t.almeida@ctu.gov, j.bauer@ctu.gov
//2/17/2018: 8:20:15 PM: d.palmer@whitehouse.gov

