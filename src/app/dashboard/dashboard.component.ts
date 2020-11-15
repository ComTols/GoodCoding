import { Router } from '@angular/router';
import { ClientService } from './../client.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	public storageChartOptions = {
		scaleShowVerticalLines: false,
		responsive: true
	}
	public storageChartLabels = ['Belegt', 'Frei'];
	public storageChartType = 'doughnut';
	public storageChartLegend = false;
	public storageChartData = [{ data: [80, 20] }];

	public databaseChartOptions = {
		scaleShowVerticalLines: false,
		responsive: true,
		scales: {
			yAxes: [
				{
					display: false
				}
			],
			xAxes: [
				{
					display: false
				}
			]
		}
	}
	public databaseChartLabels = ['Datenbanken'];
	public databaseChartType = 'bar';
	public databaseChartLegend = false;
	public databaseChartData = [{ data: [2], label: 'Aktiv', stack: 'a' }, { data: [1], label: 'Passiv', stack: 'a' }];

	constructor(
		private router: Router,
		private service: ClientService
	) { }

	ngOnInit() {
		this.service.sendDataToServerApi('userLogin').subscribe(
			res => {
				if (res["acces"] == "denied") {
					this.service.openSnackBar("Bitte überprüfen Sie Ihre Eingabe! Die Kombination aus Benutzername und Passwort existiert nicht.", "Okay");
					this.router.navigate([""]);
				} else if (res["acces"] == "permitted") {
					console.log("Zugang gewährt");
				} else if (res["acces"] == "admin") {
					console.log("Zugang akzeptiert! Adminrechte zugewiesen.");
					//TODO: Weiterleitung zu Admin-Bereich
				}
			},
			err => {
				console.log("Fehler gemeldet");

				//console.log(err);
				console.log("Es ist ein Fehler aufgetreten.");

				var message: string = err.error.text;
				message.replace("\\", '');
				console.log(message);
				console.log("Gut");

				console.log(err);
				this.service.openSnackBar("Der Server antwortet nicht. Bitte wenden Sie sich an einen Administrator!", "Okay");
				this.router.navigate([""]);
			}
		);
	}

}