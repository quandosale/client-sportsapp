import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

declare var $: any;
import { PatientsService, UserService, DataService } from '../../../../services/index';
@Component({
  selector: 'activity_session_view',
  templateUrl: './activity-session.component.html',
  styleUrls: ['./activity-session.component.css'],
  providers: [PatientsService, UserService, DataService],
})

export class ActivitySessionComponent implements OnInit {
  private sub: any;
  patientId: String = '';
  datasetId: String = '';
  datetime: String;
  timeOption: any;
  pointOption: any;
  caloriesOption: any;
  distanceOption: any;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private _location: Location) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.patientId = params['id'];
      this.datasetId = params['datasetId'];
    });

    this.getData();
  }

  backClicked() {
    this._location.back();
  }

  getData() {
    let ids = [];
    ids.push(this.patientId);
    this.dataService.getData(this.datasetId).then((res: any) => {
      let date = new Date(res.data.datetime);
      this.datetime = date.toLocaleDateString('en-us', { month: 'long', day: 'numeric', year: 'numeric' });

      let _category = []; // activity type

      let _ValueT = [];
      let _ValueD = [];
      let _ValueC = [];
      let _ValueP = [];
      console.log('khs', res);

      let activityData = res.data.data.activity;
      activityData = [{
        type: "12345",
        duration: 2,
        point: 5,
        calory: 5,
        distance: 5
      },
      {
        type: "12345",
        duration: 9,
        point: 50,
        calory: 3,
        distance: 1
      },
      {
        type: "12345",
        duration: 9,
        point: 50,
        calory: 3,
        distance: 1
      },
      {
        type: "12345",
        duration: 9,
        point: 50,
        calory: 3,
        distance: 1
      },




      ];

      for (let i = 0; i < activityData.length; i++) {
        _category.push(activityData[i].type);
        _ValueT.push(activityData[i].duration);
        _ValueP.push(activityData[i].point);
        _ValueC.push(activityData[i].calory);
        _ValueD.push(activityData[i].distance);
      }
      // console.log('khs', res.data, _ValueC, );

      this.timeOption = {
        chart: { type: 'bar' },
        title: { text: 'Time', enabled: false },
        navigator: { enabled: false },
        xAxis: { categories: _category },
        yAxis: { title: { text: 'Minutes', align: 'high' } },
        tooltip: { valueSuffix: 'minutes' },
        credits: { enabled: false },
        series: [
          {
            type: 'column',
            name: 'Time',
            colorByPoint: true,
            showInLegend: false,
            data: _ValueT
          }
        ]
      };

      this.pointOption = {
        chart: { type: 'bar' },
        title: { text: 'Point', enabled: false },
        navigator: { enabled: false },
        xAxis: { categories: _category },
        yAxis: { title: { text: 'Point', align: 'high' } },
        tooltip: { valueSuffix: 'Point' },
        credits: { enabled: false },
        series: [
          {
            type: 'column',
            name: 'Point',
            colorByPoint: true,
            showInLegend: false,
            data: _ValueP
          }
        ]
      };

      this.caloriesOption = {
        chart: { type: 'bar' },
        title: { text: 'Calories', enabled: false },
        navigator: { enabled: false },
        xAxis: { categories: _category },
        yAxis: { title: { text: 'cal', align: 'high' } },
        tooltip: { valueSuffix: 'cal' },
        credits: { enabled: false },
        series: [
          {
            type: 'column',
            name: 'Calories',
            colorByPoint: true,
            showInLegend: false,
            data: _ValueC
          }
        ]
      };

      this.distanceOption = {
        chart: { type: 'bar' },
        title: { text: 'Distance', enabled: false },
        navigator: { enabled: false },
        xAxis: { categories: _category },
        yAxis: { title: { text: 'km', align: 'high' } },
        tooltip: { valueSuffix: 'km' },
        credits: { enabled: false },
        series: [
          {
            type: 'column',
            name: 'Distance',
            colorByPoint: true,
            showInLegend: false,
            data: _ValueD
          }
        ]
      };

    });
  }
}
