import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAuthService } from '../_services/user-auth.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-add-edit-entry',
  templateUrl: './add-edit-entry.component.html',
  styleUrls: ['./add-edit-entry.component.css']
})
export class AddEditEntryComponent implements OnInit {
  
  userList : any;
  userId: any;
  users$!: Observable<any[]>;

  @Input() entry: any = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    role: [""],
    status: ""
  }

  registerUser: any = {
    email: "user@example.com",
    password: "string",
    firstName: "string",
    lastName: "string",
    roles: [
      "string"
    ],
    status: "string"
  }

  id: string = "";
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  role: string[] = [""];
  status: string = "";
  password: string = "";

  roleId: string;

  @Output() list: EventEmitter<any> = new EventEmitter<any>();

  constructor(private userService: UserService, private userAuthService: UserAuthService) { }

  ngOnInit(): void {
    this.id = this.entry.id;
    this.firstName = this.entry.firstName;
    this.lastName = this.entry.lastName;
    this.email = this.entry.email;
    this.role.push(this.entry.role);
    this.status = this.entry.status;

    this.getAllUsers();
  }

  getAllUsers(){
    const roles: [] = this.userAuthService.getRoles();
    roles.forEach(element => {
      this.roleId = element
    });
        if (this.roleId === 'Admin') {
          this.users$ = this.userService.getUsers();          
        } 
        else 
        {
          this.userId = this.userAuthService.getId();
          this.users$ = this.userService.getUserById(this.userId);
        }
  }

  getAllEntriesAfterAdd() {    
    this.list.emit(this.getAllUsers());
  }


  AddUserEntry() {
    this.registerUser = {
      email: this.entry.email,
      password: "p#ssW0rd1",
      firstName: this.entry.firstName,
      lastName: this.entry.lastName,
      roles: [
        this.entry.role
      ],
      status: this.entry.status
    }

    this.userService.addUser(this.registerUser).subscribe(response => {
      this.getAllEntriesAfterAdd();
      var modalCloseBtn = document.getElementById('add-edit-model-close');
      if(modalCloseBtn) {
        modalCloseBtn.click();
      }

      var displaySuccessAlert = document.getElementById('add-success-alert');
      if(displaySuccessAlert){ displaySuccessAlert.style.display = "block"; }

      setTimeout(() => {
        if(displaySuccessAlert) { displaySuccessAlert.style.display = "none"; }
      }, 5000);
      

    }, err => {      
      var displayErrorAlert = document.getElementById('add-error-alert');      
      if(displayErrorAlert){ displayErrorAlert.style.display = "block"; }
      setTimeout(() => {
        if(displayErrorAlert) { displayErrorAlert.style.display = "none"; }
      }, 5000);
      console.log('See error: ', err); // use logs
    })

  }

  updateUserEntry() {
    console.log('Id: ', this.entry.id);
    console.log('Entry: ', this.entry);
      this.userService.updateUser(this.entry.id,this.entry).subscribe(response => {
        var modalCloseBtn = document.getElementById('add-edit-model-close');
        if(modalCloseBtn) {
          modalCloseBtn.click();
        }
  
        var displaySuccessAlert = document.getElementById('update-success-alert');
        if(displaySuccessAlert){ displaySuccessAlert.style.display = "block"; }
        
        setTimeout(() => {
          if(displaySuccessAlert) { displaySuccessAlert.style.display = "none"; }
        }, 5000);
  
      }, err => {      
        var displayErrorAlert = document.getElementById('error-alert');      
        if(displayErrorAlert){ displayErrorAlert.style.display = "block"; }
        setTimeout(() => {
          if(displayErrorAlert) { displayErrorAlert.style.display = "none"; }
        }, 5000);
        console.log('See error: ', err); // use logs
      })
    }

}
