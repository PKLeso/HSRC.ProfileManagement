import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalRAuthComponent } from './signal-r-auth.component';

describe('SignalRAuthComponent', () => {
  let component: SignalRAuthComponent;
  let fixture: ComponentFixture<SignalRAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignalRAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignalRAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
