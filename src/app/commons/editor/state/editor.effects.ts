import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { Store } from "@ngrx/store"
import { forkJoin, of } from "rxjs";
import { catchError, exhaustMap, map, switchMap, withLatestFrom } from "rxjs/operators";
import { changeLoginWaiting, loadSuperusers, loadSuperuserTokenSuccess, loginStart, noData } from "src/app/auth/state/auth.actions";
import { Area } from "src/app/interfaces/area";
import { Pagination } from "src/app/interfaces/Pagination.interface";
import { saveClientData } from "src/app/pages/admin/state/admin.actions";
import { AdminService } from "src/app/services/admin.service";
import { EditorService } from "src/app/services/editor.service";
import { AppState } from "src/app/store/app.state";
import Swal from "sweetalert2";
import { columnsTable } from "../../constants/columnsTable";
import { createAreaProducts, createArea, loadClientAreasSucces, loadDataSpecificClient, loadClientAreas, loadEditorProductos, loadEditorProductosSucces, loadEditorHerramientas, loadEditorHerramientasSucces, editUser, editUserSuccess, editClient, editClientSuccess, createAreaSuccess, loadAreaProducts, createAreaProductsSuccess, saveNewUser, registerClientToStripe, saveAreaProducts, uniquesSuccess, uniques, areasAll, areasAllSuccess, curvasOptimas, curvasOptimasSuccess, asignarCurvasSuccess, borrarCurvas, borrarCurvasSuccess, addBorrarCurvas, setCurveFilter, expireClient, loadingCurves, EDIT_CLIENT_SUCCESS } from "./editor.actions";
import { getEditorHerramientas, getEditorProductos, getCurvasFilter, getCurvasBorrar } from "./editor.selector"
import { addPoligono, addPoligonoSuccess, sendPoligono, sendPoligonoSuccess, uniquesLimited, uniquesLimitedSuccess, finishAreaSuccess, finishArea, editArea, editAreaSuccess, asignarCurvas } from "./editor.actions";
import { Router } from '@angular/router';
import { setLoading } from "src/app/pages/admin/state/admin.actions";
import { savePlans, saveProductConfigurationsAll } from "src/app/pages/admin/products_configuration/state/productsConfiguration.actions";
import { setTitle } from "src/app/store/share/share.actions";
@Injectable()
export class EditorEffects{
    constructor(
        private store: Store<AppState>,
        private actions$: Actions,
        private editorService: EditorService,
        private adminService: AdminService,
        private router: Router
    ){}

