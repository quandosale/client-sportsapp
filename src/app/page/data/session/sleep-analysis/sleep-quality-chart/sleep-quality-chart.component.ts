import { Component, ElementRef, AfterViewInit } from '@angular/core';

declare let $: any;
declare let JQuery: any;

@Component({
  selector: 'sleep-quality-chart',
  templateUrl: 'sleep-quality-chart.component.html',
  styleUrls: ['./sleep-quality-chart.component.css']
})
export class SleepQualityChartComponent implements AfterViewInit {
  plot: any;
  plotDataSet: any;

  constructor(
    public elNode: ElementRef, ) {
  }
  ngAfterViewInit() {
    this.viewInit();
  }
  viewInit() {

    this.plot = $(this.elNode.nativeElement).find('#sleep-quality').empty();

    let df1 = [[0, 50], [1, 40], [2, 80], [3, 80], [4, 70]];
    let df2 = [[0, 45], [1, 38], [2, 70], [3, 60], [4, 65]];
    let df4 = [[0, 30], [1, 35], [2, 50], [3, 75], [4, 50]];
    // let df3 = [[0, 10], [1, 20], [2, 50], [3, 60], [4, 30]];
    this.plotDataSet = [
      // { label: 'Pies', color: 'green', data: df1, spider: { show: true, fill: false } }
      { color: 'gray', data: df1, spider: { show: true, lineWidth: 1, fill: false } }
      , { color: '#FC943B', data: df2, lineWidth: 1, spider: { show: true, lineWidth: 1, fill: false } }
      // , { color: '#5193C1', data: df3, spider: { show: true, lineWidth: 1, fill: false } }
      , { color: '#5193C1', data: df4, spider: { show: true, lineWidth: 1, fill: false } }
    ];
    $.plot(this.plot, this.plotDataSet, this.getOption());
    this.update();
  }

  getOption() {
    let result = {
      series: {
        spider: {
          active: true
          , highlight: { mode: 'line' }
          , legs: {
            font: '12px Times New Roman',
            data: [{ label: 'Total Sleep Time' }, { label: 'HRV Recovery' },
            { label: 'Breathing' }, { label: 'Sleep Onset' }, { label: 'Deep Sleep' }]
            , legScaleMax: 1
            , legScaleMin: 0.8
            , legStartAngle: -90
          }
          , spiderSize: 0.6,// graph size
          lineWidth: 10,
          pointSize: 1,
          connection: {
            width: 2
          }
        }
      }
      , grid: { hoverable: true, clickable: true, tickColor: 'rgba(0,0,0,0.2)', mode: 'spider' }
    };
    return result;
  }

  update() {

  }
}
