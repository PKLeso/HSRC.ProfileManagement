import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SignalRAuthComponent } from '../signal-r-auth.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [{ path: '', component:SignalRAuthComponent }];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SignalRModule { }
