import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { loadDashboardClientes, loadDashboardSuperficie, resetDashboardState } from './state/dashboard.actions';
import { getDashboardClientes, getDashboardSuperficies } from './state/dashboard.selector';
import { indicador, grafica } from '../../../interfaces/dashboard.interface';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  url = 'http://localhost:3000/api/upload/evidencia/hola.txt';
  public totalregistros=98;
  public posicionactual=0;
  public registrosporpagina=25;
 
  private ngUnsubscribe: Subject<any> = new Subject();

  cambiarPagina( pagina:number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
  }

  indicadores:Array<indicador> = [];

  data;
  datos;

  hectareas_por_cultivo: grafica;
  cultivos: Array<string> = [];
  superficies: Array<number> = [];

  ejemplo: grafica = {
    titulo: "Ejemplo",
    tipo: 2,
    sets: [{ label: 'Mobiles', data: [1000, 1200, 1050, 2000, 500] },
           { label: 'Laptop', data: [200, 100, 400, 50, 90] },
           { label: 'AC', data: [500, 400, 350, 450, 650] },
           { label: 'Headset', data: [1200, 1500, 1020, 1600, 900] }],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
  }

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
