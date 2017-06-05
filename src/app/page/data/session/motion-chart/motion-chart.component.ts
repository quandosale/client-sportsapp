import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit, ElementRef } from '@angular/core';
import { DataService, } from '../../../../services/index';
declare let $: any;
@Component({
  selector: 'motion-chart',
  templateUrl: './motion-chart.component.html',
  styleUrls: ['./motion-chart.component.css']
})

export class MotionChartComponent implements OnInit, AfterViewInit {

  @Input() dataSetId: String;
  @Input() dataSetTime: String;

  @Input() accSeekbar: number;
  @Input() scope: number;
  totalTime: number;

  @Output() hrClicked = new EventEmitter<number>();

  // flag For received from server

  isBusy = false;

  // max and rest Heart Rate
  maxHeartRate = 0;
  restHeartRate = 200;

  plot: any;
  plotDataSet: any;
  heartRateData: any;
  AFData: any;
  AFRangeData: any;


  timeBegin: number = 0;
  pointCounter: number = 0;
  timelinePosition = -1;

  constructor(private dataService: DataService, public elNode: ElementRef) { }

  ngOnInit() {
    this.getTotalDataSize();
  }

  ngAfterViewInit() {
    this.plot = $(this.elNode.nativeElement).find('#hrtgraph').empty();

    let boundaryColor = $('#hrtgraph').css('background-color');
    let boundary = [];
    boundary.push([0, 0]);
    boundary.push([1000, 0]);
    boundary.push([1000, 200]);
    boundary.push([0, 200]);
    boundary.push([0, 0]);

    this.plotDataSet = [{ color: boundaryColor, data: boundary }];
    $.plot(this.plot, this.plotDataSet, this.getOption());

    $(this.elNode.nativeElement)
      .on('plotclick', (event: any, pos: any, item: any) => {
        this.plotClick(pos.x.toFixed(2));
      });
    // $(this.elNode.nativeElement)
    //   .on('plothover', (event: any, pos: any, item: any) => {
    //     this.plotHover(pos.x.toFixed(2), pos.y.toFixed(2), item);
    //   });

    this.test();
  } // ngAfterViewInit
  test() {
    let gData = [];
    for (let i = 0; i <= 50; i++) {
      gData.push([i / 5, Math.random() * 15]);
    }
    this.plotDataSet = [
      { color: 'green', data: gData }
    ];
    $.plot(this.plot, this.plotDataSet, this.getOption());

  }
  plotHover(x: number, y: number, item: any) {
    if (item === null) {
      return;
    }
    // let __x = item.datapoint[0].toFixed(2),
    let __y = item.datapoint[1].toFixed(2);
    x = Math.max(0, x);
    x = Math.min(x, this.totalTime);

    let str = this.msToTime(x);
    let tooltip = $(this.elNode.nativeElement).find('#tooltip');
    tooltip.text(str);
    tooltip.css({
      top: 150 - __y / 2,
      left: x / this.totalTime * this.plot.width()
    });
    console.log(item);
    if (item) {
      tooltip.fadeIn(200);
      setTimeout(() => { tooltip.hide(); }, 2000);
    } else {

      tooltip.hide();
    }

  }
  onHrtResize(vl: any): void {
    $.plot(this.plot, this.plotDataSet, this.getOption());
  }
  getOption() {
    let stack = 0,
      bars = false,
      lines = true,
      steps = true;
    let result = {
      series: {
        stack: stack,
        points: {
          show: true,
          radius: 0,
          lineWidth: 1,
          fill: false,
          fillColor: '#00ff00',
          symbol: 'triangle'
        },
        lines: {
          show: lines,
          fill: true,
          lineWidth: 0.1,
          fillColor: {
            colors: ["#EF9200", "#31BB12", "#0027F2"],
          },
          steps: steps

        },

        bars: {
          show: bars,
          barWidth: 0.6,
          align: 'center',
          lineWidth: 1,
          // fill: 1,
          // horizontal: true,
          // fillColor: { color: [{ opacity: 0.5 }, { opacity: 1 }] },
          // fillColor: '#0f0f4f',
        }
      },
      xaxis: {
        min: 0,
        max: 10
      },
      yaxis: {
        min: 0,
        max: 15,
        // ticks: [[0, 'Deep_Sleep'], [10, 'Shallow_Sleep'], [20, 'REM'], [30, 'Awake']],
        labelWidth: 100,
        // tickFormatter: this.yFormatter
      },
      grid: {
        show: false
      }
    };
    return result;
  }
  getOption2() {
    let result = {
      xaxis:
      {
        mode: 'time',
        minTickSize: [1, 'minute'],
        timeformat: '%H:%M',
        min: 0,
        tickColor: '#B8E5FB',
        max: this.totalTime
      },
      yaxis: {
        min: 0,
        max: 200,
        datamin: 0,
        datamax: 200,
        tickColor: '#B8E5FB',
        autoscaleMargin: 0,
        labelWidth: 20
      },
      series: {
        shadowSize: 0,
      },
      legend: {
        backgroundOpacity: 0
      },
      splines: { show: true, tension: 0.3, lineWidth: 2, fill: .0 },
      grid: {
        hoverable: true,
        clickable: true,
        timelinePosition: this.timelinePosition
      },
    };
    return result;
  }

