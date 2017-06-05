import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { SharedService, User } from '../../services/index';
import { CONFIG } from '../../common/config';
import { Router } from '@angular/router';
declare let $: any;
@Component({
  selector: 'page_menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit, AfterViewInit {
  src: String = CONFIG.SERVER_URL + '/assets/gravatar/default.jpg';
  selectedMenu = '';
  liNode: any;
  user: User;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    public elNode: ElementRef) { }
  ngOnInit() {
    this.getUser();
  }
  ngAfterViewInit() {

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

  logOut() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

}
