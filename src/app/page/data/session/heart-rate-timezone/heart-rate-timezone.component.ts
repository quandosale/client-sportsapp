import { Component, OnInit, Input, AfterViewInit, ElementRef } from '@angular/core';
import { DataService, } from '../../../../services/index';
declare var $: any;
@Component({
  selector: 'heart-rate-timezone',
  templateUrl: './heart-rate-timezone.component.html',
  styleUrls: ['./heart-rate-timezone.component.css']
})

export class HeartRateTimezoneComponent implements OnInit, AfterViewInit {

  @Input() dataSetId: String;
  @Input() dataSetTime: String;

  // flag For received from server
  isBusy = false;

  plot: any;

  plotColorSet = ['#00C0EF', '#00A65A', '#F39C12', '#881391'];
  plotDataSet: any = [
    { data: [[0, 0]], color: this.plotColorSet[0] },
    { data: [[0, 1]], color: this.plotColorSet[1] },
    { data: [[0, 2]], color: this.plotColorSet[2] },
    { data: [[0, 3]], color: this.plotColorSet[3] },
  ];
  max = 3;
  constructor(private dataService: DataService, public elNode: ElementRef) { }

  ngOnInit() {
    this.getHeartRateTimeZone();
  }

  ngAfterViewInit() {
    this.plot = $(this.elNode.nativeElement).find('#htimezoneGraph').empty();
    this.update();
  }
  getOption() {
    let yTicks = [
      [0, 'Rest'], [1, 'Fat Burn'], [2, 'Cardio'], [3, 'Peak'],
    ];
    let result: any = {
      series: {
        bars: {
          show: true,
          barWidth: 0.6,
          align: 'center',
          lineWidth: 1,
          fill: 1,
          horizontal: true,
          fillColor: { colors: [{ opacity: 0.1 }, { opacity: 1 }] },
        }
      },
      xaxis: {
        // axisLabel: 'Price (USD/oz)',
        axisLabelUseCanvas: true,
        axisLabelFontSizePixels: 12,
        axisLabelFontFamily: 'Verdana, Arial',
        axisLabelPadding: 10,
        tickColor: '#B8E5FB',
        max: this.max,
        tickFormatter: function (v, axis) {
          return v;
        },
        color: 'black'
      },
      yaxis: {
        tickColor: '#B8E5FB',
        ticks: yTicks,
        color: 'black',
        labelWidth: 53,
      },
      legend: {
        noColumns: 0,
        labelBoxBorderColor: '#858585',
        position: 'ne'
      },
      grid: {
        hoverable: true,
        borderWidth: 2,
        // backgroundColor: { colors: ['#171717', '#4F4F4F'] }
      }
    };
    return result;
  }
  onHrtTimezoneResize(vl: any): void {
    this.update();
  }

  update() {
    $.plot(this.plot, this.getChartData(), this.getOption());
  }

  getChartData() {

    return this.plotDataSet;
  }
  getMax(meta) {
    let result = Math.max(1.5, meta.rest);
    result = Math.max(result, meta.fat_burn);
    result = Math.max(result, meta.cardio);
    result = Math.max(result, meta.peak);
    result = Math.round(result * 1.2);
    return result;
  }

  getHeartRateTimeZone(): void {
    this.dataService.getHeartRate(this.dataSetId)
      .then(res => {
        if (res.success) {

          let meta = res.data.meta;
          this.max = this.getMax(meta);

          this.plotDataSet = [
            { data: [[meta.rest, 0]], color: this.plotColorSet[0] },
            { data: [[meta.fat_burn, 1]], color: this.plotColorSet[1] },
            { data: [[meta.cardio, 2]], color: this.plotColorSet[2] },
            { data: [[meta.peak, 3]], color: this.plotColorSet[3] },
          ];

          this.update();

        } else {
          // console.log('getHRateTimezone Fail');
        }
      })
      .catch((e) => {
        // console.log('getHeartRateTimezone catch request damage', e);
      });
  }
}