    /** PRODUCTOS */
    productos$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(loadEditorProductos),
            exhaustMap((action)=>{
                return this.editorService.getProductos().pipe(
                    map((data)=>{
                        data.forEach(element => {
                            delete element.id
                        });

                        this.store.dispatch(saveProductConfigurationsAll({products: data}))
                        this.store.dispatch(savePlans({products: data}))

                        var productos = this.editorService.formatearProductos(data, action.data);
                        return loadEditorProductosSucces({area:action.area, productos: productos});
                    })
                )
            }),
            map(e => {
              this.store.dispatch(setLoading({ loading: false }))
              return e;
            })
        )
    });

    loadAreaProducts$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(loadAreaProducts),
            exhaustMap((action)=>{
                var id = action.area.id;

                return this.editorService.getAreaProducts(id).pipe(
                    map((data)=>{
                        if(action.tipo && action.tipo == 'asignar'){
                            return saveAreaProducts({productos: data});
                        }else{
                            return loadEditorProductos({data: data, area: action.area});
                        }
                    }),
                )
            }),
            map(e => {
              this.store.dispatch(setLoading({ loading: false }))
              return e;
            })
        )
    });

    areasAll$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(areasAll),
            exhaustMap((action)=>{

                let filtros = this.editorService.formatAreasFilters(action.filtros);

                return this.editorService.getAreasAll(filtros).pipe(
                    map((data)=>{
                        return areasAllSuccess({areas: data});
                    })
                )
            }),
            map(e => {
              this.store.dispatch(setLoading({ loading: false }))
              return e;
            })
        )
    });

    createProducts$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(createAreaProducts),
            exhaustMap((action)=>{
                var petitions = action.peticiones;

                return forkJoin(petitions).pipe(
                    map((value) => {
                      Swal.fire({
                        // position: 'top-end',
                        icon: 'success',
                        title: 'Productos guardados correctamente',
                        showConfirmButton: true
                    });
                        return createAreaProductsSuccess({ result: true });
                    }), catchError(error=>{
                        Swal.fire({
                            // position: 'top-end',
                            icon: 'error',
                            title: 'Error al enviar los datos',
                            text: 'Algunos datos no se han actualizado correctamente',
                            showConfirmButton: true
                        });
                        return of(createAreaProductsSuccess({}));
                    })
                );
            }),
            map(e => {
              this.store.dispatch(setLoading({ loading: false }))
              return e;
            })
        )
    });

    /** HERRAMIENTAS */
    herramientas$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(loadEditorHerramientas),
            exhaustMap((action)=>{
                return this.editorService.getHerramientas().pipe(
                    map((data)=>{
                        var herramientas = this.editorService.formatearHerramientas(data, action.data);
                        return loadEditorHerramientasSucces({data: herramientas});
                    })
                )
            }),
            map(e => {
              this.store.dispatch(setLoading({ loading: false }))
              return e;
            })
        )
    });

    /** AREAS */
    areas$ = createEffect(()=>{
			return this.actions$.pipe(
				ofType(loadClientAreas),
				exhaustMap((action)=>{
					let id = action.clientId;
					return this.editorService.getAreasCliente(id).pipe(
						map((data)=>{
							// this.store.dispatch(setLoading({ loading: false }));
							return loadClientAreasSucces({data: data});
						}),
						catchError(error => {
							return of(setLoading({ loading: false }));
						})
					)
				}),
				map(e => {
					this.store.dispatch(setLoading({ loading: false }))
					return e;
				})
			)
    });

    crearArea$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(createArea),
            exhaustMap((action)=>{
                let area = action.area;
                let id = action.clientId;
                return this.editorService.crearArea(id, area).pipe(
                    map((data: Area)=>{
                    this.store.dispatch(loadClientAreas({ clientId: action.clientId }));
                    Swal.fire({
                        icon: 'success',
                        title: 'Área creada correctamente',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    return createAreaSuccess({data: data});
                    }),
                    catchError(error => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: (typeof error === 'string') ? error : 'Área no creada',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        return of(setLoading({ loading: false }));
                    })
                )
            }),
            // map(e => {
            //   this.store.dispatch(setLoading({ loading: false }))
            //   return e;
            // })
        )
    });

    /** USUARIO */

    editUser$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(editUser),
            exhaustMap((action)=>{
              const { userId, userData, category } = action;
                return this.editorService.editUser(userId, userData).pipe(
                  map((data: Object)=>{
                      return editUserSuccess({ data: data, category: category, result: true });
                  }), catchError(error=>{
                      /*Swal.fire({
                          icon: 'error',
                          title: 'Error al enviar los datos',
                          text: 'Algunos datos no se han actualizado correctamente',
                          showConfirmButton: true
                      });*/
                      return of(editUserSuccess({ data: null, category: category, result: false }));
                  })
                )
            }),
            map(e => {
              this.store.dispatch(setLoading({ loading: false }))
              return e;
            })
        )
    });

    registerClientToStripe$ = createEffect(()=>{
      return this.actions$.pipe(
          ofType(registerClientToStripe),
          exhaustMap((action)=>{
            const { id } = action;
              return this.editorService.addToStripePayment(id).pipe(
                map((data: Object)=>{
                    return setLoading({ loading: false });
                }), catchError(error=>{
                    return of(setLoading({ loading: false }));
                })
              )
          }),
          map(e => {
            this.store.dispatch(setLoading({ loading: false }))
            return e;
          })
      )
  });

    /** CLIENTE */

    editClient$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(editClient),
            withLatestFrom(
                this.store.select(getEditorHerramientas),
                this.store.select(getEditorProductos)
            ),
            exhaustMap((action) => {
              let { clientId, clientData, userId, userData, isNew, tab }= action[0];
                var herramientas = action[1];
                var productos = action[2]
                const actualCategory = clientData['category'];
                let typeSwal = 0;
                let datos = [clientData];
                let datosCopy = [];

                datos.map(function(dato){
                    const objCopy = { ...dato }; // 👈️ create copy of object
                    if (dato.alta_freq !== undefined && dato.alta_freq==null){
                        objCopy.alta_freq = false;
                    }
                    if (dato.contactado !== undefined && dato.contactado==null){
                        objCopy.contactado = false;
                    }
                    datosCopy.push(objCopy);

                    return dato;
                });

                datosCopy[0] = JSON.stringify(datosCopy[0]);

                if(actualCategory!=1){
                    // si tab === 1, solo se actualizan las herramientas
                    datosCopy[0] = (tab !== 1) ? datosCopy[0] :
                     this.editorService.herramientasBody(herramientas, (tab === 1) ? undefined : datosCopy[0]);

                    // si el tab es === 3, productos
                    if(tab === 3) {
                      var peticiones = this.editorService.peticionesProductos(productos,action[0].client.language);
                      return of(createAreaProducts({peticiones: peticiones}));
                    }
                }

                return this.editorService.editClient(clientId, datosCopy[0]).pipe(
                    map((data)=>{
                        if(tab === 1) {
                          Swal.fire({
                            // position: 'top-end',
                            icon: 'success',
                            title: 'Herramientas actualizadas correctamente',
                            showConfirmButton: true
                          });
                          return editClientSuccess({ result: true });
                        }
                        let client = datos[0];
                        if(client['metodo_pago'] && client['metodo_pago'] === 'Stripe') {
                          this.store.dispatch(registerClientToStripe({ id: data['id'] }))
                        }
                         // se edita el usuario
                        return (userId !== null && userData !== null && actualCategory==1) ?
                        editUser({ userId: userId, userData: userData, category: actualCategory }) :
                        editClientSuccess({ data: data, category: actualCategory, result: true, isNew: isNew });
                        // se ha editado el cliente
                        //return { dataClient: data, userId: userId, userData: userData, category: actualCategory, result: true, isNew: isNew };
                      }),
                      catchError(error=>{
                        if(tab === 1) {
                          Swal.fire({
                            // position: 'top-end',
                            icon: 'error',
                            title: 'Error al actualizar herramientas',
                            showConfirmButton: true
                          });
                          return of(editClientSuccess({ result: false }));
                        }
                        // se edita el usuario
                        return (userId !== null && userData !== null && actualCategory==1) ?
                        of(editUser({ userId: userId, userData: userData, category: actualCategory })) :
                        of(editClientSuccess({ data: null, category: actualCategory, result: false, isNew: isNew }));
                          //return of({ dataClient: null, userId: userId, userData: userData, category: actualCategory, result: false, isNew: isNew });
                    })
                )
            }),
            map(e => {
              if(e.type === EDIT_CLIENT_SUCCESS) this.store.dispatch(setLoading({ loading: false }))
              return e;
            })
        )
    });


    /** POLIGONOS */
    crearPoligono$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(addPoligono),
            exhaustMap((action)=>{
                let areaId = action.areaId;
                let form = action.form;
                let tipo = action.tipo;

                Swal.fire({
                    title: "Procesando...",
                    text: "Espere por favor",
                    imageUrl: "../../../assets/images/Loading_2.gif",
                    showConfirmButton: false,
                    allowOutsideClick: false
                });

                return this.editorService.postPoligono(areaId, form, tipo).pipe(
                    map((data)=>{
                        // Llamar a la funcion que formateo el response
                        var formatResponse = this.editorService.buildParcelas(data);

                        var data1 = {response: formatResponse, tipo: 1};

                        Swal.fire({
                            title: "Procesado!",
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500
                        });

                        return addPoligonoSuccess({data: data1});
                    }),catchError(error=>{
                        if ( error[0] ){

                            var data2;

                            if(typeof error[0] === 'object'){

                                var formateado = this.editorService.formatearErrores(error,3);

                                Swal.fire({
                                    icon: 'error',
                                    title: 'Errores en el/los fichero/s',
                                    showConfirmButton: false,
                                    timer: 1500
                                });

                                data2 = {response: formateado, tipo: 3};

                            }else{

                                var texto;

                                if(error[0].length==1){
                                    texto = 'Lo sentimos, algo ha fallado'
                                }else{
                                    texto = error;
                                }

                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error al enviar los datos',
                                    text: texto,
                                    showConfirmButton: true
                                });

                                data2 = {response: 'error', tipo: 2};
                            }

                            return of(addPoligonoSuccess({data: data2}));

                        }else{
                            var formateado = this.editorService.formatearErrores(error.error,1);

                            var data3 = {response: formateado, tipo: 3};

                            Swal.fire({
                                icon: 'error',
                                title: 'Errores en el/los fichero/s',
                                showConfirmButton: false,
                                timer: 1500
                            });

                            return of(addPoligonoSuccess({data: data3}));
                        }

                    })
                )
            }),
            map(e => {
              this.store.dispatch(setLoading({ loading: false }))
              return e;
            })
        )
    });

    sendPoligono$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(sendPoligono),
            exhaustMap((action)=>{
                let areaId = action.areaId;
                let datos = action.datos;
                let tipo = action.tipo;
                let idCliente = action.clientID;
                let bodyUpload = [];
                let bodyUpdate = [];
                let datosCopy = [];
                let correcto = false;
                let addCompare = action.addCompare;

                Swal.fire({
                    title: "Enviando...",
                    text: "Espere por favor",
                    imageUrl: "../../../assets/images/Loading_2.gif",
                    showConfirmButton: false,
                    allowOutsideClick: false
                });

                datos.map(function(dato){
                    const objCopy = { ...dato };
                    if (tipo!=3 && dato.zafra==null) {
                        objCopy.zafra = 0;
                    }
                    if (dato.alta_freq==null){
                        objCopy.alta_freq = false;
                    }
                    datosCopy.push(objCopy);

                    return dato;
                });

                for (let i = 0; i < datosCopy.length; i++) {
                    switch (addCompare) {
                        case 'añadir':
                            if(datosCopy[i].status==1){
                                bodyUpdate.push(datosCopy[i]);
                            }else if(datosCopy[i].status==2 || datosCopy[i].status==null || datosCopy[i].status==undefined){
                                bodyUpload.push(datosCopy[i]);
                            }
                            break;
                        case 'sustituir area completa':
                            if(datosCopy[i].status==0 || datosCopy[i].status==1 || datosCopy[i].status==3){
                                bodyUpdate.push(datosCopy[i]);
                            }else if(datosCopy[i].status==2){
                                bodyUpload.push(datosCopy[i]);
                            }
                            break;
                        case 'sustituir shape':
                            if(datosCopy[i].status==0 || datosCopy[i].status==1){
                                bodyUpdate.push(datosCopy[i]);
                            }else if(datosCopy[i].status==2){
                                bodyUpload.push(datosCopy[i]);
                            }
                            break;
                    }
                }

                var petitions = [];

                if(bodyUpdate.length>0){
                    petitions.push(this.editorService.sendPoligono(areaId, JSON.stringify(bodyUpdate), 2));
                }

                if (bodyUpload.length>0) {
                    petitions.push(this.editorService.sendPoligono(areaId, JSON.stringify(bodyUpload), 1));
                }

                return forkJoin(petitions).pipe(

                    map((data) => {
                        if(data[0]['type']!='FeatureCollection'){
                            this.store.dispatch(loadClientAreas({clientId:idCliente}));
                        }

                        var body = {atributo:["id"],activo:true,limit:3,filtro:""};

                        this.store.dispatch(uniquesLimited({areaId:areaId,datos:JSON.stringify(body)}));

                        var check2 = false;

                        if(data[0]['parcelas no actualizadas']){
                            for (let i = 0; i < data[0]['parcelas no actualizadas'].length; i++) {
                                if(data[0]['parcelas no actualizadas'][i].error){
                                    check2 = true;
                                }
                            }
                        }

                        if (check2==true) {
                            correcto = true;

                            var formateado = this.editorService.formatearErrores(data[0]['parcelas no actualizadas'],2);

                            var data4 = {response: formateado, tipo: 3};

                            Swal.fire({
                                icon: 'error',
                                title: 'Errores en el/los fichero/s',
                                showConfirmButton: false,
                                timer: 1500
                            });

                            return addPoligonoSuccess({data: data4});
                        }else{

                            Swal.fire({
                                title: "Enviado!",
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 1500
                            });

                            return sendPoligonoSuccess({data: data});
                        }
                    }), catchError(error=>{
                        var check = false;

                        for (let i = 0; i < error.length; i++) {
                            if(error[i].errors){
                                check = true;
                            }
                        }

                        if(check==true){

                            var formateado = this.editorService.formatearErrores(error,2);

                            var data3 = {response: formateado, tipo: 3};

                            Swal.fire({
                                icon: 'error',
                                title: 'Errores en el/los fichero/s',
                                showConfirmButton: false,
                                timer: 1500
                            });

                            return of(addPoligonoSuccess({data: data3}));
                        }else{

                            Swal.fire({
                                icon: 'error',
                                title: 'Error al enviar los datos',
                                text: error.substring(0, 300),
                                showConfirmButton: true
                            });

                            return of(sendPoligonoSuccess({data: error}));
                        }
                    })
                );

            }),
            map(e => {
              this.store.dispatch(setLoading({ loading: false }))
              return e;
            })
        )
    });

    uniquesLimited$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(uniquesLimited),
            exhaustMap((action)=>{
                let areaId = action.areaId;
                let datos = action.datos;

                return this.editorService.uniqueslimited(areaId, datos).pipe(
                    map((data)=>{

                        return uniquesLimitedSuccess({data: data});

                    }),catchError(error=>{
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se han podido cargar las parcelas del área',
                            showConfirmButton: true
                        });

                        return of(uniquesLimitedSuccess({data: error}));

                    })
                )
            }),
            map(e => {
              this.store.dispatch(setLoading({ loading: false }))
              return e;
            })
        )
    });

    uniques$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(uniques),
            exhaustMap((action)=>{
                let areaId = action.areaId;
                let datos = action.datos;

                return this.editorService.uniques(areaId, datos).pipe(
                    map((data)=>{

                        return uniquesSuccess({data: data});

                    }),catchError(error=>{
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se han podido cargar las parcelas del área',
                            showConfirmButton: true
                        });

                        return of(uniquesSuccess({data: error}));

                    })
                )
            }),
            map(e => {
              this.store.dispatch(setLoading({ loading: false }))
              return e;
            })
        )
    });

    finishArea$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(finishArea),
            exhaustMap((action)=>{
                let areaId = action.areaId;
                let clienteId = action.clienteId;

                Swal.fire({
                    title: "Terminando...",
                    text: "Espere por favor",
                    imageUrl: "../../../assets/images/Loading_2.gif",
                    showConfirmButton: false,
                    allowOutsideClick: false
                });

                return this.editorService.finishArea(areaId).pipe(
                    map((data)=>{

                        this.store.dispatch(loadClientAreas({clientId:clienteId}));

                        Swal.fire({
                            title: "Terminado!",
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500
                        });

                        return finishAreaSuccess({data: data});

                    }),catchError(error=>{
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se ha podido finalizar el area',
                            showConfirmButton: true
                        });

                        return of(finishAreaSuccess({data: error}));

                    })
                )
            }),
            map(e => {
              this.store.dispatch(setLoading({ loading: false }))
              return e;
            })
        )
    });

    loadDataSpecificClient$ = createEffect(()=>{
      return this.actions$.pipe(
          ofType(loadDataSpecificClient),
          exhaustMap((action)=>{
            const { user, category, client, isNew, correo } = action;
            return this.adminService.getUserDetail(user).pipe(
              map((dataUser) => {
                if(dataUser) {
                  const id = (dataUser['fk_cliente']) ? dataUser['fk_cliente']['id'] : dataUser['id'];
                  // obtener super user token
                  // lo inicializamos a null
                  this.store.dispatch(loadSuperuserTokenSuccess({ token: null }));
                  // cargamos el token del superuser creado
                  this.store.dispatch(loadSuperusers({ id: id }));

                  let dataUserTransform = columnsTable['editar'].reduce((act, element) => {
                    // si es un elemento en general
                    if(Object.keys(dataUser).includes(element)) return { ...act, [element]: dataUser[element]};
                    else {
                      // busca a qué objeto hace referencia el valor (contacto, cliente)
                      const elementInside = Object.keys(dataUser)
                      .filter(key => typeof dataUser[key] === 'object')
                      .find(key => dataUser[key] && dataUser[key][element] !== undefined && dataUser[key][element] !== null);
                      return (elementInside) ? { ...act, [element]: dataUser[elementInside][element] } : { ...act, [element]: null };
                    }
                  }, {});
                  // añade a los datos el id del cliente, usuario y la categoría en la que se añade
                  dataUserTransform = { ...dataUserTransform, userId: dataUser['id'], id: id, category: category };
                  // se añaden los elementos que no se han añadido en el registro
                  Object.keys(client).forEach(element => dataUserTransform[element] = client[element]);
                  // guardar otros datos como fechas o la categoría correcta
                  this.store.dispatch(editClient({clientId: id, clientData: { ...client, category: category }, isNew: isNew }));
                  this.store.dispatch(saveClientData({ cliente: dataUserTransform }));
                  // mensaje de confirmación del proceso
                  Swal.fire({
                    icon: 'success',
                    title: '¡Cliente registrado!',
                    text: `Ya puedes editar sus áreas, productos, herramientas y polígonos.`
                  });
                }
                return changeLoginWaiting({status: false});
              }),
              catchError((error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Cliente registrado pero error al obtener los datos'
                })
                return of(changeLoginWaiting({status: false}));
              })
            )
          }),
          map(e => {
            this.store.dispatch(setLoading({ loading: false }))
            return e;
          })
      )
    });

    saveNewUser$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(saveNewUser),
        exhaustMap((action) => {
          const { user, category, client } = action;
          return this.editorService.registerUser({ ...user, category: category }).pipe(
            map((data) => {
              // debo hacer login para guardar el token para editar el resto
              this.store.dispatch(setTitle({ title: `Editor de ${(category==2) ? 'Demo' : 'Cliente'}` }));
              this.store.dispatch(loginStart({ user: user.user, password: user.password, saveTokenSuperUser: true }));
              this.store.dispatch(loadDataSpecificClient({ user: user.user, category: category, client: client, correo: user.email, isNew: true }));
              return editClientSuccess({ isNew: true });
            }),
            catchError((error) => {
              Swal.fire({
                icon: 'error',
                title: 'Cliente no registrado'
              });
              return of(changeLoginWaiting({status: false}));
            })
          )
        }),
        map(e => {
          this.store.dispatch(setLoading({ loading: false }))
          return e;
        })
      )
    });

    editArea$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(editArea),
            exhaustMap((action) => {
                const { id, data, idCliente } = action;
                return this.editorService.editArea(id, JSON.stringify(data)).pipe(
                map((result) => {
                    // volver a cargar las áreas del cliente
                    this.store.dispatch(loadClientAreas({ clientId: idCliente }));
                    return editAreaSuccess({ result: true });
                }),
                catchError((error) => {
                    return of(editAreaSuccess({ result: false }));
                })
                )
            }),
            map(e => {
              this.store.dispatch(setLoading({ loading: false }))
              return e;
            })
        )
    });


    /** CURVAS */
    curvasOptimas$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(curvasOptimas),
            withLatestFrom(
                this.store.select(getCurvasFilter),
                this.store.select(getCurvasBorrar)
                ),
            switchMap((action) => {
                const { url, tipo, body, area } = action[0];
                let curvasBorrar = action[2]
                let bodyVariedades = `{"atributo":"variedad","activo":true}`;

                return this.editorService.getCurvasOptimasPage({ url: url }, body).pipe(
                    map((data) => {
                        if(tipo==1){
                            this.store.dispatch(uniques({areaId: area.id, datos: bodyVariedades}));
                            this.store.dispatch(loadAreaProducts({area: area,tipo: 'asignar'}));
                        }

                        //Rellenar el checked
                        if(data.datos){
                            data.datos.forEach(element => {
                              element.checked = curvasBorrar.some(curvaSelected=>curvaSelected.id==element.id)
                            });
                        }
                        return curvasOptimasSuccess({ curvas: data, tipo: tipo });
                    }), catchError(error=>{
                        Swal.fire({
                            icon: 'error',
                            title: 'Fallo al pedir las curvas óptimas'
                        });
                        this.store.dispatch(setCurveFilter({ filter: undefined }));
                        return of(curvasOptimasSuccess({ curvas: null, tipo: tipo }));
                    })
                );
            }),
            map(e => {
            //   this.store.dispatch(setLoading({ loading: false }))
              return e;
            })
        )
    });

    asignarCurvas$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(asignarCurvas),
            exhaustMap((action) => {
                const { area, productos, curvasSeleccionar } = action;

                let idsCurvas = this.editorService.formatBodyAsignarCurvas(curvasSeleccionar);

                this.store.dispatch(loadingCurves({active:true}));

                return this.editorService.postCurvasOptimas(area.id, idsCurvas).pipe(
                    map((data: Pagination) => {
                        this.store.dispatch(curvasOptimas({url:'/rest/curvasoptimaspage', tipo:1, body:`{"areas": [${area.id}],"product": ["agua","lai","clorofila","ndvi"]}`,area:area}));
                        this.store.dispatch(loadingCurves({active:false}));
                        return asignarCurvasSuccess({ data:data });
                    }), catchError(error=>{
                        Swal.fire({
                            icon: 'error',
                            title: 'Fallo al asignar las curvas'
                        });
                        this.store.dispatch(loadingCurves({active:false}));
                        return of(asignarCurvasSuccess({ data:error }));
                    })
                );
            }),
            map(e => {
            //   this.store.dispatch(setLoading({ loading: false }))
              return e;
            })
        )
    });

    borrarCurvas$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(borrarCurvas),
            withLatestFrom(
                this.store.select(getCurvasBorrar)
            ),
            exhaustMap((action) => {
                const { area, productos, borrar } = action[0];
                let curvasBorrar = action[1];

                this.store.dispatch(loadingCurves({active:true}));

                let body = this.editorService.formatBodyBorrarCurvas(borrar);

                return this.editorService.deleteCurvasOptimas(area.id, body).pipe(
                    map((data) => {
                        this.store.dispatch(curvasOptimas({url:action[0].curvas.current, tipo:1, body:JSON.stringify({areas: [area.id],product: productos, filtro:action[0].variedad ? {variedad__in:[action[0].variedad]} : {}}),area:area}));
                        this.store.dispatch(loadingCurves({active:false}));
                        this.store.dispatch(addBorrarCurvas({ curvas: curvasBorrar , add: false}));
                        return borrarCurvasSuccess({ data:data });
                    }), catchError(error=>{
                        Swal.fire({
                            icon: 'error',
                            title: 'Fallo al borrar las curvas'
                        });
                        this.store.dispatch(loadingCurves({active:false}));
                        return of(borrarCurvasSuccess({ data:error }));
                    })
                );
            }),
            map(e => {
            //   this.store.dispatch(setLoading({ loading: false }))
              return e;
            })
        )
    });

    expireClient$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(expireClient),
            exhaustMap((action)=>{
                let clientId = action.client.id
                if(clientId){
                    return this.editorService.expireClient(clientId).pipe(
                        map((data)=>{
                            Swal.fire({
                                icon: 'success',
                                title: 'Baja correcta',
                                text: 'Se ha dado de baja el cliente, sus áreas y sus polígonos correctamente.',
                                showConfirmButton: true
                            });
                            return noData()

                        }),catchError(error=>{
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'No se ha podido dar de baja el cliente.',
                                showConfirmButton: true
                            });
                            return of(noData())
                        })
                    )
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se ha podido dar de baja el cliente.',
                        showConfirmButton: true
                    });
                    return of(noData())
                }
            }),
            map(e => {
              this.store.dispatch(setLoading({ loading: false }))
              return e;
            })
        )
    });
}
