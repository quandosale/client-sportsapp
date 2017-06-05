import { Component, Input, OnChanges, OnInit } from '@angular/core';

import { ChartComponent } from 'angular2-highcharts';

@Component({
  selector: 'ecg-thumbnail',
  templateUrl: './ecg-thumbnail.component.html',
  styleUrls: ['./ecg-thumbnail.component.css']
})
export class ECGThumbnail implements OnChanges, OnInit {
  @Input() ecg: Number[];

  options: any;
  chart: ChartComponent = null;

  ngOnInit() {
    // console.log(this.options.series[0].data);
    this.options.series[0].data = this.ecg;
  };

  ngOnChanges(changes: any) {
    if (this.chart) {
      this.chart.series[0].setData(changes.ecg.currentValue);
    }
  }
  saveInstance(chart) {
    this.chart = chart;
    // console.log(this.chart);
  }
  constructor() {
    this.options = {
      title: { text: null },
      chart: {
        type: 'spline',
        height: 200,
        backgroundColor: 'transparent',
        margin: [0, 0, 0, 0]
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: false
          },

          states: { hover: { enabled: false } },
        }
      },
      credits: {
        enabled: false
      },
      series: [{
        data: [3, 5]
      }],
      legend: {
        enabled: false
      },
      tooltip: {
        enabled: false
      },
      xAxis: {
        title: {
          text: null
        },
        lineWidth: 0,
        minorGridLineWidth: 0,
        lineColor: 'transparent',
        labels: {
          enabled: false
        },
        minorTickLength: 0,
        tickLength: 0
      },
      yAxis: {
        title: {
          text: null
        },
        lineWidth: 0,
        gridLineWidth: 0,
        minorGridLineWidth: 0,
        lineColor: 'transparent',
        labels: {
          enabled: false
        },
        minorTickLength: 0,
        tickLength: 0
      }
    };
  }
}
