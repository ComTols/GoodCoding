import { AfterViewInit, Component, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ClientService } from '../client.service';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { BottomSheetMessage } from '../dashboard/dashboard.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';


interface message {
	head: string,
	body: string,
	toClass?: string,
	send: Date
	liveTime: number,
	isNew?: boolean
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
		head: "Keine Aufträge",
		body: "Es sind noch keine Aufträge für dich vorhanden",
		send: new Date(),
		liveTime: 36288000000,
		isNew: false
	}];

	private classes: string[] = [];

	constructor(
		private router: Router,
		private service: ClientService,
		private _bottomSheet: MatBottomSheet,
		public dialog: MatDialog
	) {
		for (var i: number = -60; i <= 0; i++) {
			this.memoryChartLabels.push(i);
			this.memoryChartData[0].data.push(0);
			this.cpuChartLabels.push(i);
			this.cpuChartData[0].data.push(0);
		}

		this.service.sendDataToServerApi("getFreeSpace").subscribe(
			(res: { acces: string, available: number, used: number }) => {
				console.debug(res);
				this.storageChartData = [{ data: [res.used, (res.available - res.used)] }];
			},
			err => {
				console.error(err);
			}
		);
	}
	ngAfterViewInit(): void {
		setInterval(() => {
			this.service.sendDataToServerApi("memory").subscribe(
				(res: { acces: string, total: number, used: number, free: number, shared: number, buffChache: number, available: number }) => {
					this.memoryChartData[0].data.shift();
					this.memoryChartData[0].data.push(res.used);
					this.charts.toArray()[1].chart.update();
					this.totalMemory = res.total;
					this.memoryProgress = res.used / res.total * 100;
					this.memoryBuffer = 100 - ((res.available - res.free) / res.total * 100);
					console.debug(res);

				},
				err => {
					console.error(err);
				}
			);
			this.service.sendDataToServerApi("cpu").subscribe(
				(res: { acces: string, workload1min: number, workload5min: number, workload15min: number }) => {
					this.cpuChartData[0].data.shift();
					this.cpuChartData[0].data.push(res.workload1min);
					this.charts.toArray()[2].chart.update();
					this.cpu = res.workload1min;
					console.debug(res);
				},
				err => {
					console.error(err);
				}
			);
		}, 1000);

		this.service.sendDataToServerApi("needName").subscribe((res: { acces: string, needName: boolean }) => {
			console.debug(res);
			if (res.needName) {
				this.openNewNameDialog();
			}
		}, err => {
			console.error(err);

		});
	}

	openNewNameDialog() {
		let dialogRef = this.dialog.open(NeedNameDialog);
		dialogRef.afterClosed().subscribe((result: { forename: string, lastname: string }) => {
			console.debug(result);

			if (result == undefined) {
				this.openNewNameDialog();
				return;
			}

			this.service.sendDataToServerApiWithData("setName", {
				forename: result.forename,
				lastname: result.lastname
			}).subscribe((res) => {
				console.debug(res);
			}, err => {
				console.error(err);
			});

		});
	}

	ngOnInit(): void {
		this.getMessages();
		setInterval(() => {
			this.getMessages();
		}, 30000);
	}

	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		clearInterval(this.interval);
	}

	getMessages() {
		this.service.sendDataToServerApi("getMessages").subscribe(
			(res: { acces: string, allMessages: message[], allClasses: string[] }) => {
				console.debug(res);
				if (res.allMessages.length != 0) {
					this.messages = res.allMessages;

					this.messages.forEach(e => {
						e.send = new Date(e.send);
						if ((e.send.getTime() + e.liveTime) > new Date().getTime()) {
							e.isNew = true;
						} else {
							e.isNew = false;
						}
					});
				}
				this.classes = res.allClasses;
			},
			err => {
				console.error(err);
			}
		);
	}

	openBottomSheet(m: message) {
		this._bottomSheet.open(BottomSheetMessage, {
			data: {
				message: m,
				showActions: true
			}
		});
	}

	newMessage() {
		let dialogRef = this.dialog.open(NewMessageDialog, {
			width: '50%',
			data: {
				classes: this.classes
			}
		});
		dialogRef.afterClosed().subscribe((result: { subject: string, message: string, receiver: string }) => {
			if (result == undefined) return;

			this.service.sendDataToServerApiWithData("sendMessage", {
				subject: result.subject,
				message: result.message,
				receiver: result.receiver
			}).subscribe((res) => {
				console.debug(res);
			}, err => {
				console.error(err);
			});

		});
	}

}

@Component({
	selector: 'new-message-dialog',
	templateUrl: 'new-message-dialog.html',
	styleUrls: []
})
export class NewMessageDialog {


	newMessage: FormGroup = new FormGroup({
		message: new FormControl(null, [Validators.required]),
		subject: new FormControl(null, [Validators.required]),
		receiver: new FormControl(null, [Validators.required])
	});

	constructor(
		public dialogRef: MatDialogRef<NewMessageDialog>,
		@Inject(MAT_DIALOG_DATA) public data: { classes: string[] }
	) { }


	onClickSend() {
		if (!this.newMessage.valid) return;
		this.dialogRef.close({
			subject: this.newMessage.value["subject"],
			message: this.newMessage.value["message"],
			receiver: this.newMessage.value["receiver"]
		})
	}


}
@Component({
	selector: 'need-name-dialog',
	templateUrl: 'need-name-dialog.html',
	styleUrls: []
})
export class NeedNameDialog implements OnInit {


	newName: FormGroup = new FormGroup({
		forename: new FormControl(null, [Validators.required]),
		lastname: new FormControl(null, [Validators.required])
	});

	constructor(
		public dialogRef: MatDialogRef<NewMessageDialog>) { }

	ngOnInit(): void {
	}

	onClickOkay() {
		if (!this.newName.valid) return;
		this.dialogRef.close({
			forename: this.newName.value["forename"],
			lastname: this.newName.value["lastname"]
		})
	}

}

