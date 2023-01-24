import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Token } from '../../models/auth/token.model';
import { Observable, of } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';


const TOKEN = 'token'


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  

  format(data:string):Token{
    const token = new Token(data,null);
    return token
  }


  setTokenDataInLocalStorage(token:Token):void{
    localStorage.setItem(TOKEN,JSON.stringify(token));
  }


  getTokenFromLocalStorage():Token{
    const token = localStorage.getItem(TOKEN);
    if(token){
      const tokenJson = JSON.parse(token); 
      const tokenObj = new Token(tokenJson.token,tokenJson.drive)
      return tokenObj;
    } 
    return null;
  }

  removeLocalStorage(){
    localStorage.clear()
  }

  /** CONEXIONS */

  login(user:string,password:string):Observable<string>{
    return this.http.post<any>(`${environment.databaseURL}/rest/login2`,{user:user,password:password});
  }

  getUser(): Observable<Usuario>{
    return this.http.get<Usuario>(`${environment.databaseURL}/rest/user`);   
  }

  validarToken(): Observable<boolean> {
    if (localStorage.getItem(TOKEN)) {
      return of(true);
    }else{
      return of(false);
    }
  }

}
