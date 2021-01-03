import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ClientService } from '../client.service';

export interface message {
	from: user,
	head: string,
	body: string,
	toClass: boolean
}

interface user {
	username: string,
	forename: string,
	lastname: string,
	class: string
}

@Component({
	selector: 'app-admin-dashboard',
	templateUrl: './admin-dashboard.component.html',
	styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {

	@ViewChildren(BaseChartDirective) public charts: QueryList<BaseChartDirective>;

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

	public cpuChartOptions = {
		scaleShowVerticalLines: false,
		responsive: true,
		scales: {
			yAxes: [{
				ticks: {
					beginAtZero: true
				}
			}]
		}
	}
	public cpuChartLabels: any[] = new Array;
	public cpuChartType = 'line';
	public cpuChartLegend = false;
	public cpuChartData = [{ data: [] }];
	interval: any;

	public totalMemory: number = 0;
	public memoryProgress: number = 0;
	public memoryBuffer: number = 100;
	public cpu: number = 0;

	public username: string = localStorage.getItem("username");

	public messages: message[] = [{
		from: {
			username: "",
			forename: "Sie haben noch keine Nachrichten erhalten.",
			lastname: "",
			class: ""
		},
		head: "Keine Nachrichten!",
		body: "",
		toClass: false
	}];

	constructor(
		private router: Router,
		private service: ClientService
	) {
		for (var i: number = -60; i <= 0; i++) {
			this.memoryChartLabels.push(i);
			this.memoryChartData[0].data.push(0);
			this.cpuChartLabels.push(i);
			this.cpuChartData[0].data.push(0);
		}
	}
	ngAfterViewInit(): void {
		console.log(this.charts);

		setInterval(() => {
			this.service.sendDataToServerApi("memory").subscribe(
				(res: { acces: string, total: number, used: number, free: number, shared: number, buffChache: number, available: number }) => {
					this.memoryChartData[0].data.shift();
					this.memoryChartData[0].data.push(res.used);
					this.charts.toArray()[1].chart.update();
					this.totalMemory = res.total;
					this.memoryProgress = res.used / res.total * 100;
					this.memoryBuffer = 100 - ((res.available - res.free) / res.total * 100);
				},
				err => {
					console.log(err);
				}
			);
			this.service.sendDataToServerApi("cpu").subscribe(
				(res: { acces: string, workload1min: number, workload5min: number, workload15min: number }) => {
					this.cpuChartData[0].data.shift();
					this.cpuChartData[0].data.push(res.workload1min);
					this.charts.toArray()[2].chart.update();
					this.cpu = res.workload1min;
				},
				err => {
					console.log(err);
				}
			);
		}, 1000);
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
				this.service.openSnackBar("Der Server antwortet nicht. Bitte wenden Sie sich an einen Administrator!", "Okay");
				this.router.navigate([""]);
			}
		);
		setInterval(() => {
			this.service.sendDataToServerApi("getMessages").subscribe(
				(res: { acces: string, messagesToMe: message[] }) => {
					console.log(res);
					if (res.messagesToMe.length != 0) {
						this.messages = res.messagesToMe;
					}
				},
				err => {
					console.log(err);
				}
			);
		}, 15000);
	}

	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		clearInterval(this.interval);
	}


}
