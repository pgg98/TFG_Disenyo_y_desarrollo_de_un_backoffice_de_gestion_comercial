import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-indicadores',
  templateUrl: './indicadores.component.html',
  styleUrls: ['./indicadores.component.scss']
})
export class IndicadoresComponent implements OnInit {

  @Input() indicadores = [];

  constructor() { }

  ngOnInit(): void {
  }

}
