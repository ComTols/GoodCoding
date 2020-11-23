import { PermittAdminDialogComponent } from './dialogs/permitt-admin-dialog/permitt-admin-dialog.component';
import { LockDialogComponent } from './dialogs/lock-dialog/lock-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';
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
	dataWaiting: { username: string, lastLogin: string, selected: boolean }[] = [];
	editUsers: { username: string, forename: string, lastname: string }[] = [];
	giveAccesToUsers: string[] = [];
	refresh: string[] = [];

	isEdit: boolean = false;
	isNewUser: boolean = false;
	isAllowAccess: boolean = false;

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
					//console.log(this.data);
					//console.log(res);
					this.awaitServerResponse = false;
					this.ergebnisCorrect = JSON.stringify(res);
					//Wartende Nutzer
					if (res.waitingUsers.length > 0) {
						for (let i = 0; i < res.waitingUsers.length; i++) {
							var isAlreadyIn: boolean = false;
							for (let j = 0; j < this.dataWaiting.length; j++) {
								if (this.dataWaiting[j].username == res.waitingUsers[i].username) {
									isAlreadyIn = true;
								}
							}
							if (!isAlreadyIn) {
								this.dataWaiting.push({
									username: res.waitingUsers[i].username,
									lastLogin: res.waitingUsers[i].lastLogin,
									selected: false
								});
								this.refresh = ["refresh"];
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
									if (this.data[j].class == res.activeUsers[i].cours) {
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
	onClickCheckboxWaitingUser(username: String) {
		console.log(username);
		this.dataWaiting.forEach(element => {
			if (element.username == username) {
				element.selected = !element.selected;
				console.log(element.selected);
			}
		});
	}

	onClickAllowAccess(username: string) {
		this.giveAccesToUsers = [username]
		this.isAllowAccess = true;
	}
	onClickAllowAccessAll() {
		this.giveAccesToUsers = [];
		this.dataWaiting.forEach(e => {
			if (e.selected) {
				this.giveAccesToUsers.push(e.username);
				e.selected = false;
			}
		});
		if (this.giveAccesToUsers.length > 0) {
			this.isAllowAccess = true;
		}
	}
	onClickDeleteWaitingUser(username: string) {
		const dialogRef = this.dialog.open(DeleteDialogComponent, { data: { mode: "singly", user: username } });
		dialogRef.afterClosed().subscribe(res => {
			if (res) {
				//TODO: Benutzer löschen
			}
		});
	}
	onClickDeleteWaitingUserAll() {
		var users: string[] = [];
		this.dataWaiting.forEach(e => {
			if (e.selected) {
				users.push(e.username);
				e.selected = !e.selected;
			}
		});
		if (users.length == 0) return;
		const dialogRef = this.dialog.open(DeleteDialogComponent, { data: { mode: "multi", users: users } });
		dialogRef.afterClosed().subscribe(res => {
			if (res) {
				//TODO: Benutzer löschen
			}
		});
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
		const dialogRef = this.dialog.open(LockDialogComponent, { data: { mode: "singly", user: username } });
		dialogRef.afterClosed().subscribe(res => {
			if (res) {
				//TODO: Benutzer sperren
			}
		});
	}
	onClickDelete(username: string) {
		const dialogRef = this.dialog.open(DeleteDialogComponent, { data: { mode: "singly", user: username } });
		dialogRef.afterClosed().subscribe(res => {
			if (res) {
				//TODO: Benutzer löschen
			}
		});
	}
	onClickAdmin(username: string) {
		const dialogRef = this.dialog.open(PermittAdminDialogComponent, { data: { mode: "singly", user: username } });
		dialogRef.afterClosed().subscribe(res => {
			if (res) {
				//TODO: Benutzer löschen
			}
		});
	}
	finishEdit(event: { username: string, forename: string, lastname: string }[]) {
		this.isEdit = false;
		if (event == undefined) {
			console.log("Bearbeiten abgebrochen!");
			return;
		}
		console.log("Sende event zum Server:");
		console.log(event);
		this.awaitServerResponse = true;
		this.service.sendDataToServerApiWithData("editUser", { editUsers: event }).subscribe(
			res => {
				this.awaitServerResponse = false;
			},
			err => {
				this.awaitServerResponse = false;
				this.service.openSnackBar("Der Benutzer konnte nicht bearbeitet werden. Bitte wenden Sie sich an einen Administartor!", "OK");
			}
		);
	}

	finishAdding(event) {
		this.isNewUser = false;
		if (event == undefined) {
			console.log("Hinzufügen abgebrochen!");
			return;
		}
		console.log("Sende event zum Server:");
		console.log(event);
		this.service.sendDataToServerApiWithData("addUser", { addedUsers: event }).subscribe(
			res => {
				this.awaitServerResponse = false;
			},
			err => {
				this.awaitServerResponse = false;
				this.service.openSnackBar("Der Benutzer konnte nicht hinzugefügt werden. Bitte wenden Sie sich an einen Administartor!", "OK");
			}
		);
	}

	finishAllowing(event) {
		this.isAllowAccess = false;
		if (event == undefined) {
			console.log("Erlauben abgebrochen");
			return;
		}
		console.log("Sende event zum Server:");
		console.log(event);
		this.service.sendDataToServerApiWithData("allowUsers", { allowedUsers: event }).subscribe(
			res => {
				this.awaitServerResponse = false;
			},
			err => {
				this.awaitServerResponse = false;
				this.service.openSnackBar("Der Zugang konnte dem Nutzer nicht erlaubt werden. Bitte wenden Sie sich an einen Administartor!", "OK");
			}
		);
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