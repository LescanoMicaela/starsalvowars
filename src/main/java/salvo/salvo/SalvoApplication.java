package salvo.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.lang.reflect.Array;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME;

@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class, args);
	}


	@Bean
	public CommandLineRunner initData(PlayerRepository repositoryplayer, GameRepository repositorygame, GamePlayerRepository repositorygamePlayer, ShipRepository repositoryShip, SalvoRepository repositorySalvo, ScoreRepository repositoryscore) {
		return (String... args) -> {

		    Player bauer = new Player( "j.bauer@ctu.gov", "24");
		    repositoryplayer.save(bauer);
		    Player obrian = new Player("c.obrian@ctu.gov", "42");
			repositoryplayer.save(obrian);
			Player kim = new Player("kim_bauer@gmail.com", "kb");
			repositoryplayer.save(kim);
			Player almeida = new Player("t.almeida@ctu.gov", "mole");
			repositoryplayer.save(almeida);

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

            List<String> location1_1_1 = Arrays.asList("H2", "H3", "H4");
            List<String> location1_1_2 = Arrays.asList("E1", "F1", "G1");
            List<String> location1_1_3 = Arrays.asList("B4", "B5");
            List<String> location1_2_1 = Arrays.asList("B5", "C5", "D5");
            List<String> location1_2_2 = Arrays.asList("F1", "F2");

            Ship ship1 = new Ship("Destroyer",location1_1_1,GP1_1 );
            Ship ship2 = new Ship("Submarine",location1_1_2 , GP1_1);
            Ship ship3 = new Ship("Patrol Boat",location1_1_3, GP1_1 );

            Ship ship4 = new Ship("Destroyer",location1_2_1, GP1_2 );
            Ship ship5 = new Ship("Patrol Boat",location1_2_2, GP1_2 );

            repositoryShip.save(ship1);
            repositoryShip.save(ship2);
            repositoryShip.save(ship3);
            repositoryShip.save(ship4);
            repositoryShip.save(ship5);

            List<String> location2_1_1 = Arrays.asList("B5", "C5", "D5");
            List<String> location2_1_2 = Arrays.asList("C6", "C7");
            List<String> location2_2_1 = Arrays.asList("A2", "A3", "A4");
            List<String> location2_2_2 = Arrays.asList("G6", "H6");

            Ship ship6 = new Ship("Destroyer",location2_1_1, GP2_1);
            Ship ship7 = new Ship("Patrol Boat",location2_1_2, GP2_1);

            Ship ship8 = new Ship("Submarine",location2_2_1, GP2_2);
            Ship ship9 = new Ship("Patrol Boat",location2_2_2, GP2_2);

            repositoryShip.save(ship6);
            repositoryShip.save(ship7);
            repositoryShip.save(ship8);
            repositoryShip.save(ship9);

            List<String> location3_1_1 = Arrays.asList("B5", "C5", "D5");
            List<String> location3_1_2 = Arrays.asList("C6", "C7");
            List<String> location3_2_1 = Arrays.asList("A2", "A3", "A4");
            List<String> location3_2_2 = Arrays.asList("G6", "H6");

            Ship ship10 = new Ship("Destroyer",location3_1_1, GP3_1);
            Ship ship11 = new Ship("Patrol Boat",location3_1_2, GP3_1);

            Ship ship12 = new Ship("Submarine",location3_2_1, GP3_2);
            Ship ship13 = new Ship("Patrol Boat",location3_2_2, GP3_2);

            repositoryShip.save(ship10);
            repositoryShip.save(ship11);
            repositoryShip.save(ship12);
            repositoryShip.save(ship13);

            List<String> location4_1_1 = Arrays.asList("B5", "C5", "D5");
            List<String> location4_1_2 = Arrays.asList("C6", "C7");
            List<String> location4_2_1 = Arrays.asList("A2", "A3", "A4");
            List<String> location4_2_2 = Arrays.asList("G6", "H6");

            Ship ship14 = new Ship("Destroyer",location4_1_1, GP4_1);
            Ship ship15 = new Ship("Patrol Boat",location4_1_2, GP4_1);

            Ship ship16 = new Ship("Submarine",location4_2_1, GP4_2);
            Ship ship17 = new Ship("Patrol Boat",location4_2_2, GP4_2);

            repositoryShip.save(ship14);
            repositoryShip.save(ship15);
            repositoryShip.save(ship16);
            repositoryShip.save(ship17);

            List<String> location5_1_1 = Arrays.asList("B5", "C5", "D5");
            List<String> location5_1_2 = Arrays.asList("C6", "C7");
            List<String> location5_2_1 = Arrays.asList("A2", "A3", "A4");
            List<String> location5_2_2 = Arrays.asList("G6", "H6");

            Ship ship18 = new Ship("Destroyer",location5_1_1, GP5_1);
            Ship ship19 = new Ship("Patrol Boat",location5_1_2, GP5_1);

            Ship ship20 = new Ship("Submarine",location5_2_1, GP5_2);
            Ship ship21 = new Ship("Patrol Boat",location5_2_2, GP5_2);

            repositoryShip.save(ship18);
            repositoryShip.save(ship19);
            repositoryShip.save(ship20);
            repositoryShip.save(ship21);

            Ship ship22 = new Ship("Destroyer",location5_1_1, GP6_1);
            Ship ship23 = new Ship("Patrol Boat",location5_1_2, GP6_1);


            Ship ship24 = new Ship("Destroyer",location5_1_1, GP8_1);
            Ship ship25 = new Ship("Patrol Boat",location5_1_2, GP8_1);

            Ship ship26 = new Ship("Submarine",location5_2_1, GP8_2);
            Ship ship27 = new Ship("Patrol Boat",location5_2_2, GP8_2);

            repositoryShip.save(ship22);
            repositoryShip.save(ship23);
            repositoryShip.save(ship24);
            repositoryShip.save(ship25);
            repositoryShip.save(ship26);
            repositoryShip.save(ship27);

            List<String> salvoLoc1_1_1 = Arrays.asList("B5", "C5", "F1");
            List<String> salvoLoc1_1_2 = Arrays.asList("B4", "B5", "B6");
            List<String> salvoLoc1_2_1 = Arrays.asList("F2", "D5");
            List<String> salvoLoc1_2_2 = Arrays.asList("E1", "H3", "A2");

            Salvo salvo1_1_1 = new Salvo(1, GP1_1, salvoLoc1_1_1);
            Salvo salvo1_1_2 = new Salvo(1, GP1_2, salvoLoc1_1_2);
            Salvo salvo1_2_1 = new Salvo(2, GP1_1, salvoLoc1_2_1);
            Salvo salvo1_2_2 = new Salvo(2, GP1_2, salvoLoc1_2_2);


            List<String> salvoLoc2_1_1 = Arrays.asList("A2", "A4", "G6");
            List<String> salvoLoc2_1_2 = Arrays.asList("B5", "D5", "C7");
            List<String> salvoLoc2_2_1 = Arrays.asList("A3", "H6");
            List<String> salvoLoc2_2_2 = Arrays.asList("C5","C6");


            Salvo salvo2_1_1 = new Salvo(1, GP2_1, salvoLoc2_1_1);
            Salvo salvo2_1_2 = new Salvo(1, GP2_2, salvoLoc2_1_2);
            Salvo salvo2_2_1 = new Salvo(2, GP2_2, salvoLoc2_2_1);
            Salvo salvo2_2_2 = new Salvo(2, GP2_2, salvoLoc2_2_2);


            List<String> salvoLoc3_1_1 = Arrays.asList("G6", "H6", "A4");
            List<String> salvoLoc3_1_2 = Arrays.asList("H1", "H2", "H3");
            List<String> salvoLoc3_2_1 = Arrays.asList("A2", "A3", "D8");
            List<String> salvoLoc3_2_2 = Arrays.asList("E1", "F2", "G3");

            Salvo salvo3_1_1 = new Salvo(1, GP3_1, salvoLoc3_1_1);
            Salvo salvo3_1_2 = new Salvo(1, GP3_2, salvoLoc3_1_2);
            Salvo salvo3_2_1 = new Salvo(2, GP3_1, salvoLoc3_2_1);
            Salvo salvo3_2_2 = new Salvo(2, GP3_2, salvoLoc3_2_2);

            List<String> salvoLoc4_1_1 = Arrays.asList("A3", "A4", "F7");
            List<String> salvoLoc4_1_2 = Arrays.asList("B5", "C6", "H1");
            List<String> salvoLoc4_2_1 = Arrays.asList("A2", "G6", "H6");
            List<String> salvoLoc4_2_2 = Arrays.asList("C5", "C7", "D5");

            Salvo salvo4_1_1 = new Salvo(1, GP4_1, salvoLoc3_1_1);
            Salvo salvo4_1_2 = new Salvo(1, GP4_2, salvoLoc3_1_2);
            Salvo salvo4_2_1 = new Salvo(2, GP4_1, salvoLoc3_2_1);
            Salvo salvo4_2_2 = new Salvo(2, GP4_2, salvoLoc3_2_2);

            List<String> salvoLoc5_1_1 = Arrays.asList("A1", "A2", "A3");
            List<String> salvoLoc5_1_2 = Arrays.asList("B5", "B6", "C7");
            List<String> salvoLoc5_2_1 = Arrays.asList("G6", "G7", "G8");
            List<String> salvoLoc5_2_2 = Arrays.asList("C6", "D6", "E6");
            List<String> salvoLoc5_3_2 = Arrays.asList("H1", "H8");


            Salvo salvo5_1_1 = new Salvo(1, GP5_1, salvoLoc3_1_1);
            Salvo salvo5_1_2 = new Salvo(1, GP5_2, salvoLoc3_1_2);
            Salvo salvo5_2_1 = new Salvo(2, GP5_1, salvoLoc3_2_1);
            Salvo salvo5_2_2 = new Salvo(2, GP5_2, salvoLoc3_2_2);
            Salvo salvo5_3_2 = new Salvo(3, GP5_2, salvoLoc3_2_1);


            repositorySalvo.save(salvo1_1_1);
            repositorySalvo.save(salvo1_1_2);
            repositorySalvo.save(salvo1_2_1);
            repositorySalvo.save(salvo1_2_2);

            repositorySalvo.save(salvo2_1_1);
            repositorySalvo.save(salvo2_1_2);
            repositorySalvo.save(salvo2_2_1);
            repositorySalvo.save(salvo2_2_2);

            repositorySalvo.save(salvo3_1_1);
            repositorySalvo.save(salvo3_1_2);
            repositorySalvo.save(salvo3_2_1);
            repositorySalvo.save(salvo3_2_2);

            repositorySalvo.save(salvo4_1_1);
            repositorySalvo.save(salvo4_1_2);
            repositorySalvo.save(salvo4_2_1);
            repositorySalvo.save(salvo4_2_2);

            repositorySalvo.save(salvo5_1_1);
            repositorySalvo.save(salvo5_1_2);
            repositorySalvo.save(salvo5_2_1);
            repositorySalvo.save(salvo5_2_2);
            repositorySalvo.save(salvo5_3_2);

            Score score1_1 = new Score(1.0 ,bauer,game1);
            Score score1_2 = new Score(0.0 ,obrian,game1);
            Score score2_1 = new Score(0.5 ,bauer,game2);
            Score score2_2 = new Score(0.5 ,obrian,game2);
            Score score3_1 = new Score(1.0 ,obrian,game3);
            Score score3_2 = new Score(0.0 ,almeida,game3);
            Score score4_1 = new Score(0.5 ,obrian,game4);
            Score score4_2 = new Score(0.5 ,bauer,game4);

            repositoryscore.save(score1_1);
            repositoryscore.save(score1_2);
            repositoryscore.save(score2_1);
            repositoryscore.save(score2_2);
            repositoryscore.save(score3_1);
            repositoryscore.save(score3_2);
            repositoryscore.save(score4_1);
            repositoryscore.save(score4_2);



//            System.out.println(1);
//            System.out.println(GP1_1.getScore());









		};

	}
}


