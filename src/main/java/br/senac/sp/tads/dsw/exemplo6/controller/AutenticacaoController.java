package br.senac.sp.tads.dsw.exemplo6.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import br.senac.sp.tads.dsw.exemplo6.dto.LoginDTO;
import br.senac.sp.tads.dsw.exemplo6.dto.RegisterDTO;
import br.senac.sp.tads.dsw.exemplo6.dto.TokenDTO;
import br.senac.sp.tads.dsw.exemplo6.service.AutenticacaoService;
import br.senac.sp.tads.dsw.exemplo6.service.TokenService;
import jakarta.validation.Valid;

@RestController 
@RequestMapping ("/auth")
public class AutenticacaoController {
    private final AutenticacaoService service;
    private final AuthenticationManager authenticationManager;
    private final AuthenticationManager tokenService;

    public AutenticacaoController(AutenticacaoService service, AuthenticationManager authenticationManager, TokenService tokenService) {
        this.service = service;
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    @PostMapping ("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void registrar(@RequestBody @Valid RegisterDTO dto) {
        service.registrar(dto);
    }

    @PostMapping("/register")
    @ResponseStatus (HttpStatus.CREATED)
    public void registrar (@RequestBody @Valid LoDTO dto) {
        service.registrar(dto);
    }

    @PostMapping ("/login")
    public TokenDTO login(@RequestBody @Valid LoginDTO dto) {
        var usernamePassword = new UsernamePasswordAuthenticationToken( dto.login(), dto.senha());
        Authentication auth = this.authenticationManager.authenticate(usernamePassword);
    }
}

