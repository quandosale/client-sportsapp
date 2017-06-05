import { Component, AfterViewInit, OnInit } from '@angular/core';
import { User, UserService, SharedService, PatientsService, NotificationsService } from '../../services/index';
import { CONFIG } from '../../common/config';
import { Router } from '@angular/router';

declare var jQuery: any;
declare var $: any;


@Component({

  selector: 'page_header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})


export class HeaderComponent implements OnInit, AfterViewInit {
  hightlightStatus = false;
  today: string;
  user: User;
  src: String = CONFIG.SERVER_URL + '/assets/gravatar/default.jpg';
  notificationsCount: Number = 0;
  notificationsShow: Boolean = true;
  notifications: any = [];
  notificationsTime: Number = 1000 * 60 * 5;   // 5min

  constructor(
    private router: Router,
    private patientService: PatientsService,
    private userService: UserService,
    private sharedService: SharedService,
    private notificationsService: NotificationsService) {

  }

  ngAfterViewInit(): void {
    let date = new Date();
    let DAY = ['Sunday', 'Monday ', 'Tuesday ', 'Wednesday ', 'Thursday ', 'Friday ', 'Saturday '];
    let MONTH = ['Jan ', 'Feb ', 'Mar ', 'Apr ', 'May ', 'Jun ',
      'Jul ', 'Aug ', 'Sept ', 'Oct ', 'Nov ', 'Dec '];
    // this.today = DAY[date.getDay()] + ', ' + MONTH[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    this.today = MONTH[date.getMonth()] + ' ' + date.getDate();

  }

  ngOnInit(): void {
    this.getUser();
    this.getNotifications(this.user._id);
    setInterval(() => { this.getNotifications(this.user._id); }, this.notificationsTime);
    setInterval(() => { this.getUser(); }, 1000);
  }

  getUser() {
    this.user = this.sharedService.getUser();
    if (this.user != null) {
      if (this.user.photo == null) {
        this.user.photo = CONFIG.SERVER_URL + '/assets/gravatar/default.jpg';
      }
      this.src = this.user.photo;
    }

  }

  menuToggle(event: any): void {
    if (this.hightlightStatus === true) {
      this.hightlightStatus = false;
    } else { this.hightlightStatus = true; }
    this.hightlightStatus = !this.hightlightStatus;
    $('#wrapper').toggleClass('toggled');
  }


  getNotifications(id: String) {
    this.notifications = [];
    this.notificationsService.getNotifications(id, 'new').then(res => {
      if (res.success) {
        this.notificationsCount = res.data.length;
        this.notifications = res.data.slice(0, 5);
        this.notificationsShow = false;
      }
    });
  }

  gotoNotification() {
    this.notifications = [];
    this.notificationsShow = true;
    this.router.navigate(['/notification']);
  }
}
