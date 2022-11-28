import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEntryComponent } from './add-edit-entry.component';

describe('AddEditEntryComponent', () => {
  let component: AddEditEntryComponent;
  let fixture: ComponentFixture<AddEditEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
