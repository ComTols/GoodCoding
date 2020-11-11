import { Component, OnInit } from '@angular/core';
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

	data: { class: string, member: { username: string, forename: string, lastname: string, lastLogin: string, noDatabase: number, selected: boolean }[] }[] = [{
		class: "teacher",
		member: [{
			username: "tesla",
			forename: "Nikola",
			lastname: "Tesla",
			lastLogin: "02.11.2020 - 17:59",
			noDatabase: 1,
			selected: false
		}, {
			username: "schuelma",
			forename: "Maximilian",
			lastname: "Schüller",
			lastLogin: "09.07.2020 - 21:00",
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
	}


	onClickCheckbox(username: string) {
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
	onClickEdit(username: String) {
		console.log(username);
		this.isEdit = true;
		this.data.forEach(element => {
			element.member.forEach(e => {
				if (e.username == username) {
					this.editUsers = [e];
				}
			});
		});
	}
	onClickEditAll(cours: String) {
		console.log(cours);
		this.editUsers = [];
		this.data.forEach(element => {
			if(element.class == cours) {
				element.member.forEach(e => {
					if(e.selected == true) {
						this.editUsers.push(e);
						console.log(this.editUsers);
					}
				});
			}
		});
		if(this.editUsers.length > 0) {
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
		const dialogRef= this.dialog.open(AddClassDialogComponent);
		dialogRef.afterClosed().subscribe(result => {
				//TODO: Klasse hinzufügen
		});
	}
	onClickBack() {
		this.isEdit = false;
	}
	onClickSave() {
		this.isEdit = false;
		//TODO: An Server senden
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