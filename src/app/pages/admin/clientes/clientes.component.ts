import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { categories } from 'src/app/commons/enums/categories';
import { TableTemplate } from 'src/app/commons/table/table-template';
import { AppState } from 'src/app/store/app.state';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent extends TableTemplate implements OnInit {
  category: number = categories.CLIENTES;
  warningTitle = 'Menos de dos meses para fin';
  dangerTitle = 'Clientes expirados'
  danger(element): boolean {
    if(!element) return false;
    if(!element['fin_plataforma']) return false;

    let fin = new Date(element['fin_plataforma']);
    let ahora = new Date(Date.now());
    // CLIENTES EXPIRADOS
    return ahora > fin;
  }

  warning(element): boolean {
    if(!element) return false;
    if(!element['fin_plataforma']) return false;

    let fin = new Date(element['fin_plataforma']);
    let ahora = new Date(Date.now());
    let expired = ahora > fin;
    ahora.setMonth(ahora.getMonth() + 2);
    // QUEDAN MENOS DE DOS MESES PARA FIN DE PLATAFORMA
    return ahora > fin && !expired;
  }
}
