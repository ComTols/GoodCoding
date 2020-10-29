import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-storage-chart',
	templateUrl: './storage-chart.component.html',
	styleUrls: ['./storage-chart.component.css']
})
export class StorageChartComponent implements OnInit {

	public storageChartOptions = {
		scaleShowVerticalLines: false,
		responsive: true
	}
	public storageChartLabels = ['Belegt', 'Frei'];
	public storageChartType = 'doughnut';
	public storageChartLegend = false;
	public storageChartData = [{ data: [80, 20] }];

	constructor() { }

	ngOnInit(): void {
	}

}
