import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { DataService, Data, SharedService, UserService, PatientsService } from '../../services/index';
import { Router } from '@angular/router';
declare let $: any;
@Component({
    selector: 'analytics',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit, AfterViewInit {

    patientsName: Array<string>;
    patientData: Array<Data> = [];

    selectedDate: Date;
    selectedCalendarType: string = 'all';
    selectedPatient: string = 'all';
    selectedDataType: string = 'ALL';

    datefrom: any = '';
    dateto: any = '';

    busy: Promise<any>;
    selectedPatientData: any = [];
    seekbar: any;
    seekbarValue = 0;
    constructor(
        private dataService: DataService,
        private sharedService: SharedService,
        private userService: UserService,
        private patientservice: PatientsService,
        private router: Router,
        public elNode: ElementRef
    ) { }

    ngOnInit() {
        this.getDatas();
    }
    ngAfterViewInit() {
        this.seekbar = $(this.elNode.nativeElement).find('#seekbarRange');

        this.seekbar.slider({
            range: 'min',
            orientation: 'horizontal',
            animation: true,
            min: 0,
            max: 100,
            value: 0,
            slide: (event, ui) => { this.seekbarClick(ui.value); }
        });
    }
    seekbarClick(v) {
        this.seekbarValue = v;

    }
    getDatas(): void {
        let userID = this.sharedService.getUser()._id;
        let patientIDs: String[] = [];

        if (userID !== '') {
            patientIDs = this.sharedService.getUser().patients;
        }

        // this.patientservice.getPatientByDoctor(userID).then(res => {

        //   for (var element of res.data) {

        //     patientIDs.push(element._id);
        //   }
        // });

        if (this.selectedPatient === 'all') {
        } else {
            patientIDs = [];
            patientIDs.push(this.selectedPatient);
        }

        this.busy = this.dataService.getDatas(patientIDs, this.datefrom, this.dateto, this.selectedDataType.toUpperCase())
            .then(res => {
                if (res.success) {
                    this.patientData = [];
                    for (let element of res.data) {
                        element.datetime = this.dateFormat(element.datetime);
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
                            case 'sleep':
                                element.value = 'Show Details';
                                type = 'Sleep';
                                break;
                            case 'weight':
                                element.value = element.data.weight + 'Kg';
                                type = 'Weight';
                                break;
                            case 'activity':
                                element.value = 'Show Details';
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
        console.log('s', this.selectedPatient);
        this.getDatas();
    }

    onDataTypeSelected(value: string): void {
        this.selectedDataType = value;
        this.sharedService.setDataType(value);
        this.getDatas();

    }
    showDetail() {
        let str: String = '' + this.selectedPatientData[0];
        console.log(str);
    }

}
