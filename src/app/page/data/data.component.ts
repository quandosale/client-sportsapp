import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, Data, SharedService, UserService, PatientsService } from '../../services/index';
declare let $: any;
@Component({
  selector: 'page_data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
})

export class DataComponent implements OnInit, AfterViewInit {

  patientsName: Array<string>;
  patientData: Array<Data> = [];

  selectedDate: Date;
  selectedCalendarType: string = 'all';
  selectedPatient: string = 'all';
  selectedDataType: string = 'ALL';

  datefrom: any = '';
  dateto: any = '';

  busy: Promise<any>;
  selectedPatientData: any = {};
  constructor(private dataService: DataService,
    private sharedService: SharedService,
    private userService: UserService,
    private patientservice: PatientsService,
    private router: Router,
    public elNode: ElementRef) {
  }

  ngOnInit(): void {
    this.selectedDate = new Date();
    // let _datatype = this.sharedService.getDataType();
    // if (_datatype !== null) {
    //   if (_datatype.length !== 0) {
    //     this.selectedDataType = _datatype.toString();
    //   }
    // }

    // let _caltype = this.sharedService.getCalendarType();
    // if (_caltype !== null) {
    //   if (_caltype.length !== 0) {
    //     this.selectedCalendarType = _caltype.toString();
    //   }
    // }

    this.getDatas();
  }

  ngAfterViewInit() {
    let tab2 = $(this.elNode.nativeElement).find('#tab2info');
    tab2.removeClass('in active');
    let tab1 = $(this.elNode.nativeElement).find('#tab1info');
    tab1.addClass('in active');
  }

  getDatas(): void {
    let userID = this.sharedService.getUser()._id;
    let patientIDs: String[] = [];

    // this.patientservice.getPatientByDoctor(userID).then(res => {

    //   for (let element of res.data) {

    //     patientIDs.push(element._id);
    //   }
    // });

    if (this.selectedPatient === 'all') {
    } else {
    }

    // this.busy =
    this.dataService.getDatas([userID], this.datefrom, this.dateto, this.selectedDataType.toUpperCase())
      .then(res => {
        if (res.success) {
          this.patientData = [];
          for (let element of res.data) {
            element.datetime = this.datetimeToDate(element.datetime);
            element.time = this.datetimeToTime(element.datetime);
            let type: String = element.type.toLocaleLowerCase();
            switch (type) {
              case 'bp':
                element.value = element.data.SYS + ' / ' + element.data.DIA + ' mmHg';
                type = 'BP';
                break;
              case 'ecg':

                element.value = 'Show Details';
                type = 'ECG';
                break;
              case 'SLEEP':
                element.value = 'Show Details';
                type = 'Sleep';
                break;
              case 'weight':
                element.value = element.data.weight + 'Kg';
                type = 'Weight';
                break;
              case 'activity':
                // element.value = 'Show Details';
                element.value = element.data.activity.CALORY + 'kcal';
                type = 'Activity';
                break;
              default: {
                element.value = 'other';
              }
            }
            element.type = type;
            this.patientData.push(element);
          }
        }
      });
  }

