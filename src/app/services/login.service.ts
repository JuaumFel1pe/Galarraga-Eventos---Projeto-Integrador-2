import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private api = "http://localhost:3000/login"

  constructor(private http : HttpClient) { }

  buscar(email: string): Observable<Login[]> {
    return this.http.get<Login[]>(`${this.api}?email=${email}`);
  }
}

export interface Login{
  id: number,
  email: string,
  senha: string
}