import { Component, OnInit } from '@angular/core';
import { Patients, PatientsService, UserService, User, SharedService, NotificationsService } from '../../services/index';
import { CONFIG } from '../../common/config';
import { Router } from '@angular/router';
import { Message } from 'primeng/primeng';

@Component({

  selector: 'page_network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css'],
})


export class NetWorkComponent implements OnInit {

  users: User[] = [];
  netUsers: User[] = [];
  resultUsers: User[] = [];
  user: any = {};
  patient: any = {};
  patients: Patients[] = [];
  resultPatients: Patients[] = [];
  patientsPhoto: any = [];
  searchText: string = '';
  msgs: Message[] = [];
  busy: Promise<any>;
  shareCheck: Boolean = false;
  requestCheck: Boolean = false;

  constructor(
    private patientService: PatientsService,
    private userService: UserService,
    private sharedService: SharedService,
    private notificationsService: NotificationsService,
    private router: Router, ) {

  }

  ngOnInit(): void {
    this.getPatitents();
  }


  ////////////////////    get Patients    ////////////////

  getPatitents() {
    this.busy = this.patientService.getPatients().then(res => {
      for (let element of res.data) {
        if (element.photo == null) {
          element.photo = CONFIG.SERVER_URL + '/assets/gravatar/default.jpg';
        }
        // element.photo =  element.photo;
        this.patients.push(element);
      }
      this.sharedService.setPatients(this.patients);
      this.getNetworkUsers();
    });
  }


  /////////////////////    get network Users    //////////////

  getNetworkUsers() {
    this.userService.getUsers().then(res => {
      let accounts = this.sharedService.getUser().accounts;

      for (let element of res.data) {
        // save user photo
        if (element.photo == null) {
          element.photo = CONFIG.SERVER_URL + '/assets/gravatar/default.jpg';
        }
        this.patientsPhoto = [];
        if (element.patients.length !== 0) {                                   // save patients photo
          for (let patient of element.patients) {
            if (this.getPhoto(patient) != null) {
              this.patientsPhoto.push(this.getPhoto(patient));
            } else { console.log('Error Message : can not find patient'); }
          }
          element.patientsPhoto = this.patientsPhoto;
        }
        element.numberOfPatients = element.patients.length;
        if (accounts.find(account => account === element._id)) {
          this.netUsers.push(element);                                        // save my network account
        }
        this.users.push(element);                                             // save all account
      }
      this.sharedService.setUsers(this.users);                                // sharedService setUsers
    });
  }

  ////////////////////      get patients photo    ////////////

  getPhoto(id: String): String {
    this.patient = {};
    this.patient = this.patients.find(patient => patient._id === id);
    if (this.patient == null) { return null; }
    return this.patient.photo;
  }


  ////////////////////
  netWorkAdd(): void {
    this.router.navigate(['/search']);
  }

  //////////////////////       delete network  //////////////
  deleteNetwork(user: User, id: String) {
    this.msgs = [];
    let myuser: User;
    myuser = this.sharedService.getUser();
    this.userService.deleteNetwork(myuser._id, user._id).then(res => {
      if (res.success) {
        this.msgs.push({ severity: 'success', summary: 'Successful', detail: res.message });
        myuser.accounts.splice(myuser.accounts.indexOf(user._id), 1);
        this.sharedService.setUser(myuser);
        this.netUsers.splice(this.netUsers.findIndex(result => result._id === id), 1);
      } else {
        this.msgs.push({ severity: 'error', summary: 'Error', detail: res.message });
      };
    });
  }


  //////////////////////       Send Request    //////////////

  sendRequset(id: String) {
    let notifications: any = {};
    let sender = this.sharedService.getUser();
    this.msgs = [];
    notifications.sender = sender._id;
    notifications.sender_firstname = sender.firstname;
    notifications.sender_lastname = sender.secondname;
    notifications.sender_photo = sender.photo;
    notifications.receiver = id;
    if (this.shareCheck) {
      notifications.message = 'Share my patient\'s data';
      notifications.type = 2;
      this.notificationsService.notificationsPush(notifications).then(res => {
        if (res.success) {
          this.msgs.push({ severity: 'success', summary: 'Successful', detail: 'Share my data' });
        }
      });
    }
    if (this.requestCheck) {
      notifications.message = 'Request to see doctor\'s patient data';
      notifications.type = 0;
      this.notificationsService.notificationsPush(notifications).then(res => {
        if (res.success) {
          this.msgs.push({ severity: 'success', summary: 'Successful', detail: 'Requset' });
        }
      });
    }
  }
}

