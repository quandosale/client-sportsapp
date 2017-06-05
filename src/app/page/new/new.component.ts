import { Component } from '@angular/core';
import { Patients, User, PatientsService, UserService, SharedService, DataService } from '../../services/index';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'page_new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})

export class NewComponent implements OnInit {
  mPatients: Patients[] = [];
  mUser: User;
  mECG: Number[] = null;
  mBP: Object = null;
  mActivity: Object = null;
  mWeight: Number = null;
  mBusy: Promise<any>;
  mActiveState: Boolean[] = [];
  mIActive: Number;
  mActivePatientID: String;
  mDatasetIDs: any = {
    ecg: ''
  };

  constructor(private patientService: PatientsService,
    private userService: UserService,
    private sharedService: SharedService,
    private dataService: DataService,
    private router: Router) {

  }
  ngOnInit() {
    // console.log('News Pages Initialized...');
    this.getPatientByDoctor();
  }


  getPatientByDoctor(): void {
    let userID = this.sharedService.getUser()._id;
    if (userID !== '') {
      this.mUser = this.sharedService.getUser();
    }
    this.mBusy = this.patientService.getPatientByDoctor(userID).then(res => {
      for (let element of res.data) {
        element.birthday = this.birthdayConvert(element.birthday);
        element.photo = element.photo;                       // CONFIG.SERVER_URL +
        element.owner = 'MyPatient';
        this.mPatients.push(element);
        this.mActiveState.push(false);
      }
      this.mIActive = 0;
      this.mActiveState[this.mIActive.valueOf()] = true;
      this.mActivePatientID = res.data[0]._id;
      if (res.data.length !== 0) {
        this.showPatientData(res.data[0], 0);
      }
    });
    // console.log(this.mPatients);
  }
  birthdayConvert(Birthday: any): any {
    let birthday = new Date(Birthday);
    let yyyy = birthday.getFullYear();
    let month = birthday.getMonth() + 1;
    let mm = (month / 10 >= 1) ? month : ('0' + month);
    let day = birthday.getDate() + 1;
    let dd = (day / 10 >= 1) ? day : ('0' + day);
    Birthday = `${yyyy}-${mm}-${dd}`;
    return Birthday;
  }
  private showPatientData(patient: Patients, i: Number): void {
    this.mActiveState[this.mIActive.valueOf()] = false;
    this.mActiveState[i.valueOf()] = true;
    this.mIActive = i;

    this.mBusy = this.dataService.getLatestData(patient._id)
      .then(res => this.setPatientData(res.data));
  }
  // private initPatientData() {
  //   this.mECG = null;
  //   this.mBP = null;
  //   this.mActivity = null;
  //   this.mWeight = null;
  // }
  private setPatientData(data: any) {
    console.log('Patient Data', data);
    this.mDatasetIDs.ecg = data.ecgID;
    this.mECG = data.ecg;
    this.mBP = data.BP;
    this.mActivity = data.activity;
    // if (data.activity.CALORY === 0) {
    //   this.mActivity = null;
    // }
    this.mWeight = data.weight;
  }
  private dateFormat(date: Date): String {
    let dateTime = new Date(date);
    let yyyy = dateTime.getFullYear();
    let month = dateTime.getMonth() + 1;
    let mm = (month / 10 >= 1) ? month : ('0' + month);
    let day = dateTime.getDate() + 1;
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
  private navToDetails(type: String) {
    if (type === 'ecg' && this.mECG != null) {
      // console.log('Go to details', type);
      // console.log(this.mDatasetIDs.ecg, this.mActivePatientID);
      let date = this.dateFormat(new Date());
      this.router.navigate(['/ecg', this.mDatasetIDs.ecg, date]);
    }
    if (type === 'weight') {
      // console.log(type);
    }
    if (type === 'activity') {
      // console.log(type);
    }
    if (type === 'bp') {
      // console.log(type);
    }
  }
}