  update() {
    let ecgSeek = [];
    let x = this.totalTime * (this.accSeekbar) / 1000;
    x = x * (this.totalTime - this.scope) / this.totalTime;
    // x = x + this.timeBegin;
    let deltaX = Math.max(this.scope, 2000);
    ecgSeek.push([x, 0]);
    ecgSeek.push([x + deltaX, 0]);
    ecgSeek.push([x + deltaX, 200]);
    ecgSeek.push([x, 200]);
    ecgSeek.push([x, 0]);

    this.plotDataSet = [
      { color: '#EB550C', label: 'HeartRate', data: this.heartRateData },
      {
        color: '#9AF11D', data: ecgSeek,
        lines: {
          lineWidth: 0.0, show: true, fill: true,
          fillColor: {
            colors: [{ opacity: 0.5 }, { opacity: 0.5 }]
          }
        }
      },
      {
        label: 'AF',
        color: 'blue',
        data: this.AFData,
        points: {
          show: true,
          radius: 1,
          lineWidth: 1, // in pixels
          fill: true,
          fillColor: '#ffffff',
          symbol: 'circle' // or callback
          // symbol: 'af' // or callback
        },
        lines: {
          // show: true
        },
      }
    ];

    $.plot(this.plot, this.plotDataSet, this.getOption());
    setTimeout(() => { this.update(); }, 10);
  }

  getTotalDataSize() {
    this.dataService.getStream(this.dataSetId, 1, 0, 1)
      .then(res => {
        if (res.success) {

          this.totalTime = res.data.totalSample * 2;
          if (this.totalTime > 2000) {
            this.getHeartRate();
          } else {
            console.log('no enough');
          }
        } else { }
      })
      .catch(() => {
        // console.log('getTotalDataSize catch request damage');
      });
  }
  msToTime(x: any) {
    // let ms = x % 1000;
    x = x / 1000;
    x = Math.floor(x);
    let secs = x % 60;
    let secsStr = ('00' + secs).substr(-2);
    x = x / 60;
    x = Math.floor(x);
    let mins = x % 60;
    let minsStr = ('00' + mins).substr(-2);
    x = x / 60;
    x = Math.floor(x);
    let hours = x;
    let hoursStr = ('00' + hours).substr(-2);
    return hoursStr + ':' + minsStr + ':' + secsStr;
  }

  getHeartRate(): void {
    this.isBusy = true;
    let dateTime = new Date(this.dataSetTime);
    this.dataService.getHeartRate(this.dataSetId)
      .then(res => {

        if (res.success) {

          this.timeBegin = dateTime.getTime();
          this.pointCounter = 0;

          let data = res.data.data;
          this.heartRateData = [];
          let pointSum = 0;

          // calculate total sum , max heartrate , rest heartrate
          for (let i = 0; i < data.length; i++) {
            pointSum = pointSum + data[i][1] * 1000;
            if (this.maxHeartRate < data[i][0]) {
              this.maxHeartRate = data[i][0];
            }
            if (this.restHeartRate > data[i][0] && data[i][0] >= 40) {
              this.restHeartRate = data[i][0];
            }
          }

          // prepare for HeartRate Data (buffer)
          // let prevTime = 0;
          for (let i = 0; i < data.length; i++) {
            let time = this.pointCounter * this.totalTime / pointSum;
            time = Math.floor(time);
            this.heartRateData.push([time, data[i][0]]);
            this.pointCounter += data[i][1] * 1000;
          }
          let time = this.pointCounter * this.totalTime / pointSum;
          time = Math.floor(time);
          this.heartRateData.push([time, data[data.length - 1][0]]);
          this.update();
          this.isBusy = false;
        } else {
          console.log('getHRate Fail');
          this.test();
        }
        this.getAF();
      })
      .catch((e) => {
        // console.log('getHeartRate catch request damage', e);
      });
    this.isBusy = false;
  }
  getAF(): void {
    this.isBusy = true;
    // let dateTime = new Date(this.dataSetTime);
    this.dataService.getAF(this.dataSetId)
      .then(res => {

        if (res.success) {

          this.pointCounter = 0;

          let data = res.data.AFs;
          if (data != null) {
            this.AFData = [];
            for (let i = 0; i < data.length; i++) {
              let index = data[i].start * 2;
              this.AFData.push([index, this.getHeartRateByIndex(index)]);
            }
            this.update();
            this.isBusy = false;
          }

        } else {
          console.log('getHRate Fail');
        }
      })
      .catch((e) => {
        // console.log('getHeartRate catch request damage', e);
      });
    this.isBusy = false;
  }
  getHeartRateByIndex(index: number): number {
    if (this.heartRateData == null) { return 0; }
    for (let i = 1; i < this.heartRateData.length; i++) {
      if (this.heartRateData[i][0] > index) {
        let prev = this.heartRateData[i - 1][0];
        let cur = this.heartRateData[i][0];
        let width = cur - prev;
        let prevHr = this.heartRateData[i - 1][1];
        let curHr = this.heartRateData[i][1];
        width = Math.max(1, width);
        let hrPerX = (curHr - prevHr) / width;
        let hr = (index - prev) * hrPerX + prevHr;
        return hr;
      }
    }
    return 0;
  }
  onMouseMove(event: any) {
    let pos = event.clientX - this.plot.offset().left - this.getOption().yaxis.labelWidth - 5;
    this.timelinePosition = pos;
    $.plot(this.plot, this.plotDataSet, this.getOption());
  }
  onMouseLeave(event: any) {
    this.timelinePosition = -1;
    $.plot(this.plot, this.plotDataSet, this.getOption());
  }
  plotClick(value: number) {
    if (this.totalTime !== 0) {
      let v = (value) * 1000 / this.totalTime;
      v = Math.round(v);
      this.hrClicked.emit(v);
    }
  }
}
