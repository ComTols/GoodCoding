import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddClassDialogComponent } from '../admin-sverw.component';

@Component({
	selector: 'app-allow-user',
	templateUrl: './allow-user.component.html',
	styleUrls: ['./allow-user.component.css']
})
export class AllowUserComponent implements OnInit {

	users: { username: string, forename: string, lastname: string, databases: number, cours: string }[] = [];

	@Input() allowUsers: string[];
	@Input() courses: {}[];
	@Output() finish: EventEmitter<{}[]> = new EventEmitter();

	constructor(private dialog: MatDialog) { }

	ngOnInit(): void {
	}

	onClickBack() {
		this.finish.emit(undefined);
	}

	onClickSave() {
		this.finish.emit(this.users);
	}

	onClickAddClass() {
		const dialogRef = this.dialog.open(AddClassDialogComponent);
		dialogRef.afterClosed().subscribe(result => {
			if (result != false) {
				this.courses.push({
					class: result,
					member: []
				})
			}
		});
	}

	forename(username: string, event) {
		var wasFound: boolean = false;
		this.users.forEach(e => {
			if (e.username == username) {
				e.forename = event.target.value;
				wasFound = true;
			}
		});
		if (!wasFound) {
			this.users.push({
				username: username,
				forename: event.target.value,
				lastname: "",
				databases: 0,
				cours: ""
			});
		}
	}

	lastname(username: string, event) {
		var wasFound: boolean = false;
		this.users.forEach(e => {
			if (e.username == username) {
				e.lastname = event.target.value;
				wasFound = true;
			}
		});
		if (!wasFound) {
			this.users.push({
				username: username,
				forename: "",
				lastname: event.target.value,
				databases: 0,
				cours: ""
			});
		}
	}

	databases(username: string, event) {
		var wasFound: boolean = false;
		this.users.forEach(e => {
			if (e.username == username) {
				e.databases = event.target.value;
				wasFound = true;
			}
		});
		if (!wasFound) {
			this.users.push({
				username: username,
				forename: "",
				lastname: "",
				databases: event.target.value,
				cours: ""
			});
		}
	}

	course(username: string, event) {
		var wasFound: boolean = false;
		this.users.forEach(e => {
			if (e.username == username) {
				e.cours = event.value.class;
				wasFound = true;
			}
		});
		if (!wasFound) {
			this.users.push({
				username: username,
				forename: "",
				lastname: "",
				databases: event.value.class,
				cours: ""
			});
		}
	}

}
