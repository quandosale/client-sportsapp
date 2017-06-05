import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
// Router library
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
// services
import { DataService } from '../../../../services/index';
// jquery declare
declare var $: any;

@Component({
  selector: 'ecg-session-view',
  templateUrl: './ecg-session.component.html',
  styleUrls: ['./ecg-session.component.css', './ss.css']
})

export class EcgSessionComponent implements OnInit, AfterViewInit, OnDestroy {

  dataSetId: string = '';
  date: string = '';

  private sub: any;

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.dataSetId = params['id'];
      this.date = params['date'];
      // this.dataSetId = '5888757ca1e7751e55dda777';
      // this.date = '01/26/2017 17:52:59';
    });
  }
  ngAfterViewInit() {
  }

  constructor(private dataService: DataService, private route: ActivatedRoute, private _location: Location) { }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  backClicked() {
    this._location.back();
  }
}
