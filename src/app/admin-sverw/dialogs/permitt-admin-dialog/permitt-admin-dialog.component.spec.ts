import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermittAdminDialogComponent } from './permitt-admin-dialog.component';

describe('PermittAdminDialogComponent', () => {
  let component: PermittAdminDialogComponent;
  let fixture: ComponentFixture<PermittAdminDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermittAdminDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermittAdminDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
