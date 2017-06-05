import { Component, OnInit } from '@angular/core';
import { UserService, SharedService, PatientsService, NotificationsService } from '../../services/index';

@Component({
    selector: 'notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

    notifications: any = [];

    constructor(
        private patientService: PatientsService,
        private userService: UserService,
        private sharedService: SharedService,
        private notificationsService: NotificationsService) {

    }
    ngOnInit(): void {
        this.getNotifications(this.sharedService.getUser()._id);
    }

    getNotifications(id: String) {
        this.notifications = [];
        this.notificationsService.getNotifications(id, 'all').then(res => {
            if (res.success) {
                this.notifications = res.data;
                this.notifications.reverse();
                this.notificationsService.notificationsRead();
                console.log(this.notifications);
            }
        });
    }
}
