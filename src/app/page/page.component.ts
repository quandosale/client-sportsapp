import { Component, } from '@angular/core';

@Component({
  template: `
    <page_header></page_header>
    <div id="wrapper">
        <page_menu></page_menu>
        <div id="page-content-wrapper">
            <router-outlet></router-outlet>
        </div>
    </div>
  `
})
export class PageComponent {


}
