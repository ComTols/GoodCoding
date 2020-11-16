import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ClientService } from '../client.service';

@Component({
	selector: 'app-admin-sverw',
	templateUrl: './admin-sverw.component.html',
	styleUrls: ['./admin-sverw.component.css']
})
export class AdminSverwComponent implements OnInit {

	data: { class: string, member: { username: string, forename: string, lastname: string, lastLogin: string, noDatabase: number, selected: boolean }[] }[] = [];
	dataWaiting: { username: string, lastLogin: string }[] = [];
	isEdit: boolean = false;
	isNewUser: boolean = false;
	isAllowAccess: boolean = false;
	editForm = new FormGroup({
		username: new FormControl(),
		forename: new FormControl(),
		lastname: new FormControl(),
		class: new FormControl()
	});
	newUserForm = new FormGroup({
		username: new FormControl(),
		forename: new FormControl(),
		lastname: new FormControl(),
		class: new FormControl(),
		databases: new FormControl()
	});
	editUsers: { username: string, forename: string, lastname: string }[] = [];

	ergebnisCorrect: string;
	ergebnisError: string;
	awaitServerResponse: boolean;

	constructor(
		private router: Router,
		private service: ClientService,
		private dialog: MatDialog
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
		this.awaitServerResponse = true;
		setInterval(() => {
			this.service.sendDataToServerApi('getStudents').subscribe(
				(res: { acces: string, waitingUsers: [{ username: string, lastLogin: string }], activeUsers: [{ username: string, cours: string, databases: number, lastLogin: string, access: string, name: string, forename: string, block: string }] }) => {
					console.log(this.dataWaiting);
					console.log(res);
					this.awaitServerResponse = false;
					this.ergebnisCorrect = JSON.stringify(res);
					//Wartende Nutzer
					if (res.waitingUsers.length > 0) {
						var isAlreadyIn: boolean = false;
						for (let i = 0; i < res.waitingUsers.length; i++) {
							for (let j = 0; j < this.dataWaiting.length; j++) {
								if (this.dataWaiting[j].username == res.waitingUsers[i].username) {
									isAlreadyIn = true;
								}
							}
							if (!isAlreadyIn) {
								this.dataWaiting.push(res.waitingUsers[i]);
							}
						}
					}

					//Aktive Nutzer
					if (res.activeUsers.length > 0) {
						var isAlreadyIn: boolean = false;
						for (let i = 0; i < res.activeUsers.length; i++) {
							for (let j = 0; j < this.data.length; j++) {
								if (this.data[j].class == res.activeUsers[i].cours) {
									for (let k = 0; k < this.data[j].member.length; k++) {
										if (this.data[j].member[k].username == res.activeUsers[i].username) {
											isAlreadyIn = true;
										}
									}
								}
							}
							if (!isAlreadyIn) {
								var foundClass: boolean = false;
								for (let j = 0; j < this.data.length; j++) {
									if (this.data[j].class = res.activeUsers[i].cours) {
										this.data[j].member.push({
											username: res.activeUsers[i].username,
											forename: res.activeUsers[i].forename,
											lastname: res.activeUsers[i].name,
											lastLogin: res.activeUsers[i].lastLogin,
											noDatabase: res.activeUsers[i].databases,
											selected: false
										});
										foundClass = true;
									}
								}
								if (!foundClass) {
									this.data.push({
										class: res.activeUsers[i].cours,
										member: [{
											username: res.activeUsers[i].username,
											forename: res.activeUsers[i].forename,
											lastname: res.activeUsers[i].name,
											lastLogin: res.activeUsers[i].lastLogin,
											noDatabase: res.activeUsers[i].databases,
											selected: false
										}]
									});
								}
							}
						}
					}
				},
				err => {
					console.log(err);
					this.ergebnisError = err.error.text + " -> FEHLER";

				}
			)
		}, 7000);
	}

	onClickNewUser() {
		this.isNewUser = true;
	}
	onClickCheckbox(username: String) {
		console.log(username);
		this.data.forEach(element => {
			element.member.forEach(e => {
				if (e.username == username) {
					e.selected = !e.selected;
					console.log(e.selected);
				}
			});
		});
	}

	onClickAllowAccess(username: string) {
		console.log(username);
		this.editUsers = [{
			username: username,
			forename: "",
			lastname: ""
		}];
		this.isEdit = true;
	}
	onClickEdit(username: String) {
		console.log(username);
		this.isEdit = true;
		this.data.forEach(element => {
			element.member.forEach(e => {
				if (e.username == username) {
					this.onClickCheckbox(username); //Checkbox uncheck
					console.log("unchecked!");
					this.editUsers = [e];
				}
			});
		});
	}
	onClickEditAll(cours: String) {
		console.log(cours);
		this.editUsers = [];
		this.data.forEach(element => {
			if (element.class == cours) {
				element.member.forEach(e => {
					if (e.selected == true) {
						this.onClickCheckbox(e.username); //Checkbox uncheck
						console.log("unchecked!");
						this.editUsers.push(e);
						console.log(this.editUsers);
					}
				});
			}
		});
		if (this.editUsers.length > 0) {
			this.isEdit = true;
		}
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
	onClickAddClass() {
		const dialogRef = this.dialog.open(AddClassDialogComponent);
		dialogRef.afterClosed().subscribe(result => {
			//TODO: Klasse hinzufügen
			console.log(result);
			if (result != false) {
				this.data.push({
					class: result,
					member: []
				})
			}
		});
	}
	onClickBack() {
		this.isEdit = false;
	}
	onClickSave() {
		this.isEdit = false;
		this.editForm.get
		this.service.sendDataToServerApiWithData("unlockNewUser", {

		})
	}

	sendEdit() {

	}

}

@Component({
	templateUrl: './add-class-dialog.html'
})
export class AddClassDialogComponent implements OnInit {



	constructor() { }

	ngOnInit(): void {
	}

}