import { Router } from '@angular/router';
import { ClientService } from './../client.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

interface message {
	head: string,
	body: string,
	toClass?: string,
	send: Date
	liveTime: number,
	isNew?: boolean
}

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

	username: string = localStorage.getItem("username");

	public messages: message[] = [{
		head: "Keine Aufträge",
		body: "Es sind noch keine Aufträge für dich vorhanden",
		send: new Date(),
		liveTime: 36288000000,
		isNew: false
	}];

	public newMessagesNum: number = 0;

	constructor(
		private router: Router,
		private service: ClientService,
		private _bottomSheet: MatBottomSheet
	) { }

	ngOnInit() {
		this.getMessages();
		setInterval(() => {
			this.getMessages();
		}, 300000);
		this.service.sendDataToServerApi("getFreeSpace").subscribe(
			(res: { acces: string, used: number, available: number }) => {
				this.storageChartData = [{ data: [res.used, (res.available - res.used)] }];
				console.debug(res);
			},
			err => {
				console.error(err);
			}
		);
	}

	getMessages() {
		this.service.sendDataToServerApi("getMessages").subscribe(
			(res: { acces: string, messagesToMe: message[] }) => {
				console.debug(res);
				if (res.messagesToMe.length != 0) {
					this.messages = res.messagesToMe;

					this.messages.forEach(e => {
						e.send = new Date(e.send);
						if ((e.send.getTime() + e.liveTime) > new Date().getTime()) {
							e.isNew = true;
							this.newMessagesNum++;
						} else {
							e.isNew = false;
						}
					});
				}
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
				showActions: false
			}
		});
	}

}

@Component({
	selector: 'bottom-sheet-message',
	templateUrl: 'bottom-sheet.compnent.html',
})
export class BottomSheetMessage {
	constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetMessage>, @Inject(MAT_BOTTOM_SHEET_DATA) public data: { message: message, showActions: boolean }) { }

	openLink(event: MouseEvent): void {
		this._bottomSheetRef.dismiss();
		event.preventDefault();
	}
}