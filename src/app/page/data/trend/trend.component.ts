import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { CONFIG } from '../../../common/config';
import { DataService } from '../../../services/index';

declare let $: any;
@Component({
  selector: 'page_trend',
  templateUrl: './trend.component.html',
  styleUrls: ['./trend.component.css'],

})

export class TrendComponent implements OnInit, AfterViewInit {

  seriesOptions: any = [];
  options: Object;
  datefrom: any = '';
  dateto: any = '';
  mainPlot: String = 'BP';
  subPlot: String = 'BP';
  selectedDate: Date;
  day: String;
  selectedCalendarType: string = 'All';
  selectedPatient: any = {};
  src: string = CONFIG.SERVER_URL + '/assets/gravatar/default.jpg';
  uploadData: any = {};
  plot: any;
  option: any;
  onNoData: Boolean = false;

  constructor(
    private dataService: DataService,
    public elNode: ElementRef
  ) {
    this.option = {
      series: {
        lines: { show: false },
        shadowSize: 0,	// Drawing is faster without shadows
        splines: { show: true, tension: 0.3, lineWidth: 2, fill: .0 },
        points: { show: true }
      },
      grid: {
        hoverable: true
      },
      xaxis: {
        show: true,
        mode: 'time',
      },
      yaxis: {
        show: true,
        min: 0,
        max: 200,
        autoscaleMargin: 0,
      },
    };
  }

  ngOnInit(): void {
  }
  ngAfterViewInit() {

    let option = {
      series: {
        lines: { show: false },
        shadowSize: 0,	// Drawing is faster without shadows
        splines: { show: true, tension: 0.3, lineWidth: 2, fill: .0 },
        points: { show: true }
      },
      grid: {
        hoverable: true
      },
      xaxis: {
        show: true,
        mode: 'time',
        ticks: []
      },
      yaxis: {
        show: true,
        min: 0,
        max: 200,
        autoscaleMargin: 0,
      },

    };
    this.plot = $(this.elNode.nativeElement).find('#trend').empty();
    $.plot(this.plot, this.seriesOptions, option);
  }
  //////////     getDate     //////////


  dayClicked(date: Date): void {

    this.selectedDate = date;
    // let DAY = ['Monday', 'Tuesday ', 'Wednesday ', 'Thursday ', 'Friday ', 'Saturday ', 'Sunday '];
    let MONTH = ['January', 'February ', 'March ', 'April ', 'May ', 'June ', 'July ',
      'August ', 'September ', 'October ', 'November ', 'December '];
    this.day = '  ' + MONTH[this.selectedDate.getMonth()] + '  ' + this.selectedDate.getDate().toString();
    this.getData();
  }

  //////////     day||week||month     //////////

  onCalendarTypeSelected(value: string): void {
    this.selectedCalendarType = value;
    this.getData();
  }

  //////////     datefrom and dateto     //////////

  setDateRange() {
    if (this.selectedDate == null) { this.selectedDate = new Date(); }
    if (this.selectedCalendarType === 'day') {
      this.datefrom = this.selectedDate.setHours(0, 0, 0, 0);
      this.dateto = this.selectedDate.setHours(23, 59, 59, 999);
    }
    if (this.selectedCalendarType === 'month') {
      let date = this.selectedDate;
      this.datefrom = new Date(date.getFullYear(), date.getMonth(), 1);
      this.dateto = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }
    if (this.selectedCalendarType === 'week') {
      let date = this.selectedDate; // get current date
      let first = date.getDate() - date.getDay(); // First day is the day of the month - the day of the week
      let last = first + 6; // last day is the first day + 6
      this.datefrom = new Date(date.setDate(first));
      this.dateto = new Date(date.setDate(last));
    }
    if (this.selectedCalendarType === 'all') {
      this.datefrom = '';
      this.dateto = '';
    }
  }


  //////////     selectedPatient     //////////

  onPatientSelected(value: any): void {
    this.selectedPatient = value;
    this.src = this.selectedPatient.photo;
    this.getData();
  }

  //////////     mainPlot     //////////


  onMainPlot(value: String): void {
    this.mainPlot = value;
    this.getData();
  }

  //////////     subPlot     //////////

  onSubPlot(value: String): void {
    this.subPlot = value;
    this.getData();
  }

