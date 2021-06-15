import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddClassDialogComponent } from '../admin-sverw.component';

@Component({
	selector: 'app-new-user',
	templateUrl: './new-user.component.html',
	styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

	newUsers: { username: string, forename: string, lastname: string, course: string, databases: number }[] = [];
	countUsers: number[] = [1];

	newUserForm = new FormGroup({
		username: new FormControl(null, Validators.required),
		forename: new FormControl(),
		lastname: new FormControl(),
		class: new FormControl(null, Validators.required),
		databases: new FormControl(null, Validators.required)
	});

	@Input() courses: [{ class: string, member: [] }];
	@Output() finishAdding: EventEmitter<{}[]> = new EventEmitter();

	constructor(private dialog: MatDialog) { }

	ngOnInit(): void {
	}

	onClickSave() {
		var valid: boolean = true;
		for (var i: number = 0; i < this.newUsers.length; i++) {
			if (this.newUsers[i].username == "") {
				this.newUsers.splice(i, 1);
				i--;
			} else if (this.newUsers[i].course == "") {
				console.error("Nicht valide! Klasse nicht gesetzt!");
				valid = false;
			}
		}
		if (!valid) return;
		this.finishAdding.emit(this.newUsers);
	}

	onClickBack() {
		this.finishAdding.emit(undefined);
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

	number(event) {
		if (this.countUsers.length < event.target.value) {
			while (this.countUsers.length < event.target.value) {
				this.countUsers.push(this.countUsers.length);
			}
		} else if (this.countUsers.length > event.target.value) {
			while (this.countUsers.length > event.target.value) {
				this.countUsers.pop();
			}
		}
	}

	username(num: number, event) {
		while (this.newUsers.length <= num) {
			this.newUsers.push({
				username: "",
				forename: "",
				lastname: "",
				course: "",
				databases: 0
			});
		}
		this.newUsers[num - 1].username = event.target.value;
	}
	forename(num: number, event) {
		while (this.newUsers.length <= num) {
			this.newUsers.push({
				username: "",
				forename: "",
				lastname: "",
				course: "",
				databases: 0
			});
		}
		this.newUsers[num - 1].forename = event.target.value;
	}
	lastname(num: number, event) {
		while (this.newUsers.length <= num) {
			this.newUsers.push({
				username: "",
				forename: "",
				lastname: "",
				course: "",
				databases: 0
			});
		}
		this.newUsers[num - 1].lastname = event.target.value;
	}
	cours(num: number, event) {
		while (this.newUsers.length <= num) {
			this.newUsers.push({
				username: "",
				forename: "",
				lastname: "",
				course: "",
				databases: 0
			});
		}
		this.newUsers[num - 1].course = event.value.class;
	}
	databases(num: number, event) {
		while (this.newUsers.length <= num) {
			this.newUsers.push({
				username: "",
				forename: "",
				lastname: "",
				course: "",
				databases: 0
			});
		}
		this.newUsers[num - 1].databases = event.target.value;
	}

}
