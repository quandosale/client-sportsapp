import { Component, OnInit } from '@angular/core';

import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ChartComponent } from 'angular2-highcharts';

import { PatientsService, UserService, DataService } from '../../../../services/index';
declare let $: any;
@Component({
  selector: 'sleep_session_view',
  templateUrl: './sleep-session.component.html',
  styleUrls: [
    './sleep-session.component.css'
  ],
  providers: [PatientsService, UserService, DataService],
})

export class SleepSessionComponent implements OnInit {

  sleepData: any;
  patientName: String = "";
  datetime: String = "";

  overviewOpt: any;
  detailOpt: any;
  chart: ChartComponent;
  startTime: String = "";
  endTime: String = "";
  totalDuration: any;

  constructor(private dataService: DataService, private route: ActivatedRoute, private _location: Location) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.getData(params);
    });
  }
  getData(params) {
    this.dataService.getData(params['datasetId']).then(res => {
      // this.patientName = res.data.patientName;
      this.sleepData = res.data.data.sleep;
      let date = new Date(res.data.datetime);
      this.datetime = date.toLocaleDateString('en-us', { month: 'long', day: 'numeric', year: 'numeric' });
      let deep = 0, moderate = 0, light = 0;

      let sleepDetails = this.sleepData.sleepDetails;
      this.totalDuration = new Date(this.sleepData.endTime).getTime() - new Date(this.sleepData.startTime).getTime();
      this.totalDuration = this.formatTime(this.totalDuration / 60000);
      this.startTime = new Date(this.sleepData.startTime).toLocaleTimeString('en-GB');
      this.endTime = new Date(this.sleepData.endTime).toLocaleTimeString('en-GB');
      console.log(this.sleepData.startTime, this.startTime, this.endTime, this.totalDuration);
      this.createChart();

      let offset = new Date().getTimezoneOffset();
      let localTime;
      localTime = new Date(sleepDetails[0].datetime);
      localTime.setMinutes(localTime.getMinutes() - offset);
      this.detailOpt.series.push({
        name: '',
        data: [localTime.getTime()],
        color: '#ffffff'
      });

      for (let i = 0; i < sleepDetails.length; i++) {


        localTime = new Date(sleepDetails[i].datetime);
        localTime.setMinutes(localTime.getMinutes() - offset);
        this.detailOpt.yAxis.tickPositions.push(localTime.getTime());

        let data: any;
        if (i + 1 === sleepDetails.length) {
          data = new Date(this.sleepData.endTime).getTime() - new Date(sleepDetails[i].datetime).getTime();
        } else {
          data = new Date(sleepDetails[i + 1].datetime).getTime() - new Date(sleepDetails[i].datetime).getTime();
        }

        let name: any, color: any;
        if (sleepDetails[i].value === 1) { name = 'Deep'; color = '#099DED'; deep += data / 60000; };
        if (sleepDetails[i].value === 2) { name = 'Moderate'; color = '#5dc26a'; moderate += data / 60000; };
        if (sleepDetails[i].value === 3) { name = 'Light'; color = '#f15c80'; light += data / 60000; };

        this.detailOpt.series.push({
          name: name,
          data: [data],
          color: color
        });
      }
      console.log('Sleep Overview', deep, moderate, light);
      this.overviewOpt.series = [
        {
          name: 'Deep',
          data: [{ y: deep, color: '#099DED' }, null, null]
        },
        {
          name: 'Moderate',
          data: [null, { y: moderate, color: '#5dc26a' }, null]
        },
        {
          name: 'Light',
          data: [null, null, { y: light, color: '#f15c80' }]
        }
      ];
      this.detailOpt.series.reverse();
      localTime = new Date(this.sleepData.endTime);
      localTime.setMinutes(localTime.getMinutes() - offset);
      this.detailOpt.yAxis.tickPositions.push(localTime.getTime());
    });
  }
  backClicked() {
    this._location.back();
  }
  saveInstance(chartInstance: any) {
    this.chart = chartInstance;
  }
  updateData(): void {
    this.chart.series[0].data[0].update(Math.random() * 300);
  }
  formatTime(d: any) {
    let duration: any;
    if (d < 60) {
      duration = Math.round(d) + 'm';
    } else {
      duration = Math.floor(d / 60) + 'h ' + Math.floor(d % 60) + 'm';
    }
    return duration;
  }
  createChart(): void {
    this.detailOpt = {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Sleep Details'
      },
      credits: {
        enabled: false
      },
      rangeSelector: {
        inputEnabled: true,
        enabled: false,
        selected: 3
      },
      navigator: {
        enabled: false
      },
      scrollbar: {
        enabled: false
      },
      xAxis: {
        tickPositions: [],
      },

      yAxis: {
        tickPositions: [],
        type: 'datetime',
        labels: {
          format: '{value:%H:%M}',
          align: 'center'
        },
        title: {
          style: {
            display: 'none'
          }
        },
        // tickPixelInterval: 1000,
        showLastLabel: true,
        endOnTick: true
      },
      plotOptions: {
        series: {
          showInLegend: false,
          stacking: 'normal',
          pointWidth: 2000,
          borderWidth: 0,
        }
      },
      tooltip: {
        shared: false,
        formatter: function () {
          // let tooltip: any,
          let duration: any;
          let d = this.y / 60000;
          if (d < 60) {
            duration = Math.round(d) + 'm';
          } else {
            duration = Math.floor(d / 60) + 'h ' + d % 60 + 'm';
          }
          return this.series.name + ': ' + '<strong>' + duration + '</strong>';
        }
      },
      series: []
    };
    this.overviewOpt = {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Sleep Overview',
        enabled: false
      },
      subtitle: {
        text: `<strong>Start Time:</strong> ${this.startTime} <strong>End Time:</strong> ${this.endTime}
        <strong>Total Duration:</strong> ${this.totalDuration}`,
        style: { color: '#1f2836' }
      },
      navigator: {
        enabled: false
      },
      scrollbar: {
        enabled: false
      },
      xAxis: {
        type: 'numeric',
        tickPositions: []
      },
      yAxis: {

        min: 0,
        opposite: false,
        title: {
          text: 'Duration (Minutes)',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        }
      },
      tooltip: {
        shared: false,
        formatter: function () {
          // let tooltip: any,
          let duration: any;
          let d = this.y;
          if (d < 60) {
            duration = Math.round(d) + 'm';
          } else {
            duration = Math.floor(d / 60) + 'h ' + Math.floor(d % 60) + 'm';
          }
          return this.series.name + ': ' + '<strong>' + duration + '</strong>';
        }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        },
        series: {
          showInLegend: false,
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f} min ( {series.name} )'
          },
          grouping: false,
        },
        column: {
          grouping: false,
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      rangeSelector: {
        inputEnabled: true,
        enabled: false,
        selected: 3
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: 3,
        y: 20,
        floating: true,
        borderWidth: 1,
        // backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
        shadow: true
      },
      credits: {
        enabled: false
      },
      series: [
      ]

    };
  }
}
