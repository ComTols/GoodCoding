import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseChartComponent } from './database-chart.component';

describe('DatabaseChartComponent', () => {
  let component: DatabaseChartComponent;
  let fixture: ComponentFixture<DatabaseChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatabaseChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
