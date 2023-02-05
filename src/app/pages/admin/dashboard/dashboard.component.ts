import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { loadDashboardClientes, loadDashboardSuperficie, resetDashboardState } from './state/dashboard.actions';
import { getDashboardClientes, getDashboardSuperficies } from './state/dashboard.selector';
import { indicador, grafica } from '../../../interfaces/dashboard.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  indicadores:Array<indicador> = [];

  data;
  datos;

  hectareas_por_cultivo: grafica;
  cultivos: Array<string> = [];
  superficies: Array<number> = [];

  clienteGET;

  public graficas;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.dispatch(loadDashboardSuperficie());
    this.store.select(getDashboardSuperficies).subscribe(value=>{
      if(value){
        this.graficas = value;
      }
    });

    this.store.dispatch(loadDashboardClientes());
    this.store.select(getDashboardClientes).subscribe(value=>{
      if(value){
        this.indicadores = value;
      }
    })

  }

  ngOnDestroy(){
    this.store.dispatch(resetDashboardState())
  }

}
