import { ClientService } from './../client.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-all',
	templateUrl: './all.component.html',
	styleUrls: ['./all.component.css']
})
export class AllComponent implements OnInit {

	data: { class: string, users: { forename: string, name: string, url: string }[] }[] = [
		{
			class: '11a',
			users: [
				{ forename: 'Maximilian', name: 'Schüller', url: 'http://80.151.1.57:1180/' },
				{ forename: 'David', name: 'Lemming', url: 'http://www.ismycomputeron.com/' }
			]
		}
	];

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
	}

}
