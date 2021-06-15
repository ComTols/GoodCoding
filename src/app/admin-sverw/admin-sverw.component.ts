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
		this.awaitServerResponse = true;
		this.refreshList();
		setInterval(() => {
			this.refreshList();
		}, 30000);
	}

	onClickNewUser() {
		this.isNewUser = true;
	}
	onClickCheckbox(username: String) {
		this.data.forEach(element => {
			element.member.forEach(e => {
				if (e.username == username) {
					e.selected = !e.selected;
				}
			});
		});
	}
	onClickCheckboxWaitingUser(username: String) {
		this.dataWaiting.forEach(element => {
			if (element.username == username) {
				element.selected = !element.selected;
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
		this.isEdit = true;
		this.data.forEach(element => {
			element.member.forEach(e => {
				if (e.username == username) {
					this.onClickCheckbox(username); //Checkbox uncheck
					this.editUsers = [e];
				}
			});
		});
	}
	onClickEditAll(cours: String) {
		this.editUsers = [];
		this.data.forEach(element => {
			if (element.class == cours) {
				element.member.forEach(e => {
					if (e.selected == true) {
						this.onClickCheckbox(e.username); //Checkbox uncheck
						this.editUsers.push(e);
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
			if (res != "false" && res != undefined) {
				this.service.sendDataToServerApiWithData("lockUser", username).subscribe(
					res => {
						console.debug(res);
					},
					err => {
						console.error(err);
					}
				)
			}
		});
	}
	onClickDelete(username: string) {
		const dialogRef = this.dialog.open(DeleteDialogComponent, { data: { mode: "singly", user: username } });
		dialogRef.afterClosed().subscribe(res => {
			if (res != "false" && res != undefined) {
				this.service.sendDataToServerApiWithData("delUser", username).subscribe(
					res => {
						console.debug(res);
					},
					err => {
						console.error(err);
					}
				)
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
			return;
		}
		console.debug(event);
		this.awaitServerResponse = true;
		this.service.sendDataToServerApiWithData("editUser", { editUsers: event }).subscribe(
			res => {
				this.awaitServerResponse = false;
				console.debug(res);
			},
			err => {
				console.error(err);
				this.awaitServerResponse = false;
				this.service.openSnackBar("Der Benutzer konnte nicht bearbeitet werden. Bitte wenden Sie sich an einen Administartor!", "OK");
			}
		);
	}

	finishAdding(event) {
		this.isNewUser = false;
		if (event == undefined) {
			return;
		}
		console.debug(event);
		this.service.sendDataToServerApiWithData("addUser", { addedUsers: event }).subscribe(
			res => {
				this.awaitServerResponse = false;
				console.debug(res);
			},
			err => {
				console.error(err);
				this.awaitServerResponse = false;
				this.service.openSnackBar("Der Benutzer konnte nicht hinzugefügt werden. Bitte wenden Sie sich an einen Administartor!", "OK");
			}
		);
	}

	finishAllowing(event) {
		this.isAllowAccess = false;
		if (event == undefined) {
			return;
		}
		console.debug(event);
		this.service.sendDataToServerApiWithData("allowUsers", { allowedUsers: event }).subscribe(
			res => {
				console.debug(res);
				this.awaitServerResponse = false;
			},
			err => {
				console.error(err);
				this.awaitServerResponse = false;
				this.service.openSnackBar("Der Zugang konnte dem Nutzer nicht erlaubt werden. Bitte wenden Sie sich an einen Administartor!", "OK");
			}
		);
	}

	private refreshList() {
		this.service.sendDataToServerApi('getStudents').subscribe(
			(res: { acces: string, waitingUsers: [{ username: string, lastLogin: string }], activeUsers: [{ username: string, cours: string, databases: number, lastLogin: string, access: string, name: string, forename: string, block: string }] }) => {
				this.awaitServerResponse = false;
				this.ergebnisCorrect = JSON.stringify(res);

				console.debug(res);


				//Für wartende Nutzer:
				res.waitingUsers.forEach(waitingUser => {
					var oldEntry: boolean = false;
					this.dataWaiting.forEach(waiting => {
						if (waiting.username == waitingUser.username) {
							oldEntry = true;
						}
					});
					if (!oldEntry) {
						this.dataWaiting.push({
							username: waitingUser.username,
							lastLogin: waitingUser.lastLogin,
							selected: false
						});
					}
				});
				for (var i: number = 0; i < this.dataWaiting.length; i++) {
					var deletEntry: boolean = true;
					res.waitingUsers.forEach(waitingUser => {
						if (this.dataWaiting[i].username == waitingUser.username) {
							deletEntry = false;
						}
					});
					if (deletEntry) {
						this.dataWaiting.splice(i, 1);
						i--;
					}
				}

				//Für bestehende Nuter:
				res.activeUsers.forEach(activUser => {
					var oldEntry: boolean = false;
					var oldClass: boolean = false;
					this.data.forEach(c => {
						if (c.class == activUser.cours) {
							oldClass = true;
							c.member.forEach(m => {
								if (m.username == activUser.username) {
									oldEntry = true;
								}
							});
							if (!oldEntry) {
								if (activUser.cours == "unknown") {
									c.member.push({
										forename: activUser.username,
										lastLogin: activUser.lastLogin,
										lastname: activUser.name,
										noDatabase: activUser.databases,
										selected: false,
										username: activUser.username
									})
								} else {
									c.member.push({
										forename: activUser.forename,
										lastLogin: activUser.lastLogin,
										lastname: activUser.name,
										noDatabase: activUser.databases,
										selected: false,
										username: activUser.username
									});
								}
							}
						}
					});
					if (!oldClass) {
						if (activUser.cours == "unknown") {
							this.data.push({
								class: activUser.cours,
								member: [{
									username: activUser.username,
									forename: activUser.username,
									lastname: activUser.name,
									lastLogin: activUser.lastLogin,
									noDatabase: activUser.databases,
									selected: false
								}]
							});
						} else {
							this.data.push({
								class: activUser.cours,
								member: [{
									username: activUser.username,
									forename: activUser.forename,
									lastname: activUser.name,
									lastLogin: activUser.lastLogin,
									noDatabase: activUser.databases,
									selected: false
								}]
							});
						}
					}
				});
				for (var i: number = 0; i < this.data.length; i++) {
					var deletClass: boolean = true;
					res.activeUsers.forEach(activeUser => {
						if (this.data[i].class == activeUser.cours) {
							deletClass = false;
						}
					});
					if (deletClass) {
						this.data.splice(i, 1);
						i--;
					} else {

						var memberLenght: number = this.data[i].member.length;
						for (var j: number = 0; j < memberLenght; j++) {

							var deletMember: boolean = true;
							res.activeUsers.forEach(activeUser => {
								if (this.data[i].member[j].username == activeUser.username) {
									deletMember = false;
								}
							});
							if (deletMember) {
								this.data[i].member.splice(j, 1);
								j--;
							}
						}
					}
				}
				//Refresh:
				this.refresh = [Math.random().toString()]
			},
			err => {
				console.error(err);
				this.ergebnisError = err.error.text + " -> FEHLER";

			}
		)
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