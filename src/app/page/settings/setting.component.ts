import { Component, OnInit } from '@angular/core';
import { PatientsService, UserService, SharedService } from '../../services/index';
import { Message } from 'primeng/primeng';

import { CONFIG } from '../../common/config';
import { Router, } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';

declare let jQuery: any;
declare let $: any;

@Component({

  selector: 'page_setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
  providers: [PatientsService, UserService, ConfirmationService],
})
export class SettingComponent implements OnInit {

  user: any = {};
  msgs: Message[] = [];
  src: string = CONFIG.SERVER_URL + '/assets/gravatar/default.jpg';
  constructor(
    private router: Router,
    private userService: UserService,
    private sharedService: SharedService,
    private confirmationService: ConfirmationService
  ) {

  }

  ngOnInit(): void {
    $(document).ready(function () {
      $('div.bhoechie-tab-menu>div.list-group>a').click(function () {
        // e.preventDefault();
        $(this).siblings('a.active').removeClass('active');
        $(this).addClass('active');
        let index = $(this).index();
        $('div.bhoechie-tab>div.bhoechie-tab-content').removeClass('active');
        $('div.bhoechie-tab>div.bhoechie-tab-content').eq(index).addClass('active');
      });
    });
    this.getUser();
  }


  ////////////////////// getuser  /////////////////////

  getUser() {
    this.user = this.sharedService.getUser();
    if (this.user.photo == null) {
      this.user.photo = CONFIG.SERVER_URL + '/assets/gravatar/default.jpg';
    }
    this.src = this.user.photo;
  }

  ////////////////////////   deleteUser   /////////////////
  deleteUser() {
    this.userService.deleteUser(this.user._id).then(res => {
      this.msgs = [];
      if (res.success) {
        this.msgs.push({ severity: 'success', summary: 'Successful', detail: res.message });
        setTimeout(() => { this.router.navigate(['/login']); }, 2000);
      }
      else {
        this.msgs.push({ severity: 'error', summary: 'Error', detail: res.message });
      };
    });
  }

  confirm() {
    this.confirmationService.confirm({
      message: 'Do you want to delete User?',
      header: 'Delete User',
      icon: 'fa fa-trash',
      accept: () => {
        this.deleteUser();
      }
    });
  }


}









