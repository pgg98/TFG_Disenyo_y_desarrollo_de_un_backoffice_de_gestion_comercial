import { Component, OnInit, ViewChild } from '@angular/core';
import { EditorComponent } from 'src/app/commons/editor/editor.component';
import { cliente } from 'src/app/interfaces/cliente.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { columnsTable } from 'src/app/commons/constants/columnsTable';
import { categories } from 'src/app/commons/enums/categories';
import { TableTemplate } from 'src/app/commons/table/table-template';
import { Pagination } from 'src/app/interfaces/Pagination.interface';
import { AppState } from 'src/app/store/app.state';
import Swal from 'sweetalert2';
import { getDataByUrl, loadData } from '../state/admin.actions';
import { getData } from '../state/admin.selector';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
// export class LeadsComponent implements OnInit {

//   clientePrueba:cliente;

//   // editor:EditorComponent = new EditorComponent();

//   constructor(private router: Router) { }

//   ngOnInit(): void {
//     // CLIENTE DE PRUEBA
//     this.clientePrueba = {
//       correo: "clientePrueba@gmail.com",
//       telefono: "666666666",
//       nombre: "Paco",
//       apellidos: "García López",
//       pais: "España",
//       cultivo: "Arroz",
//       hectareas: 6000,
//       empresa: "Arroces García",
//       verificado: true,
//       contactado: false,
//       fecha_registro: new Date("July 4 2022 12:30"),
//       fecha_vencimiento: new Date("July 5 2022 12:30"),
//       fin_actualizacion: new Date("July 6 2022 12:30"),
//       alta_frec: new Date("July 7 2022 12:30"),
//       hectareas_de_planet: 2000,
//       pagado: false,
//       tipo_de_pago: "stripe",
//     }
//   }

//   editar(): void {
//     this.router.navigateByUrl('/admin/leads/lead?type=1');
//   }
// }

export class LeadsComponent extends TableTemplate implements OnInit {
  category: number = categories.LEADS;
}
