import { Component } from '@angular/core';
import { Cabecalho } from "../../components/cabecalho/cabecalho";
import { Rodape } from "../../components/rodape/rodape";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [Cabecalho, Rodape, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}
