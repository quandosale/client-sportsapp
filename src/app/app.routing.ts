import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ResetComponent } from './reset/reset.component';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'passport', component: ForgotComponent },
  { path: 'auth/reset-password/:token', component: ResetComponent },
  {
    path: '',
    loadChildren: './page#PageModule'
  },
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(routes);
