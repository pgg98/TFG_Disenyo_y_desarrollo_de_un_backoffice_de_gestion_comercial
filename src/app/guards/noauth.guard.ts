import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/api/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoauthGuard implements CanActivate {
  
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      return this.authService.validarToken()
      .pipe(
        tap( resp => {
          // Si devuelve falso, el token no es bueno, salimos a login
          if (!resp) {
            //return true
          } else {
            this.router.navigateByUrl('/admin/dashboard');
            // Si la ruta no es para el rol del token, reenviamos a ruta base de rol del token
          }
      })
    );
    
  }

  canLoad() {
    return true
  }
}
