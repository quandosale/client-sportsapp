import { UserComponent } from './settings/user/user.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageComponent } from './page.component';
import { DataComponent, EcgSessionComponent, SleepSessionComponent, ActivitySessionComponent, SleepAnalysisComponent } from './data/index';
import { NewComponent } from './new/new.component';
import { PatientsComponent } from './patients/patients.component';
import { NetWorkComponent } from './network/network.component';
import { SettingComponent } from './settings/setting.component';
import { SearchComponent } from './search/search.component';
import { NotificationComponent } from './notification/notification.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { FirmwareComponent } from './firmware/firmware.component';
import { AuthGuard } from '../services/index';

const pageRoutes: Routes = [
  {
    path: '',
    component: PageComponent,
    children: [
      { path: 'news', component: NewComponent },
      { path: 'data', component: DataComponent },
      { path: 'patients', component: PatientsComponent },
      { path: 'ecg/:id/:date', component: EcgSessionComponent },
      { path: 'sleep-analysis/:id/:date', component: SleepAnalysisComponent },

      { path: 'sleep/:patientId/:datasetId', component: SleepAnalysisComponent },
      { path: 'activity/:id/:datasetId', component: ActivitySessionComponent },
      { path: 'network', component: NetWorkComponent },
      { path: 'setting', component: UserComponent },
      { path: 'search', component: SearchComponent },
      { path: 'notification', component: NotificationComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'upgrade', component: UpgradeComponent },

      { path: 'firmware', component: FirmwareComponent }
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(pageRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PageRoutingModule { }
