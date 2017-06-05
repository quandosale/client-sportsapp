
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';
import { ChartModule } from 'angular2-highcharts';
import { PageComponent } from './page.component';
import { NewComponent } from './new/new.component';
import { ECGThumbnail } from './new/components/ecg-thumbnail.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { PatientsComponent } from './patients/patients.component';
import { NetWorkComponent } from './network/network.component';
import { NotificationComponent } from './notification/notification.component';
import { SearchPipe } from './network/search';
import { PageRoutingModule } from './page-routing.module';
import { SearchComponent } from './search/search.component';
import { ImageUploadModule } from 'ng2-imageupload';
import { AccordionModule } from 'ng2-accordion';
import { PopoverModule } from 'ng2-popover';
import {
  MessagesModule, GrowlModule, TabViewModule, DialogModule, DataListModule,
  CarouselModule, TooltipModule, OverlayPanelModule, DropdownModule,
  DataTableModule, ConfirmDialogModule, ConfirmationService
} from 'primeng/primeng';
import { ImageCropperComponent } from 'ng2-img-cropper';
import { BusyModule, BusyConfig } from 'angular2-busy';
import { MyCalendarComponent } from './calendar/calendar.component';
import { CalendarModule } from 'angular-calendar';
import {
  DataComponent, CalendarTypeComponent, SelectDataTypeComponent, SelectPatientComponent,
  TrendComponent, SelectTrendTypeComponent, EcgSessionComponent, AccelerometerChartComponent,
  ActivitySessionComponent,
  HeartRateChartComponent, HeartRateTimezoneComponent, SleepSessionComponent, SleepChartComponent,
  CalmnessChartComponent, MotionChartComponent, SleepAnalysisComponent, SleepMapComponent, SleepQualityChartComponent
} from './data/index';

import { SettingComponent, UserComponent, GatewaysComponent } from './settings/index';
import { AnalyticsComponent } from './analytics/analytics.component';
import { AnaysticsOptionComponent } from './analytics/analytics-option/anaytics-option.component';


import { UpgradeComponent } from './upgrade/upgrade.component';

@NgModule({
  imports: [
    CommonModule,
    PageRoutingModule,
    FormsModule,
    JsonpModule,
    ChartModule,
    MessagesModule,
    GrowlModule,
    TabViewModule,
    DataTableModule,
    DialogModule,
    ImageUploadModule,
    DataListModule,
    AccordionModule,
    CarouselModule,
    TooltipModule,
    PopoverModule,
    OverlayPanelModule,
    DropdownModule,
    BusyModule.forRoot(
      new BusyConfig({
        message: '',
      }
      )
    ),
    ConfirmDialogModule,
    CalendarModule.forRoot(),
  ],
  declarations: [
    ECGThumbnail,
    PageComponent,            // page
    NewComponent,             // new page
    MenuComponent,            // menu
    HeaderComponent,          // header
    PatientsComponent,        // patients page
    NetWorkComponent,         // network page

    SettingComponent,         // settings page
    UserComponent,
    GatewaysComponent,
    NotificationComponent,    // notification page
    ImageCropperComponent,
    SearchComponent,          // search page
    SearchPipe,
    DataComponent,            // data page
    MyCalendarComponent,      //
    CalendarTypeComponent,    //
    SelectDataTypeComponent,  //
    SelectPatientComponent,   //
    SelectTrendTypeComponent, //
    TrendComponent,           // trend page
    EcgSessionComponent,      // ecg page
    AccelerometerChartComponent,
    ActivitySessionComponent,
    HeartRateChartComponent,
    HeartRateTimezoneComponent,
    SleepSessionComponent,
    SleepChartComponent,
    CalmnessChartComponent,
    MotionChartComponent,
    SleepAnalysisComponent,      // sleep analysis
    SleepQualityChartComponent,
    SleepMapComponent,

    AnalyticsComponent,       // Analytics Page
    AnaysticsOptionComponent,
    UpgradeComponent,         // Upgrade page
  ],
  providers: [ConfirmationService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PageModule { }

