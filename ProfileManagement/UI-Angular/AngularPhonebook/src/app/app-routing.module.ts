import { Component, NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './Auth/guards/auth-guard.service';
import { LoginComponent } from './Auth/login/login.component';
import { PhonebookComponent } from './phonebook/phonebook.component';
import { ErrorPageComponent } from './shared/error-page/error-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'phonebook', component:PhonebookComponent, canActivate: [AuthGuard] },

  { path: 'chat', loadChildren: () => import('./signal-r/signal-r/signal-r.module').then(m => m.SignalRModule),
    canActivate: [AuthGuard] },
  { path: '**', component: ErrorPageComponent } // must always be last.
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules})]
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
