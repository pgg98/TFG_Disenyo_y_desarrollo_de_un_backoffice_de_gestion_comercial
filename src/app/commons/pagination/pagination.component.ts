import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getLoading } from 'src/app/pages/admin/state/admin.selector';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() totalRegistros: number = 0;     // total de registros a paginar
  @Input() registroActual: number = 0;  // posicion actual dentro del total
  @Input() totalPages: number;
  @Input() registrosPorPagina: number;   // número de registros a mostrar por página
  @Input() texto: boolean = true;
  @Input() paginaActual: number;
  @Input() title: string;
  @Input('showLimit') showLimit: boolean = true;

  @Output() cambiarPagina:EventEmitter<number> = new EventEmitter();
  @Output() cambiarLimit:EventEmitter<number> = new EventEmitter();

  public ultimaPagina = 0;
  public prepost = 2; // numero de páginas previas+posteriores+1
  public listaPaginas: number[];
  public registroHasta = 0;    // Indicará el hasta en el mensaje Mostrado de X a Y de Z

  selectSelected: boolean = false;
  bottom: boolean = false;
  defaultLimits: number[] = [5, 10, 25, 50]
  limits: number[] = [];

  loading: boolean;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private store: Store<AppState>) { }

  calcularPaginas(){
    if (this.totalRegistros === 0) {
      this.paginaActual = 0;
      this.ultimaPagina = 0;
      this.listaPaginas = [];
      return;
    }
    // Definimos el registro hasta para mostrar en el mensaje
    this.registroHasta = ( this.registroActual + this.registrosPorPagina - 1 <= this.totalRegistros ?
                                      this.registroActual + this.registrosPorPagina - 1 :
                                      this.totalRegistros);

    // Si nos han pasado un registro actual mayor que el número total de registros ponemos como actual el máximo
    if (this.registroActual > this.totalRegistros) { this.registroActual = this.totalRegistros; }
    // Calculamos la página en la que está el registro actual
    // Calculamos el total de páginas
    this.ultimaPagina = Math.trunc((this.totalRegistros - 1) / this.registrosPorPagina) + 1;
    // Calculamos el desde - hasta de las páginas a generar
    const desde = (this.paginaActual - this.prepost > 0) ? this.paginaActual - this.prepost : 1;
    const hasta = ((this.paginaActual + this.prepost) < this.ultimaPagina) ? (this.paginaActual + this.prepost) : this.ultimaPagina;
    // Creamos un array con el número de páginas a mostrar desde-hasta
    if(hasta > desde && hasta !== Infinity && desde !== -Infinity) {
      this.listaPaginas = [...Array(hasta - desde + 1).keys()].map(a => a + desde);
    } else {
      this.listaPaginas = [1];
    }
    this.calcularLimits();
  }

  calcularLimits() {
    this.limits = this.defaultLimits.filter(element => element <= this.totalRegistros);
    if(this.limits.length !== 0 && this.limits.length < this.defaultLimits.length && !this.limits.includes(this.totalRegistros)) {
      //this.registrosPorPagina = this.totalRegistros;
      this.limits.push(this.totalRegistros);
      this.limits.sort((a, b) => { return a - b });
    }
  }

  ngOnChanges(): void {
    if(this.totalRegistros !== null || this.totalRegistros !== 0) this.calcularPaginas();
  }

  ngOnInit(): void {
    this.store.select(getLoading)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      value => {
        this.loading = value;
      }
    )
    this.clickListener();
  }

  /**
   * Función que se llama al cambiar el limite
   * @param event
   * @param element nuevi limite
   */
  changeSelectSelected(event, element?: number) {
    if(!event.target.classList.value.includes('select-disabled')) {
      const screenY = window.innerHeight;
      const pageY = event.pageY;
      // comprobar si se tiene que abrir hacia abajo o hacia arriba para que quepa en la pantalla
      this.bottom = (screenY - pageY) < 120;
      if(element) {
        this.registrosPorPagina = element;
        this.cambiarLimit.emit(element);
      };

      this.selectSelected = !this.selectSelected;
    }
    event.stopPropagation();
  }

  /**
   * Función que envía la nueva página
   * @param nueva NUEVA PÁGINA
   */
  cambiaPagina(nueva: number) {
    if(nueva > 0 && nueva <= this.totalPages && nueva !== this.paginaActual) {
      this.cambiarPagina.emit(nueva);
    }
  }

  /**
   * Función que escucha el click de toda la página para deseleccionar e select
   * en caso de que se haya seleccionado
   */
  clickListener() {
    const body = document.getElementById('main-wrapper');
    body.addEventListener('click', (event) => {
      if(this.selectSelected) this.selectSelected = false;
    })
  }

}
