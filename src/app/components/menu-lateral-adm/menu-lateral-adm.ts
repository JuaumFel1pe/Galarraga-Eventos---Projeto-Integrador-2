import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu-lateral-adm',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu-lateral-adm.html',
  styleUrl: './menu-lateral-adm.css',
})
export class MenuLateralAdm {}
