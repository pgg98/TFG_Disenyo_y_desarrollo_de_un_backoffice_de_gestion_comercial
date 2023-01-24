import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { Store } from "@ngrx/store"
import { AppState } from "../../store/app.state"
import { changeLoginWaiting, loadSuperusers, loadSuperusersSuccess, loadSuperuserToken, loadSuperuserTokenSuccess, loadUser, loadUserSuccess, loginStart, loginSuccess, logout, logoutSuccess, noData, refresh } from "./auth.actions";
import { catchError, exhaustMap,map, mergeMap, tap, withLatestFrom } from "rxjs/operators";
import { AuthService } from "../../services/api/auth.service";
import { of } from "rxjs";
import { initialStateAuth } from "./auth.state";
import Swal from "sweetalert2";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from "src/app/services/admin.service";
import { getSupersusers, getToken, getUser } from "./auth.selector";
import { setKeyValueAdmin } from "src/app/pages/admin/state/admin.actions";
import { labelsStateAdmin } from "src/app/pages/admin/state/admin.state";


@Injectable()
export class AuthEffects{
    constructor(
        private store: Store<AppState>,
        private actions$:Actions,
        private authService: AuthService,
        private adminService: AdminService,
        private router: Router,
        private route: ActivatedRoute
    ){}

