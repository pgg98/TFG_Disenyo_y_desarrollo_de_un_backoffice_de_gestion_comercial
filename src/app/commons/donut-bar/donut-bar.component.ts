import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartDataset, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-donut-bar',
  templateUrl: './donut-bar.component.html',
  styles: []
})
export class DonutBarComponent implements OnInit {

  //Atributos
  public barChartType = 'doughnut';
  public barChartLegend = true;

  //Inputs
  @Input() donutData = [];
  @Input() donutLabels = [];

  salesData: ChartData<'bar'>;

  chartOptions: ChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
  };

  constructor() {}

  ngOnInit(): void {
    this.salesData = {
      labels: this.donutLabels,
      datasets: [
        { label: this.donutData[0].label, data: this.donutData[0].data },
      ],
    };
  }

}
