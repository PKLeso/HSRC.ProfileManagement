import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './_auth/auth.guard';
import { AuthInterceptor } from './_auth/auth.interceptor';
import { UserService } from './_services/user.service';

import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { FilterService, GridAllModule, GroupService, PageService, SortService, GridModule, PagerModule } from '@syncfusion/ej2-angular-grids';
import { CommonModule } from '@angular/common';

import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerAllModule } from '@syncfusion/ej2-angular-calendars';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { AddEditEntryComponent } from './add-edit-entry/add-edit-entry.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    UserComponent,
    LoginComponent,
    HeaderComponent,
    ForbiddenComponent,
    AddEditEntryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    GridModule, PagerModule,    
    CheckBoxModule,
    GridAllModule,
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    ToolbarModule,
    DialogModule, 
    DatePickerAllModule, 
    DropDownListAllModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass:AuthInterceptor,
      multi:true
    },
    UserService,
    PageService,
    SortService,
    FilterService,
    GroupService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
