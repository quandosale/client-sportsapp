import { Component, OnInit } from '@angular/core';
import { Patients, PatientsService, UserService, User, SharedService, NotificationsService } from '../../services/index';
import { Message } from 'primeng/primeng';

@Component({

    selector: 'page_search',
    templateUrl: './search.component.html',
    styleUrls: ['../network/network.component.css'],
    providers: [PatientsService, UserService],
})

export class SearchComponent implements OnInit {
    searchText: string = '';
    users: User[] = [];
    resultUsers: User[] = [];
    patients: Patients[] = [];
    resultPatients: Patients[] = [];
    user: any = {};
    patient: any = {};
    msgs: Message[] = [];
    n_Users: number;
    n_Patients: number;
    shareCheck: Boolean = false;
    requestCheck: Boolean = false;


    constructor(
        private patientService: PatientsService,
        private userService: UserService,
        private sharedService: SharedService,
        private notificationsService: NotificationsService, ) {
    }

    ngOnInit(): void {
        this.users = this.sharedService.getUsers();
        this.patients = this.sharedService.getPatients();
        this.search();
    }



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
                    this.msgs.push({ severity: 'success', summary: 'Successful', detail: 'Request' });
                }
            });
        }
    }

    //////////////////////       search Users  //////////////
    searchUsers(str: String) {
        this.resultUsers = [];
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].username.toLocaleLowerCase().includes(str.toLocaleLowerCase())) {
                this.resultUsers.push(this.users[i]);
            }
        }
        this.sharedService.setSearchUsers(this.resultUsers);
    }

    //////////////////////       search Patients  //////////////


    searchPatients(str: String) {
        this.resultPatients = [];
        for (let i = 0; i < this.patients.length; i++) {
            if (this.patients[i].lastname.toLocaleLowerCase().includes(str.toLocaleLowerCase())) {
                this.resultPatients.push(this.patients[i]);
            }
        }
        this.sharedService.setsearchPatients(this.resultPatients);
    }

    search() {
        this.searchUsers(this.searchText);
        this.searchPatients(this.searchText);
        this.n_Users = this.resultUsers.length;
        this.n_Patients = this.resultPatients.length;
    }

    //////////////////////       add network  //////////////
    addNetwork(user: User) {
        this.msgs = [];
        let myuser: User;
        myuser = this.sharedService.getUser();
        if (myuser._id === user._id) {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Error', detail: 'You can not add!' });
        } else {
            this.userService.addNetwork(myuser._id, user._id).then(res => {
                if (res.success) {
                    this.msgs.push({ severity: 'success', summary: 'Successful', detail: res.message });
                    myuser.accounts.push(user._id);
                    this.sharedService.setUser(myuser);
                } else {
                    this.msgs.push({ severity: 'error', summary: 'Error', detail: res.message });
                };
            });
        }
    }
}
