import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPhonebookComponent } from './view-phonebook.component';

describe('ViewPhonebookComponent', () => {
  let component: ViewPhonebookComponent;
  let fixture: ComponentFixture<ViewPhonebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPhonebookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPhonebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
