import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PhonebookApiService } from 'src/app/Shared/phonebook-api.service';

@Component({
  selector: 'app-view-phonebook',
  templateUrl: './view-phonebook.component.html',
  styleUrls: ['./view-phonebook.component.css']
})
export class ViewPhonebookComponent implements OnInit {

  entryList$!: Observable<any[]>;
  filteredEntryList: any[] = [];
  phonebookEntrylist$!: Observable<any>[]; 

  modalTitle: string = '';
  addEditEntryActivated: boolean = false;
  entry:  any = {
    id: 0,
    name: "Kg",
    phoneNumber: "",
    phonebookId: 0,
    phonebook: {
      id: 1,
      name: "Chat App Phonebook"
    }
   } ;
  
  searchText: string = '';

  constructor(private apiService: PhonebookApiService, private router: Router) { }

  isAuthenticated() {
    const token = localStorage.getItem("JwtToken");
    if(token){
      return true;
    }
    else {
      return false;
    }
  }

  ngOnInit(): void {
    this.entryList$ = this.apiService.getEntryList();

    if(this.entryList$){
    this.getArrayList();
    }
  }
    
  modalClose() {
    this.addEditEntryActivated = false;
    this.entryList$ = this.apiService.getEntryList();
  }

  AddEntry() {
    this.entry = {
      id:0,
      name: null,
      phoneNumber: null,
      phonebookId: null
    }
    this.modalTitle = "Add Phonebook Entry";
    this.addEditEntryActivated = true;
  }

  editModal(entry:any) {
    this.entry = entry;
    this.addEditEntryActivated = true;

  }

  deleteEntry(entry: any){
    if(confirm(`Are you sure you want to delete phonebook entry ${entry.id}`)) {
      this.apiService.deleteEntry(entry.id).subscribe(response => {
        this.getArrayList();

        var displaySuccessAlert = document.getElementById('delete-success-alert');
        if(displaySuccessAlert){ displaySuccessAlert.style.display = "block"; }
  
        setTimeout(() => {
          if(displaySuccessAlert) { displaySuccessAlert.style.display = "none"; }
        }, 5000);
        this.entryList$ = this.apiService.getEntryList();

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