  //////////     createChart     //////////
  createChart(): void {
    this.plot = $(this.elNode.nativeElement).find('#trend').empty();
    $.plot(this.plot, this.seriesOptions, this.option);
  }

  onPlotResize(vl: any): void {
    $.plot(this.plot, this.seriesOptions, this.option);
  }
  //////////     getData     //////////

  getData() {
    if (this.selectedPatient._id != null) {
      let patients: any = [];
      let data1: any = [];
      let data2: any = [];
      this.seriesOptions = [];
      let count = 0;
      let dataCount = 0;
      this.onNoData = false;
      this.setDateRange();
      patients.push(this.selectedPatient._id);
      this.dataService.getDatas(patients, this.datefrom, this.dateto, this.mainPlot.toLocaleUpperCase()).then((res: any) => {

        switch (this.mainPlot) {
          case 'Weight':
            res.data.forEach(element => {
              let date = new Date(element.datetime);
              data1.push([date, element.data.weight]);
              dataCount++;
            });
            data1.sort((a, b) => {
              return new Date(b[0]).getTime() - new Date(a[0]).getTime();
            });
            this.seriesOptions[count] = {
              label: ' Weight',
              color: '#008000',
              data: data1,
              animator: { start: 100, steps: 99, duration: 1000, direction: 'left' }
            };
            count++;
            break;
          case 'BP':
            res.data.forEach(element => {
              let date = new Date(element.datetime);
              data1.push([date, element.data.SYS]);
              data2.push([date, element.data.DIA]);
              dataCount++;
            });
            data1.sort((a, b) => {
              return new Date(b[0]).getTime() - new Date(a[0]).getTime();
            });
            data2.sort((a, b) => {
              return new Date(b[0]).getTime() - new Date(a[0]).getTime();
            });
            this.seriesOptions[count] = {
              label: 'SYS',
              color: '#8B0000',
              data: data1,
            };
            count++;
            this.seriesOptions[count] = {
              label: 'DIA',
              color: '#F77D0E',
              data: data2,
            };
            count++;
            break;
        }

        this.dataService.getDatas(patients, this.datefrom, this.dateto, this.subPlot.toLocaleUpperCase()).then((result: any) => {
          data1 = [];
          data2 = [];
          if (this.subPlot.toLocaleUpperCase() !== this.mainPlot.toLocaleUpperCase()) {
            switch (this.subPlot) {
              case 'Weight':
                result.data.forEach(element => {
                  let date = new Date(element.datetime);
                  data1.push([date, element.data.weight]);
                  dataCount++;
                });
                data1.sort((a, b) => {
                  return new Date(b[0]).getTime() - new Date(a[0]).getTime();
                });
                this.seriesOptions[count] = {
                  label: ' Weight',
                  color: '#008000',
                  data: data1,
                };
                count++;
                break;
              case 'BP':
                result.data.forEach(element => {
                  let date = new Date(element.datetime);
                  data1.push([date, element.data.SYS]);
                  data2.push([date, element.data.DIA]);
                  dataCount++;
                });
                data1.sort((a, b) => {
                  return new Date(b[0]).getTime() - new Date(a[0]).getTime();
                });
                data2.sort((a, b) => {
                  return new Date(b[0]).getTime() - new Date(a[0]).getTime();
                });
                this.seriesOptions[count] = {
                  label: 'SYS',
                  color: '#8B0000',
                  data: data1,
                };
                count++;
                this.seriesOptions[count] = {
                  label: 'DIA',
                  color: '#F77D0E',
                  data: data2,
                };
                count++;
                break;
            }
          }
          if (dataCount === 0) {
            this.onNoData = true;
          }
          this.createChart();
        });
      });
    }
  }

  upload() {
    let date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    for (let i = 1; i <= 2; i++) {
      date.setDate(i);

      let data = {
        datetime: date,
        type: 'ACTIVITY',
        patientId: this.selectedPatient._id,
        patientName: this.selectedPatient.firstname + ' ' + this.selectedPatient.lastname,
        value: {
          activity: 'Activity' + i,
          time: new Date(),
          duration: Math.round(Math.random() * 3600),
          point: Math.round(Math.random() * 600),
          calory: Math.round(Math.random() * 200),
          distance: Math.round(Math.random() * 7000)
        }
      };
      this.dataService.addData(data);
    }
  }

}
