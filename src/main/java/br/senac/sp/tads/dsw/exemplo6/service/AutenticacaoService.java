package br.senac.sp.tads.dsw.exemplo6.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.senac.sp.tads.dsw.exemplo6.dto.LoginDTO;
import br.senac.sp.tads.dsw.exemplo6.dto.RegisterDTO;
import br.senac.sp.tads.dsw.exemplo6.model.Usuario;
import br.senac.sp.tads.dsw.exemplo6.repository.UsuarioRepository;
import jakarta.validation.Valid;

@Service 
public class AutenticacaoService {
    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public AutenticacaoService(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return repository.findByLogin(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
    }

    public void registrar(LoginDTO dto) {
        if (repository.existsByLogin(dto.login())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Este login já está em uso!");
        }
        // Criptografa a senha com hash BCrypt antes de salvar no banco
        String senhaCriptografada = passwordEncoder.encode(dto.senha());
        Usuario novoUsuario = new Usuario(dto.login(), senhaCriptografada, dto.role());
        repository.save(novoUsuario);
    }
}