  datetimeToDate(date: Date): String {
    let DAY = ['SUN', 'MON ', 'TUE ', 'WED ', 'THU ', 'FRI ', 'SAT '];
    let MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let dateTime = new Date(date);
    let dayStr = DAY[dateTime.getDay()];
    let yyyy = dateTime.getFullYear();
    let month = dateTime.getMonth();
    let mm = MONTH[month];
    let day = dateTime.getDate();
    let dd = (day / 10 >= 1) ? day : ('0' + day);

    let result: String = `${dayStr} ${mm} ${dd}, ${yyyy}`;
    return result;

  }
  // convert date to Formatted String
  datetimeToTime(date: Date): String {
    let dateTime = new Date(date);

    let hour = dateTime.getHours();
    let hh = (hour / 10 >= 1) ? hour : ('0' + hour);
    let minute = dateTime.getMinutes();
    let min = (minute / 10 >= 1) ? minute : ('0' + minute);
    let second = dateTime.getSeconds();
    let ss = (second / 10 >= 1) ? second : ('0' + second);
    let ampm = hour < 12 ? 'AM' : 'PM';

    let result: String = `${hh}:${min} ${ampm}`;
    return result;
  }
  // convert date to Formatted String
  dateFormat(date: Date): String {
    let dateTime = new Date(date);
    let yyyy = dateTime.getFullYear();
    let month = dateTime.getMonth() + 1;
    let mm = (month / 10 >= 1) ? month : ('0' + month);
    let day = dateTime.getDate();
    let dd = (day / 10 >= 1) ? day : ('0' + day);

    let hour = dateTime.getHours();
    let hh = (hour / 10 >= 1) ? hour : ('0' + hour);
    let minute = dateTime.getMinutes();
    let min = (minute / 10 >= 1) ? minute : ('0' + minute);
    let second = dateTime.getSeconds();
    let ss = (second / 10 >= 1) ? second : ('0' + second);

    let result: String = `${mm}/${dd}/${yyyy} ${hh}:${min}:${ss}`;
    return result;
  }

  setDateRange() {
    if (this.selectedCalendarType === 'day') {
      this.datefrom = this.selectedDate.setHours(0, 0, 0, 0);
      this.dateto = this.selectedDate.setHours(23, 59, 59, 999);
      this.datefrom = new Date(this.datefrom);
      this.dateto = new Date(this.dateto);

    }
    if (this.selectedCalendarType === 'month') {
      let date = this.selectedDate;
      this.datefrom = new Date(date.getFullYear(), date.getMonth(), 1).setHours(0, 0, 0, 0);
      this.dateto = new Date(date.getFullYear(), date.getMonth() + 1, 0).setHours(23, 59, 59, 999);
      this.datefrom = new Date(this.datefrom);
      this.dateto = new Date(this.dateto);

    }
    if (this.selectedCalendarType === 'week') {
      let dTmp = this.selectedDate; // get current date
      let first = dTmp.getDate() - dTmp.getDay(); // First day is the day of the month - the day of the week
      let last = first + 6; // last day is the first day + 6

      let firstDate: Date = new Date(dTmp);
      let lastDate: Date = new Date(dTmp);

      firstDate.setHours(0, 0, 0, 0);
      lastDate.setHours(23, 59, 59, 999);

      firstDate.setDate(first);
      lastDate.setDate(last);

      console.log(firstDate);
      console.log(lastDate);

      this.datefrom = new Date(firstDate);
      this.dateto = new Date(lastDate);


    }
    if (this.selectedCalendarType === 'all') {
      this.datefrom = '';
      this.dateto = '';

    }
    this.sharedService.setDateRange(this.datefrom, this.dateto);
  }
  dayClicked(date: Date): void {
    this.selectedDate = date;
    this.setDateRange();
    this.getDatas();
  }

  onCalendarTypeSelected(value: string): void {
    this.selectedCalendarType = value;
    this.setDateRange();
    this.sharedService.setCalendarType(value);
    this.getDatas();
  }

  onPatientSelected(value: string): void {
    this.selectedPatient = value;
    this.sharedService.setSelectedPatient(value);
    this.getDatas();
  }

  onDataTypeSelected(value: string): void {
    this.selectedDataType = value;
    this.sharedService.setDataType(value);
    this.getDatas();

  }
  showDetail(item) {
    let str: String = '' + item.type;
    console.log('click', str, item);
    switch (str.toLocaleLowerCase()) {
      // case 'activity': this.router.navigate(['/activity', this.selectedPatientData.patientId, this.selectedPatientData._id]); break;
      case 'sleep': this.router.navigate(['/sleep', item.ownerId, item._id]); break;
      case 'ecg': this.router.navigate(['/ecg', item._id, item.datetime]); break;
      // case 'ecg': this.router.navigate(['/sleep-analysis', item._id, item.datetime]); break;

    }
  }
}
