import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment} from '../../environments/environment'
import { grafica, indicador } from '../interfaces/dashboard.interface';
import { AppState } from '../store/app.state';
import { Observable, Subject } from 'rxjs';
import { categories } from '../commons/enums/categories';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor( private http: HttpClient, private store: Store<AppState>) { }

  public httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private ngUnsubscribe: Subject<any> = new Subject();

  /**
   * Función para darle formato a una gráfica
   * @param data
   * @returns
   */
  formateandoGraficas(data):grafica[]{
    var array:grafica[] = [];
    var devolver:grafica;
    var cultivos: Array<string> = [];
    var superficies: Array<number> = [];

    for (let index = 0; index < data.length; index++) {
      if(data[index].cultivo != null){
        cultivos.push(data[index].cultivo);
      }else{
        cultivos.push('null');
      }

      superficies.push(data[index].superficie);
    }

    devolver = {
      titulo: "Hectáreas por cultivo",
      tipo: 1,
      sets: [{ label: 'Datos', data: superficies }],
      labels: cultivos
    }

    array.push(devolver);

    return array;
  }

  /**
   * Función para crear el indicador de hectareas totales
   * @param data
   * @returns
   */
  hectareasTotales(data):indicador[]{
    var array:indicador[] = [];
    var hectareasTotales:indicador;
    var total = 0;

    for (let index = 0; index < data.length; index++) {
      total = total + data[index].superficie;
    }

    hectareasTotales = {
      titulo: "Hectáreas totales",
      numero: total
    }

    array.push(hectareasTotales);

    return array;
  }

  /**
   * Función para crear los indicadores principales
   * @param data
   * @returns
   */
  filtrarClientes(data):indicador[]{
    var indicadores:indicador[] = [];
    var leads:number = 0;
    var demos:number = 0;
    var clientes:number = 0;
    var bajas:number = 0;
    var numCaducados:number = 0;
    var clientes_caducos:indicador;
    var leads_totales:indicador;
    var demos_totales:indicador;
    var clientes_totales:indicador;
    var bajas_totales:indicador;
    var actual = new Date();

    // Map para clientes que caducan de aquí a un mes
    data.map(function(x){
      var d = new Date();
      var c = new Date(d.setMonth(d.getMonth()+1));
      if(x.fin_plataforma != null){
        if (new Date(x.fin_plataforma) > actual && new Date(x.fin_plataforma) < c) {
          numCaducados++;
        }
      }
    });

    // Map para Leads
    data.map(function(x){
      if (x.category == 1) {
        leads++;
      }
    });

    // Map para Demos
    data.map(function(x){
      if (x.category == 2) {
        demos++;
      }
    });

    // Map para Clientes
    data.map(function(x){
      if (x.category == 3) {
        clientes++;
      }
    });

    // Map para Bajas
    data.map(function(x){
      if (x.category == 4) {
        bajas++;
      }
    });

    //Indicadores
    clientes_caducos = {
      titulo: "Clientes caducos",
      numero: numCaducados
    }

    leads_totales = {
      titulo: "Leads totales",
      numero: leads
    }

    demos_totales = {
      titulo: "Demos totales",
      numero: demos
    }

    clientes_totales = {
      titulo: "Clientes totales",
      numero: clientes
    }

    bajas_totales = {
      titulo: "Bajas totales",
      numero: bajas
    }

    indicadores = [clientes_caducos,leads_totales,demos_totales,clientes_totales,bajas_totales];

    return indicadores;
  }

  getHectareasPorCultivo(){
    return this.http.get<JSON>(`${environment.databaseURL}/rest/superficie`,this.httpOptions);
  }

  /**
   * Función que comunica con la api y obtiene todos los clientes
   * @returns
   */
  getClientes(): Observable<Object[]> {
    return this.http.get<any>(`${environment.databaseURL}/rest/clientes`,this.httpOptions);
  }

  /**
   * Función que devuelve un array con clientes y demos
   * @param clientes array con todos los clientes
   * @returns
   */
   getClientsAndDemos(clientes: Object[]): Object[] {
    return clientes.filter(element => element['category'] === categories.CLIENTES ||
    element['category'] === categories.DEMOS);
  }
}
