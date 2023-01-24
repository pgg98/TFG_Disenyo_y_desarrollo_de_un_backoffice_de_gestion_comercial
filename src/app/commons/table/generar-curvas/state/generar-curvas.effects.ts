import { Injectable } from "@angular/core";
import { TranslocoService } from "@ngneat/transloco";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { forkJoin, of, Subject } from "rxjs";
import { catchError, exhaustMap, map, mergeMap, switchMap, takeUntil, tap, withLatestFrom } from "rxjs/operators";
import { noData } from "src/app/auth/state/auth.actions";
import { clearRequest } from "src/app/services/clearRequest.service";
import { CommonService } from "src/app/services/Common.service";
import { CurvasService } from "src/app/services/curvas.service";
import { EditorService } from "src/app/services/editor.service";
import Swal from "sweetalert2";
import { acceptComparedCurves, acceptNoComparedCurves, checkProcessCurve, createTemporalProcess, deleteAllOptimCurves, deleteAllProcessCurves, deleteProcessCurves, deleteSingleOptimCurve, deleteTemporalProcess, discardComparedCurves, discardNoComparedCurves, generarCurvasLoading, getCurvesToCompare, loadFiltersSucces, loadGenerarCurvasOptionsUniques, loadGenerarCurvasUniques, loadOptimCurves, loadOptimCurvesSuccess, loadProcessCurves, loadProcessCurvesSuccess, loadProcesses, loadProcessesSuccess, reprocessCurve, reprocessDbCurve, saveCurves, setStateGeneratedCurves } from "./generar-curvas.actions";
import { getOptimCurves, getProcessCurves, getProcessCurvesChecked, getProcessFilters } from "./generar-curvas.selector";
import { Process } from "./generar-curvas.state";
import { Pagination } from "src/app/interfaces/Pagination.interface";
import { CurvesSelection } from "src/app/interfaces/altas/curves.interface";

@Injectable()
export class GenerarCurvasEffects{

  constructor(
    private actions$:Actions,
    private store: Store,
    private curvasService: CurvasService,
    private editorService: EditorService,
    private commonService: CommonService,
    private clearRequestService: clearRequest
  ){ }

