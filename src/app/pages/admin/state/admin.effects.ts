import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { loadSuperuserToken } from "src/app/auth/state/auth.actions";
import { catchError, exhaustMap, map, withLatestFrom, mergeMap } from "rxjs/operators";
import { Pagination } from "src/app/interfaces/Pagination.interface";
import { AdminService } from "src/app/services/admin.service";
import { EditorService } from "src/app/services/editor.service";
import { AppState } from "src/app/store/app.state";
import Swal from "sweetalert2";
import { editCategorySuccess, getDataByUrl, loadData, borrarNovedades, loadUsersClient, setData, setFilter, setLoading, editCategory, saveClientData, crearNovedad, crearNovedadSuccess, editarNovedad, editarNovedadSuccess, loadDataNovedades, loadDataProductosConf } from './admin.actions'
import { getFilter } from "./admin.selector";
import { DashboardService } from "src/app/services/dashboard.service";

@Injectable()
export class AdminEffects{
  constructor(
    private store: Store<AppState>,
    private actions$:Actions,
    private adminService: AdminService,
    private editorService: EditorService,
    private dashboardService: DashboardService,
    private router: Router
  ){ }

  loadData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadData),
      withLatestFrom(this.store.select(getFilter)),
      mergeMap((action) => {
        const { category, body, orderby } = action[0];
        const actualFilter = action[1];
        return this.adminService.getData(category, body, orderby).pipe(
          map((data: Pagination) => {
            if(body || actualFilter) this.store.dispatch(setFilter({ filter: (body && body.filtro && !Object.keys(body.filtro).length) ? undefined : body }));
            this.store.dispatch(setLoading({ loading: false }));
            return setData({ data: data });
          }),
          catchError((error) => {
            this.store.dispatch(setLoading({ loading: false }));
            this.store.dispatch(setFilter({ filter: undefined }));
            return of(setData({ data: undefined }));
          })
        );
      })
    );
  });

  loadDataNovedades$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadDataNovedades),
      withLatestFrom(this.store.select(getFilter)),
      mergeMap((action) => {
        const { body } = action[0];
        const actualFilter = action[1];
        return this.adminService.getNovedadesData(body).pipe(
          map((data: Pagination) => {
            if(body || actualFilter) this.store.dispatch(setFilter({ filter: (body && body.filtro && !Object.keys(body.filtro).length) ? undefined : body }));
            this.store.dispatch(setLoading({ loading: false }));
            return setData({ data: data });
          }),
          catchError((error) => {
            this.store.dispatch(setLoading({ loading: false }));
            this.store.dispatch(setFilter({ filter: undefined }));
            return of(setData({ data: undefined }));
          })
        );
      })
    );
  });

  loadDataProductosConf$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadDataProductosConf),
      withLatestFrom(this.store.select(getFilter)),
      mergeMap((action) => {
        const { body } = action[0];
        const actualFilter = action[1];
        return this.adminService.getProductosConfData(body).pipe(
          map((data: Pagination) => {
            if(body || actualFilter) this.store.dispatch(setFilter({ filter: (body && body.filtro && !Object.keys(body.filtro).length) ? undefined : body }));
            this.store.dispatch(setLoading({ loading: false }));
            return setData({ data: data });
          }),
          catchError((error) => {
            this.store.dispatch(setLoading({ loading: false }));
            this.store.dispatch(setFilter({ filter: undefined }));
            return of(setData({ data: undefined }));
          })
        );
      })
    );
  });

  getDataByUrl$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getDataByUrl),
      mergeMap((action) => {
        const { url, body, category } = action;
        const peticion = (!category) ? this.adminService.getDataByUrlPost(url, body) :
        this.adminService.getDataByUrl(url, body, category);
        return peticion.pipe(
          map((data: Pagination) => {
            this.store.dispatch(setLoading({ loading: false }));
            return setData({ data: data });
          }),
          catchError((error) => {
            this.store.dispatch(setLoading({ loading: false }));
            this.store.dispatch(setFilter({ filter: undefined }));
            return of(setData({ data: undefined }));
          })
        );
      })
    );
  });

  loadUsersClient$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadUsersClient),
      withLatestFrom(this.store.select(getFilter)),
      exhaustMap((action) => {
        const { idCliente, body } = action[0];
        const actualFilter = action[1];
        return this.adminService.getUsers(idCliente, body).pipe(
          map((data: Pagination) => {
            if(body || actualFilter) this.store.dispatch(setFilter({ filter: body }));
            this.store.dispatch(setLoading({ loading: false }));
            return setData({ data: data });
          }),
          catchError((error) => {
            this.store.dispatch(setLoading({ loading: false }));
            this.store.dispatch(setFilter({ filter: undefined }));
            return of(setData({ data: undefined }));
          })
        );
      })
    );
  });


  changeCategory$ = createEffect(()=>{
    return this.actions$.pipe(
        ofType(editCategory),
        exhaustMap((action)=>{
            // id del cliente
            let clientId  = action.client.fk_cliente.id;

            // Data to send
            let clientDataSend = {category: action.category, verificado: true};

            // client
            let client = action.client

            return this.editorService.editClient(clientId, JSON.stringify(clientDataSend)).pipe(
                map((data)=>{
                    Swal.fire({
                        icon: 'success',
                        title: 'Convertido correctamente',
                        showConfirmButton: false,
                        timer: 2000
                    });

                    // Aquí hacemos la redirección al editor de Demo
                    const id = client['id'];

                    // cargar token del superusuario a editar
                    this.store.dispatch(loadSuperuserToken({ id: id }));

                    // seguridad de implementacion
                    let cliente = this.editorService.transformDatos([client], 'editar')[0];

                    const objCopy:any = { ...cliente };
                    objCopy['category']=action.category;

                    // Aquí va el dispatch para guardar en el state el cliente
                    this.store.dispatch(saveClientData({cliente:objCopy}));

                    if(action.category==2){
                      this.router.navigateByUrl('/admin/demos/demo?type=2');
                    }else if(action.category==3){
                      this.router.navigateByUrl('/admin/clientes/cliente?type=3');
                    }

                    return editCategorySuccess();
                }),catchError(error=>{
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al enviar los datos',
                        text: 'Algunos datos no se han actualizado correctamente',
                        showConfirmButton: true
                    });
                    return of(editCategorySuccess());
                })
            )
        })
    )
  });

  borrarNovedades$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(borrarNovedades),
      withLatestFrom(this.store.select(getFilter)),
      exhaustMap((action) => {
        const { novedades, filtro } = action[0];
        if(novedades) {
          var body = this.adminService.bodyBorrarNovedades(novedades);
        } else if (filtro) {
          var body = filtro;
        }
        return this.adminService.borrarNovedades(body).pipe(
          map((result) => {
            Swal.fire({
              icon: 'success',
              title: (novedades && novedades.length > 1) ? 'Novedades eliminadas' : 'Novedad eliminada',
              timer: 2000
            });
            return loadDataNovedades({});
          }),
          catchError((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: (novedades && novedades.length > 1) ? 'Error al eliminar las novedades' : 'Error al eliminar la novedad',
              timer: 2000
            });
            return of(loadDataNovedades({}));
          })
        );
      })
    );
  });

  crearNovedad$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(crearNovedad),
      exhaustMap((action) => {
        const { novedad } = action;
        return this.adminService.crearNovedad(novedad).pipe(
          map((result) => {
            return crearNovedadSuccess({ result: true });
          }),
          catchError((error) => {
            return of(crearNovedadSuccess({ result: false }));
          })
        );
      })
    );
  });

  editarNovedad$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editarNovedad),
      exhaustMap((action) => {
        const { body, id } = action;
        return this.adminService.editarNovedad(body, id).pipe(
          map((result) => {
            return editarNovedadSuccess({ result: true });
          }),
          catchError((error) => {
            return of(editarNovedadSuccess({ result: false }));
          })
        );
      })
    );
  });

}
