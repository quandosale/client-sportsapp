import { AccData, AFSet } from './../../../../services/AccData';
import {
  Component, OnInit, AfterViewInit,
  Input, ElementRef, OnDestroy
} from '@angular/core';
import { DataService } from '../../../../services/index';

declare let $: any;
declare let jQuery: any;
@Component({
  selector: 'accelerometer-chart',
  templateUrl: './accelerometer-chart.component.html',
  styleUrls: ['./accelerometer-chart.component.css'],
})

export class AccelerometerChartComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() heightzoom = false;
  @Input() dataSetId: String;
  @Input() dataSetTime: String;

  scope = 0;

  // for mouse hover time
  timelinePosition: number = -1;
  timelineOffset: number = 0;
  selectTime: number = 0;

  height = 0;
  isBusy = false;
  isChrome = false;

  // Plot relative variable
  plot: any;
  plotObject: any;

  plotDataSet: any;
  plotPosInWorld: number = 0;
  pointCountInPlot: number = 0;
  plotViewPointSet: AccData[] = [];
  plotSize = 1000;  // this is point count of plot

  // flag for mouse drag of seekbar
  seekbarCaptured: boolean = false;
  isDragged: boolean = false;

  // seekbar variable
  seekbarPosition: number = 0;
  seekbarWidth: number = 1000;

  // stream variable
  streamOffset: number = 0;
  requestStreamSize: number = 3000;
  AccDataSize: number = 0;
  receivedStreamSize: number = 0;

  queue: AccData[] = [];
  queueSize = 6000;
  AFQueue: AFSet[] = [];
  AFsInView: any = [];

  // flag of now playing
  isPlaying: boolean = false;

  zoom = 1;
  speed = 2; // normal 2;
  bZoomTransform: boolean = false;
  bSeekbarChanged: boolean = false;

  //
  seekbar: any = null;
  seekAutoMove = false;

  //
  timeBegin = 0;
  timeNow: string = '00:00:00';
  timeTotal: string = '00:00:00';
  // data not enough flag
  isNotEnough = false;
  constructor(private dataService: DataService, public elNode: ElementRef) { }

  ngOnInit() {
    this.getTotalDataSize();
  }

  viewInit() {

    this.zoom = 1;
    this.speed = 2;
    this.plot = $(this.elNode.nativeElement).find('#accelerometerGraph').empty();
    this.height = this.plot.height();
    let yRange = 15000;
    let boundary: any = [];
    boundary.push([0, -yRange]);
    boundary.push([1000, -yRange]);
    boundary.push([1000, yRange]);
    boundary.push([0, yRange]);
    boundary.push([0, -yRange]);

    let bgColor = $('#accelerometerGraph').css('background-color');
    this.plotDataSet = [{ color: bgColor, data: boundary }];

    this.plotObject = $.plot(this.plot, this.plotDataSet, this.getOption());

    this.seekbar = $(this.elNode.nativeElement).find('#seekbar');

    this.seekbar.slider({
      range: 'min',
      orientation: 'horizontal',
      animation: true,
      min: 0,
      max: 1000,
      value: 0,
      slide: (event, ui) => { this.seekbarCaptured = true; },
      stop: (event, ui) => { this.seekbarClick(ui.value); }
    });
    // load after viewinit
    this.bZoomTransform = true;
    this.update();
  }


  // load after view init
  ngAfterViewInit(): void {
    this.viewInit();
  }

  ngOnDestroy() {
  }

  getOption(): any {
    let result = {
      series: {
        lines: { show: true },
        shadowSize: 0,	// Drawing is faster without shadows
      },
      xaxis:
      {
        show: false
      },
      yaxis: {
        min: 0,
        max: 10000,
        datamin: 0,
        datamax: 10000,
        labelWidth: 33,
        autoscaleMargin: 0,
      },
      legend: {
        backgroundOpacity: 0
      },
      grid: {
        hoverable: false,
        clickable: true,
        timelinePosition: this.timelinePosition,
        timelineOffset: this.timelineOffset,
        selectTime: this.plotPosInWorld,
        timeScale: this.zoom,
        combine: true,
        timeline: true,
        timelinewidth: this.plotSize,
        AFsInView: this.AFsInView
      },
    };
    return result;
  }

  update() {
    if (!this.isPlotFull()) {
      this.isBusy = true;
      if (this.isNotEnough) { this.isBusy = false; }
      this.PlotDataLoad();
    } else {
      this.isBusy = false;
      if (this.plotPosInWorld < (this.AccDataSize - this.plotSize * this.zoom) && this.queue.length >= this.speed * this.zoom) {

        this.bZoomTransform = false;
        this.bSeekbarChanged = false;
        this.scope = this.plotSize * this.zoom;

        let chartData = this.getChartData();
        this.plotDataSet = [
          { label: 'ecg', color: '#008000', data: chartData.e },
          { label: 'x', color: '#800000', data: chartData.x },
          { label: 'y', color: '#9000ff', data: chartData.y },
          { label: 'z', color: '#0000ff', data: chartData.z }];

        this.plotPosInWorld += this.speed * this.zoom;
        this.reArrangeAFData();
        $.plot(this.plot, this.plotDataSet, this.getOption());


        if (!this.seekbarCaptured) {
          let percent: number = this.plotPosInWorld / (this.AccDataSize - this.plotSize * this.zoom);
          this.setSeekbar(percent);
          this.setCurrentTime(this.plotPosInWorld);
        }
      }
    }

    if (this.isPlaying || this.bZoomTransform || this.bSeekbarChanged) {
      setTimeout(() => { this.update(); }, 30); // tick is 30 millisecond
    }
  }

  isPlotFull(): boolean {
    return this.pointCountInPlot >= this.plotSize;
  }
  setViewEmpty(): void {
    this.pointCountInPlot = 0;
    this.plotViewPointSet = [];
  }
  PlotDataLoad(): void {
    if (this.zoom === 0) { return; }
    let count = 0;
    count = this.queue.length / this.zoom;
    count = Math.floor(count);
    count = Math.min(count, this.plotSize);
    if (count === 0) { return; }
    for (let i = 0; i < count; i++) {
      this.pointCountInPlot++;
      this.plotViewPointSet.push(this.deQueue(this.zoom));
    }
  }
  getChartData() {
    this.plotViewPointSet = this.plotViewPointSet.slice(this.speed);
    for (let i = 0; i < this.speed; i++) {
      this.plotViewPointSet.push(this.deQueue(this.zoom));
    }

    let resultE: any = [];
    let resultX: any = [];
    let resultY: any = [];
    let resultZ: any = [];

    for (let i = 0; i < this.plotViewPointSet.length; ++i) {
      let e: number = this.plotViewPointSet[i].e;
      let x: number = this.plotViewPointSet[i].x;
      let y: number = this.plotViewPointSet[i].y;
      let z: number = this.plotViewPointSet[i].z;

      resultE.push([i, e]);
      resultX.push([i, x]);
      resultY.push([i, y]);
      resultZ.push([i, z]);

    }
    let result = { e: resultE, x: resultX, y: resultY, z: resultZ };

    return result;
  }

  onResize(vl: any) {
  }

  onEcgResize(vl: any): void {
    let w = this.plot.width();
    let h = this.plot.height();
    if (w === 0 || h === 0) { return; }
    $.plot(this.plot, this.plotDataSet, this.getOption());
  }

  toggleHeightZoom(e: any) {
    if (!this.heightzoom) {
      this.plot.height(this.height * 2);
    } else {
      this.plot.height(this.height);
    }
    $.plot(this.plot, this.plotDataSet, this.getOption());
    this.heightzoom = !this.heightzoom;
  }

  setSeekbar(percent: number) {

    if (percent < 0 || percent > 1) { }
    percent = Math.max(0, percent);
    percent = Math.min(1, percent);
    let value = percent * this.seekbarWidth;
    this.seekbarPosition = Math.round(value);
    if (this.seekbarPosition === this.seekbarWidth) { this.stop(); }
    if (this.seekbar) {
      value = Math.min(1000, value);
      value = Math.max(0, value);
      this.seekbar.slider('value', value);

    }

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

  setCurrentTime(v: number) {
    let ms = this.AccDataSize * 2; // to millisecond
    this.timeTotal = this.msToTime(ms);
    let curMs = this.plotPosInWorld * 2;
    this.timeNow = this.msToTime(curMs);

  }

  // seekbar callback
  seekbarClick(value: any): void {

    // convert to percent
    let percent = value / this.seekbarWidth;
    this.setSeekbar(percent);
    // init
    this.queue = [];
    this.AFQueue = [];

    percent = Math.max(0, percent);
    percent = Math.min(1, percent);
    let position: number = percent * (this.AccDataSize - this.plotSize * this.zoom);
    // round the value
    position = Math.round(position);
    this.plotPosInWorld = position;
    this.streamOffset = position;

    this.receivedStreamSize = position;
    this.sendStreamRequest();
    this.seekbarCaptured = false;
    this.setViewEmpty();

    this.bSeekbarChanged = true;
    this.update();
  }

  getTotalDataSize() {
    console.log('dataset', this.dataSetId);
    this.dataService.getStream(this.dataSetId, 1, 0, 1)
      .then(res => {
        if (res.success) {
          console.log('getTotalDataSize ');
          this.AccDataSize = res.data.totalSample;
          let dateTime = new Date(this.dataSetTime);
          this.timeBegin = dateTime.getTime();
          if (this.AccDataSize > 1000) {
            this.sendStreamRequest();
          } else { this.isNotEnough = true; console.log('no enough'); }
        } else {
          console.log('gettotal fail', res);
          this.isNotEnough = true;
        }
      })
      .catch(() => { }
      );
  }
  processAFStreamData(stream: any) {
    let elementLength = stream.data.AFs.length;
    if (elementLength === 0) { return; }

    let AFset = new AFSet(stream.data.AFs[0].start, stream.data.AFs[0].end);
    if (this.AFQueue.length !== 0) {
      if (AFset.start !== this.AFQueue[this.AFQueue.length - 1].start) { this.AFQueue.push(AFset); }
    } else { this.AFQueue.push(AFset); }

    for (let i = 1; i < elementLength; i++) {
      this.AFQueue.push(new AFSet(stream.data.AFs[i].start, stream.data.AFs[i].end));
    }

  }
  intersect(x1: number, y1: number, x2: number, y2: number): any {
    let x: number = Math.max(x1, x2);
    let y: number = Math.min(y1, y2);
    if (y <= x) { return null; }
    x -= x1;
    y -= x1;
    x /= this.zoom;
    y /= this.zoom;
    return { start: x, end: y };
  }

  reArrangeAFData(): void {
    if (this.AFQueue.length > 0) {
      if (this.plotPosInWorld > this.AFQueue[0].end) { this.AFQueue.slice(1); }
    }
    this.AFsInView = [];
    let endPosInWorld = this.plotPosInWorld + this.zoom * this.plotSize;
    for (let i = 0; i < this.AFQueue.length; i++) {
      let rst = this.intersect(this.plotPosInWorld, endPosInWorld, this.AFQueue[i].start, this.AFQueue[i].end);
      if (rst != null) {
        this.AFsInView.push(rst);
      }
    }
  }
  processStreamData(stream: any) {
    if (stream.success) {
      console.log('processStreamData ');
      if (stream.data.position === this.streamOffset) {
        if (stream.data.AFs !== null) { this.processAFStreamData(stream); }
        let resLength;
        let prevX = 0, prevY = 0, prevZ = 0;
        if (stream.data == null) { console.log('stream data is wrong'); }
        this.streamOffset += stream.data.length;


        if (stream.data.accel == null) {
          resLength = stream.data.length * 3;
        } else { resLength = stream.data.accel.length; }
        if (stream.data.ecg == null) {
          console.log('stream data ecg  is null');
        }
        for (let i = 0; i < resLength / 3; i = i + 1) {
          let e = stream.data.ecg[i];


          let x = 0;
          let y = 0;
          let z = 0;

          if (stream.data.accel != null) {
            x = stream.data.accel[3 * i];
            y = stream.data.accel[3 * i + 1];
            z = stream.data.accel[3 * i + 2];
          }

          let rangeMin = -20000;
          let rangeMax = 20000;

          if (x < rangeMin || x > rangeMax) {
            x = prevX;
          }
          if (y < rangeMin || y > rangeMax) {
            y = prevY;
          }
          if (z < rangeMin || z > rangeMax) {
            z = prevZ;
          }
          prevX = x;
          prevY = y;
          prevZ = z;

          x = this.accTransform(x);
          y = this.accTransform(y);
          z = this.accTransform(z);

          e = this.ecgTransform(e);

          // this.enQueue(new AccData(Math.abs(x % 5000), Math.abs(y % 5000), Math.abs(z % 5000)));
          this.enQueue(new AccData(e, x, y, z));
        }
      }
      this.sendStreamRequest();
    } else {
      this.sendStreamRequest();
    }
  }

  accTransform(v: number): number {
    return 5000 / 40000 * (v + 20000);
  }

  ecgTransform(v: number): number {
    let e = v + 5000;
    e = Math.max(5020, e);
    return e;
  }

  sendStreamRequest(): void {
    if (this.receivedStreamSize >= this.AccDataSize) {
    } else if (this.queue.length < this.queueSize) {
      this.dataService.getStream(this.dataSetId, 1, this.streamOffset, this.requestStreamSize)
        .then(res => {
          this.processStreamData(res);
        })
        .catch(() => { }
        );
    } else {
      setTimeout(() => { this.sendStreamRequest(); }, 500);
    }
  }

  enQueue(v: AccData): void {
    this.queue.push(v);
    this.receivedStreamSize++;
  }

  deQueue(count: number): AccData {
    if (count === 0 || this.queue.length < count) {
      let res: AccData = new AccData(-1, -1, -1, -1);
      return res;
    }

    let derivationE: number[] = [];
    let derivationX: number[] = [];
    let derivationY: number[] = [];
    let derivationZ: number[] = [];

    for (let i = 0; i < count; i++) {
      if (i === 0) {
        derivationE[i] = this.queue[i + 1].e - this.queue[i].e;

        derivationX[i] = this.queue[i + 1].x - this.queue[i].x;
        derivationY[i] = this.queue[i + 1].y - this.queue[i].y;
        derivationZ[i] = this.queue[i + 1].z - this.queue[i].z;
      } else if (i === count - 1) {
        if (this.queue.length > count) {
          derivationE[i] = this.queue[i + 1].e - 2 * this.queue[i].e + this.queue[i - 1].e;

          derivationX[i] = this.queue[i + 1].x - 2 * this.queue[i].x + this.queue[i - 1].x;
          derivationY[i] = this.queue[i + 1].y - 2 * this.queue[i].y + this.queue[i - 1].y;
          derivationZ[i] = this.queue[i + 1].z - 2 * this.queue[i].z + this.queue[i - 1].z;
        } else {
          derivationE[i] = -this.queue[i].e + this.queue[i - 1].e;

          derivationX[i] = -this.queue[i].x + this.queue[i - 1].x;
          derivationY[i] = -this.queue[i].y + this.queue[i - 1].y;
          derivationZ[i] = -this.queue[i].z + this.queue[i - 1].z;

        }
      } else {
        derivationE[i] = this.queue[i + 1].e - 2 * this.queue[i].e + this.queue[i - 1].e;

        derivationX[i] = this.queue[i + 1].x - 2 * this.queue[i].x + this.queue[i - 1].x;
        derivationY[i] = this.queue[i + 1].y - 2 * this.queue[i].y + this.queue[i - 1].y;
        derivationZ[i] = this.queue[i + 1].z - 2 * this.queue[i].z + this.queue[i - 1].z;
      }
      derivationE[i] = Math.abs(derivationE[i]);
      derivationX[i] = Math.abs(derivationX[i]);
      derivationY[i] = Math.abs(derivationY[i]);
      derivationZ[i] = Math.abs(derivationZ[i]);
    }
    let peakIndexE = 0;
    let peakValE = derivationE[0];

    let peakIndexX = 0;
    let peakValX = derivationX[0];

    let peakIndexY = 0;
    let peakValY = derivationY[0];

    let peakIndexZ = 0;
    let peakValZ = derivationZ[0];

    for (let i = 1; i < count; i++) {
      if (derivationE[i] > peakValE) {
        peakValE = derivationE[i];
        peakIndexE = i;
      }
    }
    for (let i = 1; i < count; i++) {
      if (derivationX[i] > peakValX) {
        peakValX = derivationX[i];
        peakIndexX = i;
      }
    }

    for (let i = 1; i < count; i++) {
      if (derivationY[i] > peakValY) {
        peakValY = derivationY[i];
        peakIndexY = i;
      }
    }
    for (let i = 1; i < count; i++) {
      if (derivationZ[i] > peakValZ) {
        peakValZ = derivationZ[i];
        peakIndexZ = i;
      }
    }

    let rstE = this.queue[peakIndexE].e;
    let rstX = this.queue[peakIndexX].x;
    let rstY = this.queue[peakIndexY].y;
    let rstZ = this.queue[peakIndexZ].z;

    this.queue = this.queue.slice(count);

    return new AccData(rstE, rstX, rstY, rstZ);
  }

  isEmptyQueue(): boolean {
    return (this.queue.length === 0);
  }

  play(): void {
    this.isPlaying = true;
    this.update();
  }

  stop(): void {
    this.isPlaying = false;
  }

  zoomin(): void {
    let preStatus = this.zoom;
    this.zoom /= 3;
    this.zoom = Math.max(1, this.zoom);

    if (preStatus === this.zoom) { return; }

    this.zoomProcess();
  }

  zoomProcess(): void {
    this.seekbarClick(this.seekbarPosition);
    this.bZoomTransform = true;
    this.update();
  }

  zoomout(): void {
    let preStatus = this.zoom;
    this.zoom *= 3;
    this.zoom = Math.min(9, this.zoom);

    if (preStatus === this.zoom) { return; }

    this.zoomProcess();
  }

  speedUp(): void {
    this.speed *= 2;
    this.speed = Math.min(8, this.speed);
  }

  speedDown(): void {
    this.speed /= 2;
    this.speed = Math.max(1, this.speed);
  }

  onMouseClick(event: any) {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  }

}
