import { Component, OnInit, ViewChild, ValueProvider, ViewEncapsulation } from '@angular/core';
import { employeeDetails, employeeData, customerData } from 'src/assets/data';
import {
  GridComponent, ToolbarService, ExcelExportService, PdfExportService,
  GroupService, ExcelQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs
} from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-navigations'
import { UserService } from '../_services/user.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserAuthService } from '../_services/user-auth.service';
// import { ExcelService } from '../_services/excel-service';
import * as XLSX  from 'xlsx';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ToolbarService, ExcelExportService, PdfExportService, GroupService]
})
export class AdminComponent implements OnInit {
    
  data: any[];
  users$!: Observable<any[]>;
  filteredEntryList: any[] = [];
  Id:any;
  fileName = 'User-Data.xlsx';
  columns: any[];

  modalTitle: string = '';
  addEditEntryActivated: boolean = false;
  entry:  any = {
    id: "123sdf",
    firstName: "Ff",
    lastName: "Kg",
    email: "kagiso@v.com",
    role: ["User"],
    status: "Pending",
    imagePath: ""
   } ;
  
  searchText: string = '';
  url = "./assets/img/city.jpg";
    
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.columns = ['Profile Picture','First Name','Last Name','Email', 'Status'];
    this.users$ = this.userService.getUsers();

    if(this.users$){
      this.getArrayList();
      }
  }
  
public createImagePath = (serverPath: string) => {
  return this.userService.PATH_OF_API + `${serverPath}`;
}

  getArrayList() {
    this.users$.subscribe(resp => {
      this.filteredEntryList = [];
      resp.forEach(item => {
        this.filteredEntryList.push(item);     
        console.log('users: ', this.filteredEntryList);
      });
    })
    console.log('users: ', this.filteredEntryList);
}

exportExcel() {
    this.userService.exportToExcel();
}

AddEntry() {
    this.entry = {
      id: null,
      firstName: null,
      lastName: null,
      email: null,
      role: [],
      status: null,
      imagePath: null
    }
    this.modalTitle = "Add User";
    this.addEditEntryActivated = true;
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

  modalClose() {
    this.addEditEntryActivated = false;
    this.users$ = this.userService.getUsers();
  }

  editModal(entry:any) {
    console.log('edit entry: ', entry)
    this.entry = entry;
    this.addEditEntryActivated = true;
  }

  deleteEntry(entry: any){
    if(confirm(`Are you sure you want to delete user profile for ${entry.firstName} ${entry.lastName}`)) {
      this.userService.deleteUser(entry.id).subscribe(response => {
        this.getArrayList();

        var displaySuccessAlert = document.getElementById('delete-success-alert');
        if(displaySuccessAlert){ displaySuccessAlert.style.display = "block"; }
  
        setTimeout(() => {
          if(displaySuccessAlert) { displaySuccessAlert.style.display = "none"; }
        }, 5000);
        this.users$ = this.userService.getUsers();

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

  onRefresh() {    
    this.getArrayList();
  }

  onInputSearch(searchValue: string) {    
    if(searchValue === ''){
      this.getArrayList();
    }
    else {
      this.filteredEntryList = this.filteredEntryList.filter(response => {
        return response.status.toLocaleLowerCase().match(searchValue.toLocaleLowerCase());
      })
    }
  }

  exportToExcel() {
    let element = document.getElementById('user-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
     
    
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
    //this.excelService.exportAsExcelFile('User Report', '', this.columns, this.data, [], 'user-report', 'Sheet1');
  }


}
