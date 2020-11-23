import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from '../client.service';

@Component({
	selector: 'app-wait',
	templateUrl: './wait.component.html',
	styleUrls: ['./wait.component.css']
})
export class WaitComponent implements OnInit {

	private interval;
	onWaitingForAccess: boolean = true;
	isError: boolean = false;
	message: string = "Du wurdest noch nicht von einer Lehrperson freigeschaltet. Bitte warte, bis du freigeschaltet wirst. Diese Seite aktualisiert automatisch. Dein Anmeldeversuch wird deinem Lehrer angezeigt.";

	constructor(
		private service: ClientService,
		private router: Router,
	) { }

	ngOnInit(): void {
		this.interval = setInterval(() => {
			this.service.sendDataToServerApi('userLogin').subscribe(
				res => {
					console.log(res);
					if (res["acces"] == "permitted") {
						this.onWaitingForAccess = false;
						this.message = "Dir wurde der Zugang gewährt. Bitte melde dich erneut an!";
						clearInterval(this.interval);
					} else if (res["acces"] == "admin") {
						this.onWaitingForAccess = false;
						this.message = "Sie haben Administartorrechte erhalten. Bitte melden Sie sich erneut an!";
						clearInterval(this.interval);
					} else if (res["acces"] == "wait") {
						this.onWaitingForAccess = true;
					} else if (res["acces"] == "denied") {
						this.service.openSnackBar("Dir wurde der Zugang verweigert. Bitte wende dich an einen Administartor", "OK");
						this.onWaitingForAccess = false;
						clearInterval(this.interval);
					}
				},
				err => {
					console.log(err);
					this.onWaitingForAccess = false;
					this.message = "Ein Fehler ist aufgetreten!";
					this.isError = true;
					this.service.openSnackBar("Ein fehler ist aufgetreten. Bitte wende dich an einen Administartor!", "OK");
					clearInterval(this.interval);
				}
			)
		}, 10000);
	}

	onClickLogin() {
		this.router.navigate(["/"]);
	}

}