@Configuration
class WebSecurityConfiguration extends GlobalAuthenticationConfigurerAdapter {

    @Autowired
    PlayerRepository playerRepository;

    @Override
    public void init(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(inputName-> {
            Player player = playerRepository.findByUserName(inputName);
            if (player != null) {
                return new User(player.getUserName(), player.getPassword(),
                        AuthorityUtils.createAuthorityList("USER"));
            } else {
                throw new UsernameNotFoundException("Unknown user: " + inputName);
            }
        });
    }
}

@Configuration
@EnableWebSecurity
class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
//                .antMatchers("/admin/**").hasAuthority("USER")
                .antMatchers("/web/games.html").permitAll()
                .antMatchers("/web/script/games.js").permitAll()
                .antMatchers("/web/styles/style.css").permitAll()
                .antMatchers("/api/games").permitAll()
                .antMatchers("/**").hasAnyAuthority("USER")
                .and()
                .formLogin()
                .usernameParameter("userName")
                .passwordParameter("password")
                .loginPage("/api/login");

        http.logout().logoutUrl("/api/logout");

        // turn off checking for CSRF tokens
        http.csrf().disable();

        // if user is not authenticated, just send an authentication failure response
        http.exceptionHandling().authenticationEntryPoint((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

        // if login is successful, just clear the flags asking for authentication
        http.formLogin().successHandler((req, res, auth) -> clearAuthenticationAttributes(req));

        // if login fails, just send an authentication failure response
        http.formLogin().failureHandler((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

        // if logout is successful, just send a success response
        http.logout().logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler());
    }

    private void clearAuthenticationAttributes(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
        }
    }

}

