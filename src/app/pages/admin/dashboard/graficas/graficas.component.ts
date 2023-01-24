import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.scss']
})

export class GraficasComponent implements OnInit {

  @Input() graficas = [];

  constructor() { }

  ngOnInit(): void {
  }

}
