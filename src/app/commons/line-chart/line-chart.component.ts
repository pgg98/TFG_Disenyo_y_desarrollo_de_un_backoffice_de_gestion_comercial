import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartDataset, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styles: []
})
export class LineChartComponent implements OnInit {

  //Atributos
  public barChartType = 'doughnut';
  public barChartLegend = true;

  //Inputs
  @Input() donutData = [];
  @Input() donutLabels = [];

  salesData: ChartData<'bar'>;

  chartOptions: ChartOptions = {
    // maintainAspectRatio: false,
    responsive: true,
  };


  constructor() {}

  ngOnInit(): void {
    this.salesData = {
      labels: this.donutLabels,
      datasets: [
        { label: this.donutData[0].label, data: this.donutData[0].data },
        { label: this.donutData[1].label, data: this.donutData[1].data },
        { label: this.donutData[2].label, data: this.donutData[2].data },
        { label: this.donutData[3].label, data: this.donutData[3].data },
      ],
    };
  }

}
