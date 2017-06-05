import 'rxjs/add/operator/switchMap';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../services/index';
import { Message } from 'primeng/primeng';
import { Router } from '@angular/router';

@Component({

  selector: 'my-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css'],
  providers: [UserService],

})
export class ForgotComponent {
  user: any = {};
  msgs: Message[] = [];
  onRegister: Boolean = true;
  onEmail: Boolean = true;
  onExist: Boolean = true;
  onForgot: Boolean = true;
  onCheck: Boolean = false;
  busy: Promise<any>;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private userService: UserService,
  ) { }

  Forgot(): void {
    let re = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.onRegister = true;
    if (this.user.sec_question == null || this.user.sec_answer == null) {
      this.onRegister = false;
    }
    this.onCheck = false;
    this.onForgot = true;
    this.onEmail = re.test(this.user.username);
    if (this.onEmail === true && this.onRegister === true) {
      this.busy = this.userService.Forgot(this.user)
        .then(res => {
          if (res.success) {
            this.onCheck = true;
          } else {
            this.onForgot = false;
          };
        });
    }

  }
  goBack(): void {
    this.location.back();
  }
}
