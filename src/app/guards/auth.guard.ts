import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/api/auth.service'


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private authService: AuthService,
               private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    return this.authService.validarToken()
      .pipe(
        tap( resp => {
          // Si devuelve falso, el token no es bueno, salimos a login
          if (!resp) {
            this.router.navigateByUrl('/login');
          } else {
            return true
            // Si la ruta no es para el rol del token, reenviamos a ruta base de rol del token
          }
      })
    );
    
     
  }

  canLoad() {
    return true
  }

}
