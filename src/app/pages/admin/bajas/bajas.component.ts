import { Component, OnInit } from '@angular/core';
import { categories } from 'src/app/commons/enums/categories';
import { TableTemplate } from 'src/app/commons/table/table-template';

@Component({
  selector: 'app-bajas',
  templateUrl: './bajas.component.html',
  styleUrls: ['./bajas.component.scss']
})
export class BajasComponent extends TableTemplate implements OnInit {
  category: number = categories.BAJAS;
}
