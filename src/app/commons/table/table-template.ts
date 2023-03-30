import { Component, Directive, Injectable, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { takeUntil } from 'rxjs/operators';
import { Subject } from "rxjs";
import { Pagination } from "src/app/interfaces/Pagination.interface";
import { editCategory, getDataByUrl, loadData, loadUsersClient, saveClientData, setFilter, setLoading, setShowUsers } from "src/app/pages/admin/state/admin.actions";
import { getData, getFilter, getShowUsers } from "src/app/pages/admin/state/admin.selector";
import { AppState } from "src/app/store/app.state";
import { setBreadcrums, setTitle } from "src/app/store/share/share.actions";
import { buttonsEachTabla } from "../constants/columnsTable";
import { getTitle } from "src/app/store/share/share.selector";
import { IsDatePipe } from "src/app/pipes/is-date.pipe";
import { TypeUserData } from "../enums/typeUserData";
import { loadSuperusers, loadSuperuserToken, loadSuperuserTokenSuccess } from "src/app/auth/state/auth.actions";
import { Usuario } from "src/app/models/usuario.model";
import { getSupersusers } from "src/app/auth/state/auth.selector";
import Swal from "sweetalert2";
import { categories } from "../enums/categories";
import { MatDialog } from "@angular/material/dialog";
import { TypeofColumns, TypesInColumns } from "../enums/typeofColumns.enum";
import { AdminService } from "src/app/services/admin.service";
import { CommonService } from "src/app/services/Common.service";
import { environment } from "src/environments/environment";

@Directive()
export class TableTemplate implements OnInit, OnDestroy {
  category: number = 1;
  title: string = '';
  data: Pagination;
  idCliente: number;
  actualPage: number = 1;
  showUsers: boolean = false;
  datos: Object[];
  warningFunction: Function;
  dangerFunction: Function;
  tipoInput: string = 'text';
  isDate: IsDatePipe = new IsDatePipe();
  actualFilter: Object;
  disabledFilter: boolean = false;
  titleWarning: string;
  titleDanger: string;
  superUsers: Usuario[];
  buttonsTable;
  prev_filtro: Object;
  orderby: string;

  public ngUnsubscribe: Subject<any> = new Subject();

  constructor(public store: Store<AppState>,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private adminService: AdminService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.warningFunction = this.warning;
    this.dangerFunction = this.danger;
    this.store.dispatch(setLoading({ loading: true }));
    this.store.dispatch(loadSuperuserTokenSuccess({token: null}));
    this.store.dispatch(loadSuperusers({}));
    //this.store.dispatch(setFilter({ filter: undefined }));
    this.store.select(getTitle)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      value => {
        this.title = value
      }
    );
    this.store.select(getFilter)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      value => {
        if(this.actualFilter && this.actualFilter['title'] !== this.title) this.store.dispatch(setFilter({ filter: undefined }));
        this.actualFilter = value
      }
    );
    this.store.select(getSupersusers)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      value => {
        this.superUsers = value;
      }
    );
    this.store.dispatch(setShowUsers({ showUsers: false }));
    this.store.dispatch(loadData({ category: this.category, body: (this.actualFilter && this.actualFilter['title'] === this.title) ? this.actualFilter : undefined }));
    this.store.select(getData)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      (value) => {
        if(value && value.datos) {
          // actualizar número de página
          let corte = 6;
          if(value.current.split('/').length != 9) corte = 3;
          let change = value.current.split('/').slice(corte);
          // son los datos de la categoría actual
          this.actualPage = parseInt(change[0]);

          this.datos = this.adminService.transformDatos(value.datos, this.title.toLocaleLowerCase(), this.showUsers, this.category);
          this.data = { ... value }

          if(this.data.objects < 10) this.data.limit = this.data.objects;
        } else {
          this.data = value;
          this.datos = undefined;
        }
      this.disabledFilter = !value || !value.datos || value.datos.length < 2;
    }
    );

    this.store.select(getShowUsers)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      value => {
        if(this.showUsers && !value) {
          this.reloadClients();
        }
        this.showUsers = value;
      }
    );

    /**
     * Obtener lista superusers
     */
    this.store.select(getSupersusers)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      value => {
        this.superUsers = value;
      }
    );
    // botones de la tabla
    this.buttonsTable = buttonsEachTabla[this.title.toLowerCase()];
  }

  /**
   * Función que recibe los datos del usuario seleccionado para editar
   * @param dato dato del usuario seleccionado para editar
   */
  editarDato(dato: Object) {
    const id = (dato['fk_cliente']) ? dato['fk_cliente']['id'] : dato['id'];

    // cargar token del superusuario a editar
    (!this.superUsers) ?
    this.store.dispatch(loadSuperusers({ id: id })) :
    this.store.dispatch(loadSuperuserToken({ id: id }));
    // seguridad de implementacion
    let cliente = this.adminService.transformDatos([dato], 'editar', this.showUsers, this.category)[0];

    cliente = {...cliente, userId: dato['id']};

    // Aquí va el dispatch para guardar en el state el cliente
    this.store.dispatch(saveClientData({cliente}));
    this.router.navigateByUrl('/admin/'+this.title.toLowerCase()+'/'+this.title.substring(0, this.title.length - 1).toLowerCase()+'?type='+cliente['category']);
  }

  newDato(): void {
    this.store.dispatch(saveClientData({ cliente: null }));
    this.router.navigateByUrl(`/admin/${this.title.toLowerCase()}/${this.title.substring(0, this.title.length - 1).toLowerCase()}?type=${this.category}&nuevo=true`);
  }

  /**
   * Función que prepara la llamada para cambiar la página
   * @param pag pagina a la que se navega
   */
  changePage(pag: number) {
    this.store.dispatch(setLoading({ loading: true }));
    let corte = 6;
    let url = this.data.current.split('/');
    // llamada usuarios o categoria
    if(url.length !== 9) corte = 3;
    // ['1', '10', 'user']
    let change = url.splice(corte);
    let actualPag = parseInt(change[0]);

    let body = {};
    if(this.actualFilter) body = this.actualFilter;
    if(this.title.toLowerCase().includes('usuario')) {
        body = (this.actualFilter) ? { filtro: { ...this.actualFilter["filtro"], fk_cliente: this.idCliente } } :
      { filtro: { fk_cliente: this.idCliente }};
    }
    change[0] = pag + '';
    this.store.dispatch(getDataByUrl({
      url: (pag === actualPag + 1) ? this.data.next :
      (pag === actualPag - 1) ? this.data.previous : url.concat(change).join('/'),
      body: body,
      category: (!this.showUsers && this.category !== categories.LEADS) ? this.category : undefined
    }));
  }

  /**
   * Función que muestra un diálogo con el usuario y la contraseña del superusuario seleccionado
   */
  showSuperUser(clientEmitted) {
    let superuser = (this.idCliente && this.superUsers) ? this.superUsers.find(element => element['fk_cliente']['id'] === this.idCliente) : undefined;
    if(!superuser && clientEmitted) {
      superuser = (this.superUsers) ? this.superUsers.find(element => element['fk_cliente']['id'] === clientEmitted['id']) : undefined;
    }
    superuser?.password && this.commonService.copyTextToClipboard(superuser.password);
    return (superuser) ?  Swal.fire({
      icon: 'info',
      title: 'Superuser',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Iniciar sesión en web',
      cancelButtonText: 'Cerrar',
      cancelButtonColor: '#f95959',
      html: `
      <div style="text-align: left;">
      <p><b>Usuario: </b>${superuser.user}</p>
      <b>Password: </b>${superuser.password}
      </div>
      <div class="alert alert-success mt-4">
        ¡Contraseña copiada en el portapapeles!
      </div>`
    }).then(value => {
      if(value.isConfirmed) {
        let { user, password } = superuser;
        let win = window.open(`${environment.ip_app}/login?user=` + user + '&autologin=false', '_blank');
      }
    })
    :
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No se pudo encontrar el superusuario'
    });
  }

  /**
   * Cambia el límite de la página
   * @param limit límite a cambiar
   */
  changeLimit(limit: number) {
    this.store.dispatch(setLoading({ loading: true }));
    let url = this.data.current.split('/');
    let corte = (url.length === 6) ? 3 : 6;
    let change = url.splice(corte);
    let actualPag = parseInt(change[0]);
    // obtiene primer elemento que se visualiza ahora en la tabla
    const firstObject = (actualPag - 1) * this.data.limit + 1;
    // calcula la página donde se visalizaría el primer elemento actual
    let newPage = Math.floor((firstObject - 1) / limit) + 1;
    change[0] = newPage + '';
    change[1] = limit + '';

    this.actualPage = newPage;
    // añadir filtro si hubiere
    let body = {};
    if(this.actualFilter) body = this.actualFilter;
    if(this.title.toLowerCase().includes('usuario')) {
      body = (this.actualFilter) ? { filtro: { ...this.actualFilter["filtro"], fk_cliente: this.idCliente } } :
        { filtro: { fk_cliente: this.idCliente }};
    }
    this.store.dispatch(getDataByUrl({
      url: url.concat(change).join('/'),
      body: body,
      category: (!this.showUsers && this.category !== categories.LEADS) ? this.category : undefined
    }))
  }

  /**
   * Método que cambia la vista a usuarios del cliente
   * @param user cliente del que se buscan los usuarios
   */
  showUsersClient(user: Object) {
    this.idCliente = user['id'];
    if(this.idCliente) {
      this.store.dispatch(setLoading({ loading: true }));
      (!this.superUsers) ?
      this.store.dispatch(loadSuperusers({ id: this.idCliente })) :
      this.store.dispatch(loadSuperuserToken({ id: this.idCliente }));
      // tiempo para cargar el token del superusuario
      setTimeout(() => {
        this.store.dispatch(setTitle({ title: 'Usuarios' }));
        this.prev_filtro = this.actualFilter;
        this.store.dispatch(setFilter({ filter: undefined }));
        this.buttonsTable = buttonsEachTabla['usuarios'];
        this.store.dispatch(setBreadcrums({ breadcrums: [{ titulo: this.route.data['_value']['titulo'], url: this.router.url }] }));
        this.store.dispatch(loadUsersClient({ idCliente: this.idCliente }));
        this.store.dispatch(setShowUsers({ showUsers: true }));
        this.warningFunction = undefined;
        this.dangerFunction = undefined;
      }, 500);
    }
  }

  /**
   * Recarga los clientes de la sección en la que nos encontramos
   */
  reloadClients() {
    this.store.dispatch(setLoading({ loading: true }));
    this.idCliente = undefined;
    this.store.dispatch(loadSuperuserTokenSuccess({token: undefined}));
    this.store.dispatch(setTitle({ title: this.route.data['_value']['titulo'] }));
    this.store.dispatch(setBreadcrums({ breadcrums: [] }));

    // buscar info con filtro anterior si lo hubiera
    this.store.dispatch(setFilter({ filter: (this.prev_filtro) ? this.prev_filtro : undefined }));
    this.store.dispatch(loadData({
      category: this.category,
      body: (this.prev_filtro) ? this.prev_filtro : undefined
    }));
    this.prev_filtro = undefined;

    this.buttonsTable = buttonsEachTabla[this.route.data['_value']['titulo'].toLowerCase()];
    this.warningFunction = this.warning;
    this.dangerFunction = this.danger;
  }

  /**
   * Función que determina si se muestra una fila con warning
   * @param element datos
   * @returns si cumple warning o no
   */
  warning(element): boolean {
    return false;
  }

  /**
   * Función que determina si se muestra una fila con danger
   * @param element datos
   * @returns si cumple danger o no
   */
  danger(element): boolean {
    return false;
  }

  /**
   * Función que busca en los datos el tipo de dato que es la clave
   * @param key campo a buscar
   */
  obtenerTipo(key: string) {
    if(this.datos && this.datos.length) {
      // buscamos el tipo de dato en los datos de la tabla
      let dato = this.datos.find(element => element[key] !== null);
    if(dato) {
      // obtememos el tipo de dato
        if(this.isDate.transform(dato[key])) this.tipoInput = 'date';
        else if(typeof dato[key] === 'number') this.tipoInput = 'number';
        else if(typeof dato[key] === 'boolean') this.tipoInput = 'radio';
        else this.tipoInput = 'text';
      } else {
        this.tipoInput = 'text';
      }
    } else {
      this.tipoInput = 'text';
    }
  }

  /**
   * Función que define el filtro que se acaba de editar
   * @param event
   */
  filtrar(event?: any[]) {
    if(!event) {
      this.store.dispatch(setLoading({ loading: true }));
      (this.showUsers) ?
      this.store.dispatch(loadUsersClient({ idCliente: this.idCliente, body: this.actualFilter })) :
      this.store.dispatch(loadData({ category: this.category, body: this.actualFilter, orderby: this.orderby }));
      return;
    }
    let [ key, value, newFilter ] = event, filter: Object;
    //Deivi filtrar fechas desde hoy hasta la fecha seleccionada
    var filterOperation = '__icontains'
    if(Number(TypeofColumns[key]) === TypesInColumns.DATE){
      filterOperation = '__range'
      value = [new Date().toISOString().split('T')[0],value]
      value.sort()
    }

    if(!newFilter) {
      // no se ha pasado el filtro, añadimos el nuevo parámetro
      let keyString: string = key || '', pre = '';
      if(!key) key = '';
      if(this.showUsers || this.category === categories.LEADS) {
        // estos filtros solo se aplican a leads o usuarios
        switch(TypeUserData[keyString.toUpperCase()]) {
          case 1: pre = 'fk_cliente__'; break;
          case 2: pre = 'fk_contacto__'; break;
        }
      }
        // existe filtro, copiamos su contenido y añadimos el nuevo
        filter = (this.actualFilter) ? { filtro: { ...this.actualFilter['filtro'], [pre + keyString + filterOperation]: value } } :
        { filtro: { [pre + keyString + filterOperation]: value } };
    } else filter = newFilter;

    filter['title'] = this.title;

    if(!Object.keys(filter['filtro']).length) filter = undefined;
    this.store.dispatch(setLoading({ loading: true }));
    (this.title.toLowerCase().includes('usuario')) ?
    this.store.dispatch(loadUsersClient({ idCliente: this.idCliente, body: filter })) :
    this.store.dispatch(loadData({ category: this.category, body: filter, orderby: this.orderby }));
  }

  /**
   * Función que prepara la peición para ordenar por columna de forma ascendente o descendente
   * @param column columna referenciada para realizar la ordenación
   */
  changeOrder(column: string) {
    let pre = '';
    let guion = (column.includes('-')) ?  '-' : '';
    let url = this.data.current.split('/');
    let corte = (url.length === 6) ? 3 : 6;
    let change = url.splice(corte);
    change[0] = '1';
    if(this.category === categories.LEADS || this.showUsers) {
      switch(TypeUserData[column.replace('-', '').toUpperCase()]) {
        case 1: pre = 'fk_cliente__'; break;
        case 2: pre = 'fk_contacto__'; break;
      }
    }
    change[2] = guion + pre + column.replace('-', '');
    this.orderby = change[2];
    let body;
    (this.idCliente) ?
    (this.actualFilter) ?
    // hay cliente y filtro
    body = { filtro: { ...this.actualFilter['filtro'], fk_cliente: this.idCliente } } :
    // hay cliente y no filtro
    body = { filtro: { fk_cliente: this.idCliente } } :
    body = (this.actualFilter) ? { filtro: { ...this.actualFilter['filtro'] } } : undefined;

    this.store.dispatch(setLoading({ loading: true }));
    this.store.dispatch(getDataByUrl({
      url: url.concat(change).join('/'),
      body: body,
      category: (!this.showUsers && this.category !== categories.LEADS) ? this.category : undefined
    }))
  }

  changeToDemo(object){
    let { object: client, category } = object;
    this.store.dispatch(editCategory({ client: client.fk_cliente.fk_cliente ? client.fk_cliente : client , category: category}));
  }

  /** DESTROY */
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
