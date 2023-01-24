import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppState } from 'src/app/store/app.state';
import Swal from 'sweetalert2';
import { checkProcessCurve, createTemporalProcess, deleteProcessCurves, deleteSingleOptimCurve, reprocessCurve, reprocessDbCurve } from '../state/generar-curvas.actions';
import { getProcessCurvesChecked } from '../state/generar-curvas.selector';
import { Process } from '../state/generar-curvas.state';
import { ColumnFiltersCurvesPipe } from 'src/app/pipes/columnFiltersCurves.pipe';
import { CurvesSelection } from 'src/app/interfaces/altas/curves.interface';
import { CurvasService } from 'src/app/services/curvas.service';
import { ProdcutsMaxValuesGraphic } from 'src/app/commons/enums/GenerarCurvas.enum';

@Component({
  selector: 'app-curvas',
  templateUrl: './curvas.component.html',
  styleUrls: ['./curvas.component.scss'],
  providers: [
    ColumnFiltersCurvesPipe
  ],
})
export class CurvasComponent implements OnInit {
  @Input() curva:any
  @Input() curveType:string
  @Input() idArea:number
  @Input() process:Process
  @Input() filtros:any
  @Input() compareState:boolean
  @Output() compare = new EventEmitter<any[]>();
  @Output() close = new EventEmitter<any[]>();

  hideCurveInfo:string[] = ['valores', 'corregir', 'compare', 'id']
  yAxisMax = null
  chart:any
  options = {
    plugins: {
      legend: {
          display: false,
      },
      tooltip: {
        callbacks: {
           title : () => null // or function () { return null; }
        }
      }
    },
    scales: {
      xAxis: {
        display: false
      },
      yAxis: {
        display: true,
        max: null
      }
    },
    tooltips: {
      callbacks: {
         title: function() {}
      }
    },
    backgroundColor: '#00FF00',
    borderColor: '#00FF00'
  }

  checked: boolean = false
  curvesChecked: any[] = [];
  curveAttributesKeys: Array<string> = [];
  curveAttributesValues: Array<any> = [];

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    public store: Store<AppState>,
    private columnFiltersCurve: ColumnFiltersCurvesPipe,
    private curvaService: CurvasService
  ) {

  }

  ngOnInit(): void {
    this.orderCurveAttributes();

    this.setYAxisMax()

    this.showCurve();

    this.store.select(getProcessCurvesChecked).
    pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(value => {
      this.checked = value.some((el: any) =>
        el == this.curva.id || (el.constructor.name === 'Object' && el.id == this.curva.id)
      );
      this.curvesChecked = value;
    })
  }

  setYAxisMax(){
    let max = ProdcutsMaxValuesGraphic[this.curva.producto] || 0;
    let max_valores = Math.max(...this.curva.valores);
    if(max_valores > max){
      max = max_valores
    }

    this.options.scales.yAxis.max = max
  }

  showCurve(){
    this.chart = {
      labels: Array(this.curva.valores.length).fill('a'),
      datasets: [{
        label: 'Curva',
        data: this.curva.valores,
        fill: false,
        pointRadius: 1.5,
        backgroundColor: '#00FF00',
        borderColor: '#00FF00',
        borderWidth: 1.5,
        pointBorderColor: '#00FF00',
        pointBackgroundColor: '#00FF00',
        pointStyle: 'circle',
        showLine: true,
        pointHoverBackgroundColor: '#00FF00',
        pointHoverBorderColor: '#00FF00',
        pointHoverBorderWidth: 2
      }]
    }
  }

  deleteCurvaBBDD(idCurva:any){
    Swal.fire({
      title: '¿Estás seguro de que quieres eliminar esta curva?',
      text: "Esta opción no se podrá revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        if(isNaN(Number(idCurva))){
          this.store.dispatch(deleteProcessCurves({area: this.idArea, process: this.process, ids: [this.curva.id], compare: false, filters: this.filtros}))
        }else{
          this.store.dispatch(deleteSingleOptimCurve({area: this.idArea, id: idCurva, filtros: this.filtros}))
        }
        this.close.emit(["eliminado"]);
      }
    })
  }

  comparar(){
    this.compare.emit([true,this.curva]);
  }

  reprocesar(){
    let listHTML = `<p>Los datos con los que se va a reprocesar son los siguientes: </p>`
    Object.keys(this.curva).forEach(attr => {
      !this.hideCurveInfo.includes(attr) && (listHTML += `
        <li style="text-align: left; margin-top: 0.3rem">
          <strong>${this.columnFiltersCurve.transform(this.curva[attr], attr, true)}</strong>:
          ${this.columnFiltersCurve.transform(this.curva[attr], attr, false)}
        </li>
      `)
    })

    Swal.fire({
      title: '¿Estás seguro de que quieres reprocesar esta curva?',
      html: listHTML,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        switch(this.curveType) {
          case CurvesSelection.TEMPORALES:
            this.store.dispatch(reprocessCurve({ curveId: this.curva.id, areaId: this.idArea }));
            break;
          case CurvesSelection.BBDD:
            this.store.dispatch(reprocessDbCurve({ areaId: this.idArea, curves: [this.curva] }))
            break;
        }
      }
    })

  }

  /**
   * Function to check or not a temporal process curve
   */
  checkCurve(){
    if(this.curveType === 'BBDD' || (this.curveType === 'Temporales' && !this.curva.compare)){
      this.store.dispatch(checkProcessCurve({id: [this.curva.id] }))
    }
  }

  /**
   * Function to order attributes of curves. If you want add any attribute, change this arrays.
   */
  orderCurveAttributes(){
    this.curveAttributesKeys = ["producto","variedad","soca","dds","rend","mes","riego","zona_eco"];
    this.curveAttributesValues = [this.curva.producto,this.curva.variedad,this.curva.soca,this.curva.dds,this.curva.rend,this.curva.mes,this.curva.riego,this.curva.zona_eco];
  }

  /** CLOSE */
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
