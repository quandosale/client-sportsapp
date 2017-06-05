import 'rxjs/add/operator/switchMap';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../services/index';
import { Message } from 'primeng/primeng';
import { Router } from '@angular/router';

@Component({

  selector: 'my-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css'],
  providers: [UserService],

})
export class ResetComponent {

  user: any = {};
  msgs: Message[] = [];
  onRegister: Boolean = true;
  rePassword: String = '';
  onPassword: Boolean = true;
  token: any = {};
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private userService: UserService,
  ) {
    this.route.params.subscribe(params => {
      this.token = params['token'];
    });
  }

  change(): void {
    this.onRegister = true;
    this.onPassword = true;
    if (this.user.password == null || this.rePassword == null) {
      this.onRegister = false;
    }

    if (this.user.password !== this.rePassword && this.user.password != null) { this.onPassword = false; }

    if (this.onRegister === true && this.onPassword === true) {
      this.userService.change(this.user.password, this.token)
        .then(res => {
          if (res.success) {
            // this.msgs.push({ severity: 'success', summary: 'Successful', detail: res.message });
            setTimeout(() => { this.router.navigate(['/login']); }, 2000);
          } else {

          };
        });
    }

  }
  goBack(): void {
    this.location.back();
  }


}
