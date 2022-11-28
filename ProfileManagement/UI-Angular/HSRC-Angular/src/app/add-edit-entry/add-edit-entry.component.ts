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
  entryList$!: Observable<any[]>;

  @Input() entry: any = {
    id: 0,
    firstName: "",
    lastName: "",
    phoneNumber: "",
    role: "",
    status: ""
  }
  id: number = 0;
  firstName: string = "";
  lastName: string = "";
  phoneNumber: string = "";
  role: string = "";
  status: string = "";
  roleId: string;

  @Output() list: EventEmitter<any> = new EventEmitter<any>();

  constructor(private userService: UserService, private userAuthService: UserAuthService) { }

  ngOnInit(): void {
    this.id = this.entry.id;
    this.firstName = this.entry.firstName;
    this.lastName = this.entry.lastName;
    this.phoneNumber = this.entry.phoneNumber;

    this.getAllUsers();
  }

  getAllUsers(){
    const roles: [] = this.userAuthService.getRoles();
    roles.forEach(element => {
      this.roleId = element
    });
        if (this.roleId === 'Admin') {
          this.userService.getUsers().subscribe((response:any) => {
            this.userList = response;
        });          
        } 
        else 
        {
          this.userId = this.userAuthService.getId();
          this.userService.getUserById(this.userId).subscribe((response:any) => {
            this.userList = response;
          });
        }
  }

  getAllEntriesAfterAdd() {    
    this.list.emit(this.getAllUsers());
  }

  updateUserEntry() {
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
