import { Injectable } from '@angular/core';
import{HttpInterceptor,HttpHandler, HttpRequest,HttpEvent} from '@angular/common/http';
import{Observable, of, throwError} from 'rxjs';
import { catchError, exhaustMap, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { environment} from '../../environments/environment'
import { Token } from '../models/auth/token.model';
import { getSupersuserToken, getToken } from '../auth/state/auth.selector';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { logout } from '../auth/state/auth.actions';
import Swal from 'sweetalert2';
import { clearRequest } from './clearRequest.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(
    private store: Store<AppState>,
    private clearRequestService: clearRequest
    ) {
  }

  intercept(req:HttpRequest<any>,next:HttpHandler):Observable<HttpEvent<any>>{
    return this.store.select(getToken).pipe(
      take(1),
      withLatestFrom(this.store.select(getSupersuserToken)),
      exhaustMap((tokens:[Token, Token]) => {
        let token;

        // seleccionar token adecuado
        (tokens[1]) ? token = tokens[1] : token = tokens[0];
        let request = req;

        if(request.url.split('/')[2]==environment.databaseURL.split('/')[2] || request.url.split('/')[2]==environment.api_process_client_url.split('/')[2]){
          if(token){
            request = req.clone({
              setHeaders: {
                Authorization: `${ token.getToken() }`
              }
            });
          }else if(localStorage.token && JSON.parse(localStorage.token).token){
            request = req.clone({
              setHeaders: {
                Authorization: `${ JSON.parse(localStorage.token).token }`
              }
            });
          }
        }

        /* if (token && request.url.split('/')[2].search(environment.portip)==-1 && request.url.search('google')==-1) {
          request = req.clone({
              setHeaders: {
                Authorization: `${ token.getToken() }`
              }
            });
        } else if (localStorage.token && JSON.parse(localStorage.token).token) {
          request = req.clone({
              setHeaders: {
                Authorization: `${ JSON.parse(localStorage.token).token }`
              }
            });
        } */

        return next.handle(request).pipe(
          takeUntil(this.clearRequestService.onCancelPendingRequests()), //Cancelamos las peticiones pendientes en caso de que se quiera
          catchError(this.handleError<any>('', request))
        );

      })
    );
  }


  /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param request - optional value to return as the observable result
  */
  private handleError<T> (operation = 'operation', request?: HttpRequest<T>) {
    return (error: any): Observable<T> => {
      if(error.status==403){
        Swal.fire({
          title: 'Sin permiso',
          text: 'Usted no tiene permiso para realizar esta acción.',
          icon: 'warning',
        }).then((result) => {
          this.store.dispatch(logout())
        })
      }

      /*
      if(enabled){
          return throwError(typeof error.error);
      }else{
          return of(result as T)
      }
      */

      var result: any = error.error;
      if(typeof error === 'string') {
        result = error;
      } if(typeof error.error === 'string') {
        result = error.error;
      }else if(typeof error.error === 'object'){
        result = error.error;
      }else if(typeof error === 'object'){
        result = error;
      }

      // else if(typeof error.error === 'object' && Object.keys(error.error).length > 0 &&
      // Object.keys(error.error)[0] === '0') {
      //   result = error.error.join('\n');
      // } else if(typeof error.error === 'object' && Object.keys(error.error).length > 0) {
      //   result = 'Error inesperado'
      // }
      return this.specialUrls(result || 'Error inesperado', request, error);
    };
  }

  /**
   * Catch special cases and transform error data
   * @param result transform error data
   * @param request
   * @param error error response
   * @returns error
   */
  private specialUrls<T>(result: any, request?: HttpRequest<T>, error?: any): Observable<T> {
    if(request.url.includes(environment.celeryURL) || request.url.includes(environment.databaseURL)) {
      return throwError({
        status: error.status,
        error: result
      })
    }
    return throwError(result);
  }
}
