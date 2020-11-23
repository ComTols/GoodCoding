import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from '../client.service';

@Component({
	selector: 'app-admin-dashboard',
	templateUrl: './admin-dashboard.component.html',
	styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

	public storageChartOptions = {
		scaleShowVerticalLines: false,
		responsive: true
	}
	public storageChartLabels = ['Belegt', 'Frei'];
	public storageChartType = 'doughnut';
	public storageChartLegend = false;
	public storageChartData = [{ data: [80, 20] }];

	public memoryChartOptions = {
		scaleShowVerticalLines: false,
		responsive: true
	}
	public memoryChartLabels: any[] = new Array;
	public memoryChartType = 'line';
	public memoryChartLegend = false;
	public memoryChartData = [{ data: [] }];
	interval: any;

	constructor(
		private router: Router,
		private service: ClientService
	) {
		for (var i: number = -60; i <= 0; i++) {
			this.memoryChartLabels.push(i);
			this.memoryChartData[0].data.push(0);
		}
		this.requestMemory();
	}

	ngOnInit(): void {
		this.service.sendDataToServerApi('userLogin').subscribe(
			res => {
				if (res["acces"] == "denied") {
					this.service.openSnackBar("Bitte überprüfen Sie Ihre Eingabe! Die Kombination aus Benutzername und Passwort existiert nicht.", "Okay");
					this.router.navigate([""]);
				} else if (res["acces"] == "permitted") {
					console.log("Zugang verweigert! Keine Admin-Rechte!");
					this.service.openSnackBar("Sie haben keine Administrator-Rechte! Daher wurden Sie auf die Schülerseite weitergeleitet. Bitte wenden Sie sich an einen Administrator, um Rechte zu erhalten.", "Okay");
					this.router.navigate(["dashboard"]);
				} else if (res["acces"] == "admin") {
					console.log("Zugang akzeptiert! Adminrechte zugewiesen.");
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

				//console.log(err);
				this.service.openSnackBar("Der Server antwortet nicht. Bitte wenden Sie sich an einen Administrator!", "Okay");
				this.router.navigate([""]);
			}
		);
	}

	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		clearInterval(this.interval);
	}

	async requestMemory() {
		this.interval = setInterval(() => {
			this.service.sendDataToServerApi('memory').subscribe(
				res => {
					//console.log(res);

					if (res["acces"] != "admin") {
						console.log("Zugang verweigert! Keine Admin-Rechte!");
						this.service.openSnackBar("Sie haben keine Administrator-Rechte! Bitte wenden Sie sich an einen Administrator, um Rechte zu erhalten.", "Okay");
						this.router.navigate([""]);
						return;
					}
					/*
					{
						total: number,
						used: number,
						free: number,
						shared: number:
						buffCache: number,
						available: number
					}
					*/
					//this.memoryChartData[60] = res['used'];
				},
				err => {
					console.log(err);
					this.service.openSnackBar("Der Server antwortet nicht. Bitte wenden Sie sich an einen Administrator!", "Okay");
					//this.router.navigate([""]);
					clearInterval(this.interval);
				}
			);
			this.service.sendDataToServerApi('cpu').subscribe(
				res => {
					//console.log(res);

					if (res["acces"] != "admin") {
						console.log("Zugang verweigert! Keine Admin-Rechte!");
						this.service.openSnackBar("Sie haben keine Administrator-Rechte! Bitte wenden Sie sich an einen Administrator, um Rechte zu erhalten.", "Okay");
						this.router.navigate([""]);
						return;
					}
					/*
					{
						total: number,
						used: number,
						free: number,
						shared: number:
						buffCache: number,
						available: number
					}
					*/
					//this.memoryChartData[60] = res['used'];
				},
				err => {
					console.log(err);
					this.service.openSnackBar("Der Server antwortet nicht. Bitte wenden Sie sich an einen Administrator!", "Okay");
					//this.router.navigate([""]);
					clearInterval(this.interval);
				}
			);
		}, 1000);
	}

}