  /** LOAD UNIQUES */
  loadGenerarCurvasUniques$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadGenerarCurvasUniques),
      withLatestFrom(
        this.store.select(getProcessFilters)
      ),
      tap(e => this.store.dispatch(setStateGeneratedCurves({ key: 'loadingProcessesFilter', value: true }))),
      mergeMap(([{ areas }, processFilters]) => {
        let petitions: any = this.curvasService.buildUniquesJoin(areas)
          return (petitions.length) ?
          forkJoin(petitions).pipe(
            map((result: any[]) => {
              let filters: any = this.curvasService.buildFilters(processFilters, result)
              return loadFiltersSucces({filters: filters, tipo: 1})
            }),
            catchError(e => of(noData()))
          ): of(noData())
      }),
      map(e => {
        this.store.dispatch(setStateGeneratedCurves({ key: 'loadingProcessesFilter', value: false }));
        return e;
      })
    )
  });

  loadGenerarCurvasOptionsUniques$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadGenerarCurvasOptionsUniques),
      withLatestFrom(
        this.store.select(getProcessFilters)
      ),
      tap(e => this.store.dispatch(setStateGeneratedCurves({ key: 'loadingProcessesFilter', value: true }))),
      mergeMap(([ { areas, filters,  }, actualFilters]) => {
        let petitions: any = this.curvasService.buildUniquesOptionsJoin(areas, (filters?.length) ? filters : null)
        return (petitions.length) ?
        forkJoin(petitions).pipe(
          map((result: any[]) => {
            let filters: any = this.curvasService.buildFilters(actualFilters, result)
            return loadFiltersSucces({filters: filters, tipo: 2})
          }),
          catchError(e => of(noData()))
        ) : of(noData());
      }),
      map(e => {
        this.store.dispatch(setStateGeneratedCurves({ key: 'loadingProcessesFilter', value: false }));
        return e;
      })
    )
  });

  /** LOAD PROCESSES */
  loadProcesses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadProcesses),
      tap(e => this.store.dispatch(generarCurvasLoading({ value: true, info: 'Cargando procesos...'}))),
      switchMap(({ area, filtros }) => {
        return this.curvasService.getProcesses(area).pipe(
          map((processes: Process[]) => {
            //this.store.dispatch(loadProcessCurves({area: action.area, process: processes[0].id, page: 1, limit: 6, filters: action.filtros}));
            return loadProcessesSuccess({processes: processes})
          }),
          catchError((error) => of(loadProcessesSuccess({processes: null})))
        )
      }),
      map(e => {
        this.store.dispatch(generarCurvasLoading({value: false}))
        return e;
      })
    )
  });

  /** LOAD PROCESS CURVES */
  loadProcessCurves$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadProcessCurves),
      tap(({ page }) => this.store.dispatch(generarCurvasLoading({ value: true, info: `Cargando curvas temporales ${(page) ? '(pag ' + page + ')' : ''}...`}))),
      switchMap(({ area, process, page, limit, filters }) => {
        filters = this.curvasService.formatBodyFilter(filters, 'Temporales');
        filters = this.commonService.translateObject(filters,'curve', 'en')

        return this.curvasService.getProcessCurves(process, page, limit, filters).pipe(
          takeUntil(this.clearRequestService.onCancelPendingRequestsCurves()),
          map((response: Pagination) => {
            let datos = response.datos.map(data => {
              let newData = this.commonService.translateObject(data, "curve", 'es');
              newData['compare'] = (data['compare']) ? this.curvasService.formatCompareTemporalCurve(newData) : null;
              return newData;
            });
            response.datos = datos;
            return loadProcessCurvesSuccess({ processCurves: response });
          }),
          catchError((error) => of(loadProcessCurvesSuccess({processCurves: null})))
        )
      }),
      map(e => {
        this.store.dispatch(generarCurvasLoading({value: false}))
        return e;
      })
    )
  });

  //GET CURVES TO COMPARE

  getCurvesToCompare = createEffect(() => {
    return this.actions$.pipe(
      ofType(getCurvesToCompare),
      exhaustMap(({ process, filters }) => {
        filters = this.curvasService.formatBodyFilter(filters, 'Temporales');
        filters = this.commonService.translateObject(filters,'curve', 'en');
        filters = { ...filters, compare: {$ne: null} }
        return this.curvasService.getProcessCurves(process, 1, 1, filters).pipe(
          takeUntil(this.clearRequestService.onCancelPendingRequestsCurves()),
          map((response: Pagination) => {
            return setStateGeneratedCurves({key: 'compare_total_curves', value: response.objects})
          }),
          catchError((error) => {
            return of(noData())
          })
        )
      })
    )
  })

  /** LOAD OPTIM CURVES */
  loadOptimCurves$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(loadOptimCurves),
        withLatestFrom(
          this.store.select(getOptimCurves)
        ),
        tap(([{ page }]) => this.store.dispatch(generarCurvasLoading({ value: true, info: `Cargando curvas actuales ${(page) ? '(pag ' + page + ')' : ''}...`}))),
        switchMap(([ { area, filters, page, limit }, optimCurves ]) => {
          let body: any = {
            areas: area,
            product: ['agua','lai','clorofila','ndvi'],
            valores: true
          }

          // add filter to body
          if(filters && filters.constructor.name === 'Object' && Object.keys(filters).length){
            body['filtro'] = this.curvasService.formatBodyFilter(filters, CurvesSelection.BBDD);
          }

          if(body.filtro?.producto__in){
            body.product = body.filtro.producto__in
            delete body.filtro.producto__in
          }

          if(Array.isArray(body.filtro?.dds)){
            body.filtro.dds__in = body.filtro.dds;
            delete body.filtro.dds;
          }

          this.store.dispatch(setStateGeneratedCurves({key: 'compare_total_curves', value: null}))

          return this.editorService.getCurvasOptimasPage({ page: page, limit: limit }, body).pipe(
            takeUntil(this.clearRequestService.onCancelPendingRequestsCurves()),
            map((response: any) => loadOptimCurvesSuccess({optimCurves: response})),
            catchError((error: any) => of(noData())),
          );
        }),
        map(e => {
          this.store.dispatch(generarCurvasLoading({value: false}));
          return e;
        })
    )
  });

  /** DELETE ALL OPTIM CURVES */
  deleteAllOptimCurves$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteAllOptimCurves),
      tap(e => this.store.dispatch(generarCurvasLoading({ value: true, info: 'Borrando curvas...'}))),
      exhaustMap(({ area, filtros }) => {
        const filters = this.curvasService.formatBodyFilter({ ...filtros }, CurvesSelection.BBDD);
        return this.curvasService.deleteAllOptimCurves(area, filters).pipe(
            map((response: any) => {
              this.store.dispatch(loadOptimCurves({area: [area], page: 1, limit: 6, filters: filtros}))
              Swal.fire({
                icon: 'success',
                title: 'Curvas eliminadas correctamente',
              })
              return noData()
            }),
            catchError(e => of(noData()))
        );
      }),
      map(e => {
        this.store.dispatch(generarCurvasLoading({ value: false }));
        return e;
      })
    )
  });

  /** DELETE SINGLE OPTIM CURVE */
  deleteSingleOptimCurve$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteSingleOptimCurve),
      tap(e => this.store.dispatch(generarCurvasLoading({ value: true, info: 'Borrando curva...'}))),
      exhaustMap((action) => {
        let body = { "id": [action.id] };
        return this.editorService.deleteCurvasOptimas(action.area, body).pipe(
          map((response: any) => {
            this.store.dispatch(loadOptimCurves({area: [action.area], page: 1, limit: 6, filters: action.filtros}))
            Swal.fire({
              icon: 'success',
              title: 'Curva eliminada correctamente',
            })
            return noData()
          }),
          catchError(e => of(noData()))
        );
      }),
      map(e => {
        this.store.dispatch(generarCurvasLoading({ value: false }));
        return e;
      })
    )
  });

  /** DELETE ALL PROCESS CURVES */
  deleteAllProcessCurves$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(deleteAllProcessCurves),
        tap(e => this.store.dispatch(generarCurvasLoading({ value: true, info: 'Borrando curvas temporales...'}))),
        exhaustMap(({ process }) => {
          return of(this.curvasService.deleteAllProcessCurves(process)).pipe(
            map((response: any) => {
              Swal.fire({
                icon: 'success',
                title: 'Curvas eliminadas correctamente',
              })
              return noData()
            }),
            catchError(e => of(noData()))
          );
        }),
        map(e => {
          this.store.dispatch(generarCurvasLoading({ value: false }));
          return e;
        })
    )
  });

  /** DELETE PROCESS CURVES */
  deleteProcessCurves$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(deleteProcessCurves),
        withLatestFrom(
          this.store.select(getProcessCurvesChecked)
        ),
        tap(e => this.store.dispatch(generarCurvasLoading({ value: true, info: 'Borrando curvas temporales...'}))),
        exhaustMap(([{ ids, process, compare, area, filters }, curvesChecked]) => {
          let body: any = {_id: {$in: null}}

          if(ids){
            body._id.$in = ids
          }else if(curvesChecked?.length){
            body._id.$in = curvesChecked
          }
          if(body._id.$in){
            return this.curvasService.deleteProcessCurves(process.id, body).pipe(
              map((response: any) => {
                // Pedir de nuevo las curvas
                !compare && this.store.dispatch(checkProcessCurve({ id: body._id.$in }));
                Swal.fire({
                  icon: 'success',
                  title: 'Curvas eliminadas correctamente',
                })
                return loadProcesses({ area: area, filtros: {} })
              }),
              catchError(e => of(noData()))
            );
          } else {
            // Mostrar un mensaje de que ninguna curva ha sido seleccionada para poder borrarla
            Swal.fire({
              icon: 'warning',
              title: 'Selecciona al menos una curva'
            })
            return of(noData())
          }
        }),
        map(e => {
          this.store.dispatch(generarCurvasLoading({ value: false }))
          return e;
        })
    )
  });

  /** DELETE PROCESS CURVES */
  saveCurves$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(saveCurves),
      tap(e => this.store.dispatch(generarCurvasLoading({ value: true, info: 'Guardando curvas...'}))),
      exhaustMap(({ area, process, ids, compare, filters }) => {
        let body: any = {
          proceso: process.id,
          filtro: { _id: { $in: ids } }
        }

        return this.curvasService.saveCurves(area, body).pipe(
          map((response: any) => {
            // Con esto cada vez que se acepta una comparada sale una curvas más como seleccionada cuando no hay ninguna seleccionada
            !compare && this.store.dispatch(checkProcessCurve({ id: ids }))
            Swal.fire({
              icon: 'success',
              title: 'Curvas añadidas correctamente',
              text: response || ''
            })
            return loadProcesses({ area: area, filtros: {} })
          }),
          catchError((error) => {
            if(error.status == 666){
              //curvas desactualizadas
              Swal.fire({
                icon: 'error',
                title: 'El proceso está desactualizado',
                text: 'Para poder actualizar las curvas, se borrará el proceso actual y se generará uno con los mismo datos. ¿Desea continuar?',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí',
                cancelButtonText: 'No',
                width: '400px'
              }).then((result) => {
                if (result.isConfirmed) {

                  const body = {area_id: process.area_id, configuration: process.configuration, params: process.params}
                  this.store.dispatch(deleteTemporalProcess({processId: process.id, area_id: area}))
                  this.store.dispatch(createTemporalProcess({filters: body}))
                }
              })
            }

            else{
              let text = 'Error desconocido al subir la curva';
              if(typeof error.error == 'string') text = error.error;
              if(Array.isArray(error.error)){
                text = 'Se descargará un csv con los errores';
                this.curvasService.downloadErrors(error.error);
              }
              Swal.fire({
                icon: 'error',
                title: 'Fallo al subir la curva temporal',
                text: text,
                timer: 4000
              });
            }

            return of(loadProcesses({ area: area, filtros: {} }));

          })
        );
      }),
      map(e => {
        this.store.dispatch(generarCurvasLoading({ value: false }))
        return e;
      })
    )
  });

  /** ACCEPT ALL COMPARED CURVES */
  acceptComparedCurves$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(acceptComparedCurves),
        tap(e => this.store.dispatch(generarCurvasLoading({ value: true, info: 'Actualizando curvas comparadas...'}))),
        exhaustMap(({ process, area, filters }) => {
          filters = this.curvasService.formatBodyFilter(filters, 'Temporales');
          filters = this.commonService.translateObject(filters,'curve', 'en');
          let body = {"product":["agua","lai","clorofila","ndvi"], "proceso": process.id, "filtro": { ...filters, compare: { $ne: null }} };

          return this.curvasService.saveCurves(area, body).pipe(
            map((response: any) => {
              /** Pedimos otra vez las curvas del proceso seleccionado */
              this.store.dispatch(loadProcesses({ area: area, filtros: {} }));
              Swal.fire({
                icon: 'success',
                title: 'Curvas aceptadas',
                text: response || '',
                timer: 4000
              });
              return noData()
            }),
            catchError(e => {

              this.store.dispatch(loadProcesses({ area: area, filtros: {} }));


              if(e.status == 666){
                //curvas desactualizadas

                Swal.fire({
                  icon: 'error',
                  title: 'El proceso está desactualizado',
                  text: 'Para poder actualizar las curvas, se borrará el proceso actual y se generará uno con los mismo datos. ¿Desea continuar?',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Sí',
                  cancelButtonText: 'No',
                  width: '400px'
                }).then((result) => {
                  if (result.isConfirmed) {

                    const body = {area_id: process.area_id, configuration: process.configuration, params: process.params}
                    this.store.dispatch(deleteTemporalProcess({processId: process.id, area_id: area}))
                    this.store.dispatch(createTemporalProcess({filters: body}))
                  }
                })
              }
              else{

                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'No se han actualizado todas las curvas',
                  timer: 4000
                });
              }

              return of(noData());
            })
          );
        }),
        map(e => {
          this.store.dispatch(generarCurvasLoading({ value: false }))
          return e;
        })
    )
  });

  /** DISCARD ALL COMPARED CURVES */
  discardComparedCurves$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(discardComparedCurves),
        tap(e => this.store.dispatch(generarCurvasLoading({ value: true, info: 'Descartando curvas comparadas...'}))),
        exhaustMap(({ area, process, filters }) => {
          filters = this.curvasService.formatBodyFilter(filters, 'Temporales');
          filters = this.commonService.translateObject(filters,'curve', 'en');
          let body = { ...filters, compare: { $ne: null }} ;

          return this.curvasService.deleteProcessCurves(process, body).pipe(
            map((response: any) => {
              /** Pedimos otra vez las curvas del proceso seleccionado */
              this.store.dispatch(loadProcesses({ area: area, filtros: {} }));
              Swal.fire({
                icon: 'success',
                title: 'Curvas descartadas',
                text: response || ''
              });
              return noData()
            }),
            catchError(e => {
              this.store.dispatch(loadProcesses({ area: area, filtros: {} }));
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (e) ? e['error'] : 'Error inesperado',
                timer: 4000
              });
              return of(noData());
            })
        );
        }),
        map(e => {
          this.store.dispatch(generarCurvasLoading({ value: false }))
          return e;
        })
    )
  });


  /** ACCEPT ALL NO COMPARED CURVES */
  acceptNoComparedCurves$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(acceptNoComparedCurves),
        tap(e => this.store.dispatch(generarCurvasLoading({ value: true, info: 'Añadiendo curvas...'}))),
        exhaustMap(({ process, area, filters }) => {
          filters = this.curvasService.formatBodyFilter(filters, 'Temporales');
          filters = this.commonService.translateObject(filters,'curve', 'en');
          let body: any = {
            proceso: process.id,
            filtro: { compare: { $eq: null }, ...filters }
          }

          return this.curvasService.saveCurves(area, body).pipe(
            map((response: any) => {
              // Con esto cada vez que se acepta una comparada sale una curvas más como seleccionada cuando no hay ninguna seleccionada
              this.store.dispatch(loadProcesses({ area: area, filtros: {} }));
              Swal.fire({
                icon: 'success',
                title: 'Curvas añadidas correctamente',
                text: response || ''
              })
              return checkProcessCurve({id: null})
            }),
            catchError((error)=>{

              this.store.dispatch(loadProcesses({ area: area, filtros: {} }));

              if(error.status == 666){
                //curvas desactualizadas

                Swal.fire({
                  icon: 'error',
                  title: 'El proceso está desactualizado',
                  text: 'Para poder actualizar las curvas, se borrará el proceso actual y se generará uno con los mismo datos. ¿Desea continuar?',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Sí',
                  cancelButtonText: 'No',
                  width: '400px'
                }).then((result) => {
                  if (result.isConfirmed) {

                    const body = {area_id: process.area_id, configuration: process.configuration, params: process.params}
                    this.store.dispatch(deleteTemporalProcess({processId: process.id, area_id: area}))
                    this.store.dispatch(createTemporalProcess({filters: body}))
                  }
                })
              }
              else{
                Swal.fire({
                  icon: 'error',
                  title: 'Error al añadir las curvas',
                  text: (error) ? error['error'] : 'Error inesperado'
                });
              }

              return of(noData())
            })
          )
        }),
        map(e => {
          this.store.dispatch(generarCurvasLoading({ value: false }))
          return e;
        })
    )
  });

  /** DISCARD ALL NO COMPARED CURVES */
  discardNoComparedCurves$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(discardNoComparedCurves),
        tap(e => this.store.dispatch(generarCurvasLoading({ value: true, info: 'Descartando curvas no comparadas...'}))),
        exhaustMap(({ process, area, filters }) => {
          filters = this.curvasService.formatBodyFilter(filters, 'Temporales');
          filters = this.commonService.translateObject(filters,'curve', 'en');
          let body = { ...filters, compare: {$eq: null} }
          return this.curvasService.deleteProcessCurves(process, body).pipe(
            map((response: any) => {
              // Pedir de nuevo las curvas
              this.store.dispatch(checkProcessCurve({id: null}))
              Swal.fire({
                icon: 'success',
                title: 'Curvas descartadas correctamente',
              })
              return loadProcesses({ area: area, filtros: {} });
            }),
            catchError((error)=>{
              this.store.dispatch(loadProcesses({ area: area, filtros: {} }));
              Swal.fire({
                icon: 'error',
                title: 'Error al eliminar las curvas'
              })
              return of(noData())
            })
          );
        }),
        map(e => {
          this.store.dispatch(generarCurvasLoading({ value: false }))
          return e;
        })
    )
  });

  /** REPROCESS CURVE */
  reprocessCurve$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(reprocessCurve),
        tap(e => this.store.dispatch(setStateGeneratedCurves({ key: 'loadingProcessesFilter', value: true }))),
        exhaustMap(({ curveId, areaId }) => {
          return this.curvasService.reprocessCurve(curveId).pipe(
            map((newProcess: any) => {
              Swal.fire({
                icon: 'success',
                title: `¡Curva reprocesada!`,
                showCancelButton: true,
                cancelButtonText: 'Ir a proceso',
                cancelButtonColor: '#005792'
              }).then((value) => {
                if(value.isDismissed) {
                  this.curvasService.nextSelectedProcess({
                    name: newProcess['name'],
                    id: newProcess['id'],
                    celery_id: newProcess['celery_id'],
                  })
                }
              })
              return noData()
            }),
            catchError(() => {
              Swal.fire({
                icon: 'error',
                title: 'Error al reprocesar la curva'
              })
              return of(noData());
            })
        );
      }),
      map(e => {
        this.store.dispatch(setStateGeneratedCurves({ key: 'loadingProcessesFilter', value: false }))
        return e;
      })
    )
  });

  createTemporalProcess$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(createTemporalProcess),
        tap(e => this.store.dispatch(setStateGeneratedCurves({ key: 'loadingProcessesFilter', value: true }))),
        exhaustMap(({ filters, area_id }) => {
          let body = area_id
            ? this.curvasService.formatCreateTemporalProcess(filters, area_id)
            : filters

          return this.curvasService.createTemporalProcess(body).pipe(
            map((newProcess: Object) => {
              Swal.fire({
                icon: 'success',
                title: `Proceso creado: ${newProcess['name']}`,
                showCancelButton: true,
                cancelButtonText: 'Ir a proceso',
                cancelButtonColor: '#005792'
              }).then((value) => {
                if(value.isDismissed) {
                  this.curvasService.nextSelectedProcess({
                    name: newProcess['name'],
                    id: newProcess['id'],
                    celery_id: newProcess['celery_id'],
                  })
                }
              })
              return noData()
            }),
            catchError(error => {
              Swal.fire({
                icon: 'error',
                title: 'Error al crear el proceso'
              });
              return of(noData())
            })
          );
        }),
        map(e => {
          this.store.dispatch(setStateGeneratedCurves({ key: 'loadingProcessesFilter', value: false }))
          return e;
        })
    )
  });

  deleteTemporalProcess$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(deleteTemporalProcess),
        tap(e => this.store.dispatch(generarCurvasLoading({ value: true, info: 'Eliminando proceso...'}))),
        exhaustMap(({ processId, area_id }) => {
          return this.curvasService.deleteTemporalProcess(processId).pipe(
            map((result: { result: boolean, message: string }) => {
              Swal.fire({
                icon: result.result ? 'success' : 'error',
                title: result.result ? `Proceso ${processId} eliminado correctamente` : 'Error inesperado'
              })
              this.store.dispatch(loadProcesses({ area: area_id, filtros: {} }))
              return noData()
            }),
            catchError(() => {
              Swal.fire({
                icon: 'error',
                title: 'Error a eliminar el proceso'
              })
              this.store.dispatch(loadProcesses({ area: area_id, filtros: {} }))
              return of(noData());
            })
          );
        }),
        map(e => {
          this.store.dispatch(generarCurvasLoading({ value: false }))
          return e;
        })
    )
  });

  reprocessDbCurve$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(reprocessDbCurve),
        tap(({ curves }) => this.store.dispatch(generarCurvasLoading({ value: true, info: `Reprocesando ${curves.length} curvas...`}))),
        exhaustMap(({ curves, areaId }) => {
          let trad_curves = curves.map(curve => this.commonService.translateObject(curve,'curve', 'en'));
          return this.curvasService.reprocessDbCurve(areaId, trad_curves).pipe(
            map((newProcess: any) => {
              Swal.fire({
                icon: 'success',
                title: `Proceso creado: ${newProcess['name']}`,
                showCancelButton: true,
                cancelButtonText: 'Ir a proceso',
                cancelButtonColor: '#005792'
              }).then((value) => {
                if(value.isDismissed) {
                  this.curvasService.nextSelectedProcess({
                    name: newProcess['name'],
                    id: newProcess['id'],
                    celery_id: newProcess['celery_id'],
                  })
                }
              })
              return loadProcesses({ area: areaId, filtros: {} })
            }),
            catchError(() => {
              Swal.fire({
                icon: 'error',
                title: 'Error al reprocesar curvas'
              })
              return of(loadProcesses({ area: areaId, filtros: {} }));
            })
          );
        }),
        map(e => {
          this.store.dispatch(generarCurvasLoading({ value: false }))
          return e;
        })
    )
  });
}
