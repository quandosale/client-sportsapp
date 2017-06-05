import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { SelectItem } from 'primeng/primeng';

import { Patients, User, PatientsService, UserService, SharedService } from '../../../services/index';

@Component({
  selector: 'select-patient-name',
  templateUrl: './selectpatient.component.html',
  styles: [`
    .select-data-type {
      width: 100%;
      margin-bottom: 100px;
    }
    .image {
      width:24px;
      height: 24px;
      position:absolute;
      top:1px;
      left:5px
    }
  `],
})
export class SelectPatientComponent implements OnInit {
  selectPatientList: SelectItem[] = [];
  selectedPatient: Patients;
  patients: Patients[] = [];
  users: User[] = [];
  user: User;
  @Input() needAll: Boolean;
  @Input() noPatient: Boolean;
  @Output() firstPatient = new EventEmitter<any>();
  @Output() patientselected = new EventEmitter<any>();
  @Output() patientselectedID = new EventEmitter<any>();


  constructor(private UserService: UserService,
    private sharedService: SharedService,
    private patientservice: PatientsService, ) {
  }

  getPatientByDoctor(): void {
    if (this.needAll) {
      this.selectPatientList.push({ label: 'All', value: 'all' });
    }
    if (this.noPatient) {
      this.selectPatientList.push({ label: 'Select Patient', value: '' });
    }


    let userID = this.sharedService.getUser()._id;
    if (userID !== '') {
      this.user = this.sharedService.getUser();
    }
    this.patientservice.getPatientByDoctor(userID)
      .then(res => {
        for (let element of res.data) {
          let birthday = new Date(element.birthday);
          let yyyy = birthday.getFullYear();
          let month = birthday.getMonth() + 1;
          let mm = (month / 10 >= 1) ? month : ('0' + month);
          let day = birthday.getDate() + 1;
          let dd = (day / 10 >= 1) ? day : ('0' + day);
          element.birthday = `${yyyy}-${mm}-${dd}`;
          // element.photo = CONFIG.SERVER_URL + element.photo;
          element.owner = 'MyPatient';
          this.patients.push(element);
          this.selectPatientList.push({ label: element.lastname, value: element });
        }
        this.firstPatient.emit(this.selectPatientList[0].value);
      });
  }

  ngOnInit(): void {
    this.getPatientByDoctor();
  }

  selectPatient(patient: any): void {
    this.selectedPatient = patient.value;
    this.patientselected.emit(this.selectedPatient);
    this.patientselectedID.emit(this.selectedPatient._id);


  }

}
