package isv.commercetools.reference.application.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
@SuppressWarnings("PMD.LawOfDemeter")
public class ServerSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    @SuppressWarnings("PMD.SignatureDeclareThrowsException")
    public void configureGlobal(final AuthenticationManagerBuilder auth, ExtensionConfiguration extensionConfiguration) throws Exception {
        auth.inMemoryAuthentication()
                .withUser(extensionConfiguration.getSecurity().get("user"))
                .password(passwordEncoder().encode(extensionConfiguration.getSecurity().get("password")))
                .authorities("USER");
    }

    @Override
    protected void configure(final HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .authorizeRequests()
                .antMatchers("/keys").permitAll()
                .antMatchers("/jwt").permitAll()
                .antMatchers("/**").authenticated()
                .and()
                .httpBasic();
        httpSecurity.csrf().disable();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
