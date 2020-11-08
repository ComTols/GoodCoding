import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../client.service';

@Component({
	selector: 'app-admin-sverw',
	templateUrl: './admin-sverw.component.html',
	styleUrls: ['./admin-sverw.component.css']
})
export class AdminSverwComponent implements OnInit {

	data: { class: string, member: { username: string, forename: string, lastname: string, lastLogin: string, noDatabase: number, selected: boolean }[] }[] = [{
		class: "teacher",
		member: [{
			username: "tesla",
			forename: "Nikola",
			lastname: "Tesla",
			lastLogin: "02.11.2020 - 17:59",
			noDatabase: 1,
			selected: false
		}]
	}, {
		class: "12c",
		member: [{
			username: "schuelma",
			forename: "Maximilian",
			lastname: "Schüller",
			lastLogin: "09.07.2020 - 21:00",
			noDatabase: 1,
			selected: false
		}]
	}];
	isEdit: boolean = false;
	editForm = new FormGroup({
		username: new FormControl(),
		forename: new FormControl(),
		lastname: new FormControl(),
		class: new FormControl()
	});
	editUsers: { username: string, forename: string, lastname: string }[] = [];
	courses: string[] = ["11a", "11b"];

	constructor(
		private router: Router,
		private service: ClientService
	) { }

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
				console.log(err);
				this.service.openSnackBar("Der Server antwortet nicht. Bitte wenden Sie sich an einen Administrator!", "Okay");
				this.router.navigate([""]);
			}
		);
	}

	onAllClick(event, klasse) {
		console.log(event);
		console.log(klasse);
		this.data.forEach(element => {
			if (element.class == klasse) {
				element.member.forEach(mem => {
					mem.selected = true;
				});
			}
		});
	}

	changeSingelCheckbox(event, row) {
		console.log(event);
		console.log(row);


	}

	onClickEdit(username: String) {
		console.log(username);
		this.isEdit = true;
		this.data.forEach(element => {
			element.member.forEach(e => {
				if (e.username == username) {
					this.editUsers.push(e);
				}
			});
		});
	}
	onClickLock(username: string) {
		console.log(username);

	}
	onClickDelete(username: string) {
		console.log(username);

	}
	onClickAdmin(username: string) {
		console.log(username);

	}

	sendEdit() {

	}

}
