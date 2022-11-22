import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, observable } from 'rxjs';
import { PhonebookApiService } from 'src/app/Shared/phonebook-api.service';

@Component({
  selector: 'app-add-edit-entry',
  templateUrl: './add-edit-entry.component.html',
  styleUrls: ['./add-edit-entry.component.css']
})
export class AddEditEntryComponent implements OnInit {

  phonebookList$! : Observable<any[]>;
  entryList$!: Observable<any[]>;

  @Input() entry:  any = {
    id: 0,
    name: "Kg",
    phoneNumber: "",
    phonebookId: 0,
    phonebook: {
      id: 1,
      name: "Chat App Phonebook"
    }
   };
  Id: number = 0 ;
  Name: string = '';
  PhoneNumber: string = '';
  PhonebookId: number = 1;

  @Output() list : EventEmitter<any> = new EventEmitter<any>();

  constructor(private apiService: PhonebookApiService) { }

  ngOnInit(): void {
    this.Id = this.entry.Id;
    this.Name = this.entry.Name;
    this.PhoneNumber = this.entry.Phonebook;
    this.PhonebookId = this.entry.PhonebookId;

    this.getAllEntries();
  }

  getAllEntries() {    
    this.entryList$ = this.apiService.getEntryList();
  }

  getAllEntriesAfterAdd() {    
    this.list.emit(this.getAllEntries());
  }


  AddPhonebookEntry() {
    console.log('entry to be added: ', this.entry);
    this.apiService.addEntry(this.entry).subscribe(response => {
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

  UpdatePhonebookEntry() {
    this.apiService.updateEntry(this.entry.id,this.entry).subscribe(response => {
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
