import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSverwComponent } from './admin-sverw.component';

describe('AdminSverwComponent', () => {
  let component: AdminSverwComponent;
  let fixture: ComponentFixture<AdminSverwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSverwComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSverwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
