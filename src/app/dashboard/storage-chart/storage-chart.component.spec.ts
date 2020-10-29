import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageChartComponent } from './storage-chart.component';

describe('StorageChartComponent', () => {
  let component: StorageChartComponent;
  let fixture: ComponentFixture<StorageChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorageChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
