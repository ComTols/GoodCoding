import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowUserComponent } from './allow-user.component';

describe('AllowUserComponent', () => {
  let component: AllowUserComponent;
  let fixture: ComponentFixture<AllowUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllowUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
