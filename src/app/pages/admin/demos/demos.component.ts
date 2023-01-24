import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { categories } from 'src/app/commons/enums/categories';
import { TableTemplate } from 'src/app/commons/table/table-template';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-demos',
  templateUrl: './demos.component.html',
  styleUrls: ['./demos.component.scss']
})
export class DemosComponent extends TableTemplate implements OnInit {

  category: number = categories.DEMOS;

  dangerTitle = 'Fecha de vencimiento cumplida'

  danger(element): boolean {
    if(!element) return false;
    if(!element['fin_plataforma']) return false;
    let fin = new Date(element['fin_plataforma']);
    let ahora = new Date(Date.now());
    // SI LA FECHA DE VENCIMIENTO YA HA PASADO
    return ahora > fin;
  }
}
