import { ClientService } from './../client.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-all',
	templateUrl: './all.component.html',
	styleUrls: ['./all.component.css']
})
export class AllComponent implements OnInit {

	data: { class: string, users: { forename: string, name: string, url: string }[] }[] = new Array;

	ergebnisCorrect: string;
	ergebnisError: string;
	waitForServer: boolean;

	constructor(
		private router: Router,
		private service: ClientService
	) {
		//TODO: Hole alle User vom Server
	}

	ngOnInit(): void {
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
				console.log(err);
				this.service.openSnackBar("Der Server antwortet nicht. Bitte wenden Sie sich an einen Administrator!", "Okay");
				this.router.navigate([""]);
			}
		);
		this.waitForServer = true;
		setInterval(() => {
			this.service.sendDataToServerApi('getAllSites').subscribe(
				(res: { acces: string, sitesAvailable: { domain: string, cours: string, name: string, forename: string }[] }) => {
					this.waitForServer = false;
					console.log(res);
					this.ergebnisCorrect = JSON.stringify(res);
					res.sitesAvailable.forEach(element => {
						var classFound: boolean = false;
						for (let i = 0; i < this.data.length; i++) {
							if (this.data[i].class == element.cours) {
								var userFound: boolean = false;
								for (let j = 0; j < this.data[i].users.length; j++) {
									if (this.data[i].users[j].url == element.domain) {
										userFound = true;
									}
								}
								if (!userFound) {
									this.data[i].users.push({
										forename: element.forename,
										name: element.name,
										url: element.domain
									});
								}
								classFound = true;
							}
						}
						if (!classFound) {
							this.data.push({
								class: element.cours,
								users: [
									{
										forename: element.forename,
										name: element.name,
										url: element.domain
									}
								]
							});
						}
					});
				},
				err => {
					console.log(err);
					this.ergebnisError = err.error.text + " -> FEHLER";

				}
			)
		}, 1000);
	}

}