    /** LOGIN */
    login$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(loginStart),
            exhaustMap((action)=>{
                const { user, password, saveTokenSuperUser } = action;
                return this.authService.login(user, password).pipe(
                    map((data)=>{
                        // Format and save token
                        const token = this.authService.format(data);
                        // solo queremos el token del usuario, no se está iniciando sesión
                        if(saveTokenSuperUser) return loadSuperuserTokenSuccess({ token: token });
                        // se está iniciando sesión
                        this.authService.setTokenDataInLocalStorage(token);
                        this.store.dispatch(loginSuccess({token}))

                        // Load user information
                        return loadUser()
                    }),
                    catchError(error => {
                      Swal.fire({icon: 'error', title: 'Oops...', text: error});
                      return of(changeLoginWaiting({status: false}));
                    })
                )
            })
        )
    });

    logout$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(logout),
            mergeMap((action)=>{
                // Eliminamos el localStorage
                this.authService.removeLocalStorage()

                // Navegamos al login
                this.router.navigateByUrl('/login');

                return of(logoutSuccess({token:initialStateAuth.token}))
            })
        );
    })

    /** REFRESH */
    refresh$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(refresh),
            exhaustMap((action)=>{
                const token = this.authService.getTokenFromLocalStorage();
                if (token!=null){
                    this.store.dispatch(loginSuccess({token}))
                    return of(loadUser());
                }else{
                    this.router.navigate(['/login'])
                    return of(noData())
                }

            })
        )
    });

    /** USER */
    loadUser$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loadUser),
            exhaustMap((action) => {
                return this.authService.getUser().pipe(
                    map((data) => {
                        // Ponemos el loginWaiting a false
                        this.store.dispatch(changeLoginWaiting({status: false}))
                        var ruta = window.location.pathname == '/login' ? '/admin/leads' : window.location.pathname
                        ruta = window.location.href.split(window.location.pathname)[1].length>0 ? ruta+window.location.href.split(window.location.pathname)[1] : ruta
                        if(data['superuser']){
                            // Si es superuser, go to admin/leads
                            this.router.navigateByUrl(ruta);
                            this.store.dispatch(loadSuperusers({}))
                            return loadUserSuccess({user:data});
                        }else{
                            // Si no es superuser, mostramos error y borramos el localStorage
                            this.authService.removeLocalStorage()
                            Swal.fire({icon: 'error', title: 'Oops...', text: 'Usted no puede acceder.',});
                            return noData()
                        }
                    }),
                    catchError((err) => {
                        // Si obtenemos un error, volvemos a login
                        this.router.navigateByUrl('/login');
                        return of(noData())
                    })
                )
            })
        )
    });

    /** SUPERUSERS */
    loadSuperusers$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loadSuperusers),
            withLatestFrom(
              this.store.select(getSupersusers),
              this.store.select(getToken),
              this.store.select(getUser)
            ),
            exhaustMap((action) => {
              let [{ id }, superusers, token, user ] = action;
                return this.adminService.getSuperusers().pipe(
                    map((data)=>{
                      id && this.store.dispatch(loadSuperuserToken({ id: id, clientsSuper: data }));
                      return loadSuperusersSuccess({ superusers: data });
                    }),
                    catchError(() => {
                      if(id && user?.fk_cliente?.id === id) {
                        this.store.dispatch(setKeyValueAdmin({ key: labelsStateAdmin.MESSAGE_SUPER, value: null }));
                        return of(loadSuperuserTokenSuccess({ token: token }));
                      }
                      Swal.fire({
                        icon: 'error',
                        title: '¡Error al cargar superusers!'
                      });

                      this.store.dispatch(setKeyValueAdmin({ key: labelsStateAdmin.MESSAGE_SUPER, value: 'Error al cargar los superusers. No se porán editar los datos del cliente. Intentar más tarde.' }));
                      return of(loadSuperusersSuccess({ superusers: superusers }));
                    })
                )
            })
        )
    });

    loadSuperuserToken$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(loadSuperuserToken),
            withLatestFrom(
              this.store.select(getSupersusers),
              this.store.select(getToken),
              this.store.select(getUser),
            ),
            tap(e => this.store.dispatch(setKeyValueAdmin({ key: labelsStateAdmin.LOADING_SUPERUSERS, value: true }))),
            exhaustMap((action)=>{
                const { id, clientsSuper } = action[0];
                const clients = clientsSuper || action[1];
                const token = action[2];
                const user = action[3];
                // comprobar si cliente es el logueado
                if(user?.fk_cliente?.id === id) {
                  this.store.dispatch(setKeyValueAdmin({ key: labelsStateAdmin.MESSAGE_SUPER, value: null }));
                  return of(loadSuperuserTokenSuccess({ token: token }));
                }
                // comprobar si hay clientes cargados
                if(!clients){
                      this.store.dispatch(setKeyValueAdmin({ key: labelsStateAdmin.MESSAGE_SUPER, value: 'Error al cargar los superusers. No se porán editar los datos del cliente. Intentar más tarde.' }));
                  return of(loadSuperuserTokenSuccess({token: null}));
                }

                var superuser = clients.find(el => el.fk_cliente.id === id);

                // por lo que sea no existe el superusuario
                if(!superuser){
                    this.store.dispatch(setKeyValueAdmin({ key: labelsStateAdmin.MESSAGE_SUPER, value: 'No existe superuser para este cliente. No se podrán editar los datos del cliente.' }));
                    return of(loadSuperuserTokenSuccess({token: null}));
                }

                
                return this.authService.login(superuser.user, superuser.password).pipe(
                    map((data)=>{
                        
                        // Format and save token
                        const token_data = this.authService.format(data);
                        // Load user information
                        this.store.dispatch(setKeyValueAdmin({ key: labelsStateAdmin.MESSAGE_SUPER, value: null }));
                        return loadSuperuserTokenSuccess({token: token_data})
                    }),
                    catchError(err => {
                    this.store.dispatch(setKeyValueAdmin({ key: labelsStateAdmin.MESSAGE_SUPER, value: 'Error al obtener token del superuser en estos momentos. No se podrán editar los datos del cliente. Intentar más tarde.' }));
                    return of(loadSuperuserTokenSuccess({token: null}));
                    })
                )
            }),
            map(e => {
              this.store.dispatch(setKeyValueAdmin({ key: labelsStateAdmin.LOADING_SUPERUSERS, value: false }));
              return e;
            })
        )
    });
}

