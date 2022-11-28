import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserAuthService } from '../_services/user-auth.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  entryList$!: Observable<any[]>;
  users: any;
  filteredEntryList: any[] = [];
  phonebookEntrylist$!: Observable<any>[]; 
  Id:any;

  modalTitle: string = '';
  addEditEntryActivated: boolean = false;
  entry:  any = {
    ProfilePicture: File,
    FirstName: "Ff",
    LastName: "Kg",
    PhoneNumber: "01252546666",
    Role: "User",
    Status: "Pending"
   } ;
  
  searchText: string = '';
  url = "./assets/img/city.jpg";
  columns: any[];
  
  constructor(private userService: UserService,
    private router: Router,
    private userAuthService: UserAuthService) { }
    

  ngOnInit(): void {
    this.columns = ['Profile Picture','First Name','Last Name','Email','Status'];
    
    this.Id = this.userAuthService.getId();
    console.log('Id: ', this.Id);

    this.users = this.userService.getUserById(this.Id).subscribe((response:any) => {
      this.users = response;
      console.log('users: ', this.users);
    });
  }

  modalClose() {
    this.addEditEntryActivated = false;
    this.entryList$ = this.userService.getUserById(this.Id);
  }

  onChangeImage(e){
    if(e.target.files){
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (img: any) => {
        this.url = img.target.result;
      }
    }

  }

  AddEntry() {
    this.entry = {
      FirstName: null,
      LastName: null,
      PhoneNumber: null,
      Role: null,
      Status: null
    }
    this.modalTitle = "Add User";
    this.addEditEntryActivated = true;
  }

  editModal(id: any) {
    this.entry = this.users;
    this.addEditEntryActivated = true;

  }

  deleteEntry(id: any){
    if(confirm(`Are you sure you want to delete the user ${id}`)) {
      this.userService.deleteUser(this.users.Id).subscribe(response => {
        this.getArrayList();

        var displaySuccessAlert = document.getElementById('delete-success-alert');
        if(displaySuccessAlert){ displaySuccessAlert.style.display = "block"; }
  
        setTimeout(() => {
          if(displaySuccessAlert) { displaySuccessAlert.style.display = "none"; }
        }, 5000);
        this.entryList$ = this.userService.getUserById(this.users.Id);

      }, err => {      
        var displayErrorAlert = document.getElementById('error-alert');      
        if(displayErrorAlert){ displayErrorAlert.style.display = "block"; }
        setTimeout(() => {
          if(displayErrorAlert) { displayErrorAlert.style.display = "none"; }
        }, 5000);
        console.log('See error: ', err); // use logs
      });
    }
  }

  getArrayList() {
      this.entryList$.subscribe(resp => {
        this.filteredEntryList = [];
        resp.forEach(item => {
          this.filteredEntryList.push(item);     
        });
      })
  }
  
  onInputSearch(searchValue: string) {    
    if(searchValue === ''){
      this.getArrayList();
    }
    else {
      this.filteredEntryList = this.filteredEntryList.filter(response => {
        return response.name.toLocaleLowerCase().match(searchValue.toLocaleLowerCase());
      })
    }
  }

  onRefresh() {    
    this.getArrayList();
  }

  
}
