import { Component } from '@angular/core';
import { Cabecalho } from "../../components/cabecalho/cabecalho";
import { Rodape } from "../../components/rodape/rodape";
import { Router} from "@angular/router";
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [Cabecalho, Rodape, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  senha = '';
  mensagemErro = '';

  constructor(private loginService: LoginService, private router: Router) {}

  entrar() {
    if (!this.email || !this.senha) {
      this.mensagemErro = "Preencha todos os campos!";
      return;
    }

    this.loginService.buscar(this.email).subscribe({
      next: (resultado) => {
        const usuarioEncontrado = resultado[0];

        if (usuarioEncontrado && usuarioEncontrado.senha === this.senha) {
          alert('Acesso concedido!');
          
          this.router.navigate(['/dashboardadm']); 
        } else {
          this.mensagemErro = "Usuário ou senha incorretos.";
        }
      },
    });
  }

}
