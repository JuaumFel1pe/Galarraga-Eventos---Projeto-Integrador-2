package br.senac.sp.tads.dsw.exemplo6.service;



import java.time.Instant;
import java.time.temporal.ChronoUnit;



import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;

import br.senac.sp.tads.dsw.exemplo6.model.Usuario;

@Service 
public class TokenService {
    @Value("${api.security.token.secret}")
    private String secret;

    public String gerarToken(Usuario usuario) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
            .withIssuer("API e-comerce Turma B")
            .withSubject(usuario.getUsername())
            .withExpiresAt(gerarDataExpiracao())
            .sign(algorithm);
    
        } catch (JWTCreationException e) {
            throw new RuntimeException("Erro ao gerar token JWT");
        }
    
    }

    private Instant gerarDataExpiracao() {
        return Instant.now().plus(2,ChronoUnit.HOURS);
    }

    public String validarToken(String token) {
        try{
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("API e-comerce Turma B")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException e) {
            return "";
        }
    }
}
