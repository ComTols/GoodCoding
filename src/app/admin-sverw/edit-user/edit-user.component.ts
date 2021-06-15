import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddClassDialogComponent } from '../admin-sverw.component';

@Component({
	selector: 'app-edit-user',
	templateUrl: './edit-user.component.html',
	styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

	constructor(private dialog: MatDialog) { }

	@Input() editArray: { username: string, forename: string, lastname: string }[];
	@Input() coursList;

	@Output() finish: EventEmitter<{ username: string, forename: string, lastname: string }[]> = new EventEmitter();

	ngOnInit(): void {
	}

	onClickAddClass() {
		const dialogRef = this.dialog.open(AddClassDialogComponent);
		dialogRef.afterClosed().subscribe(result => {
			if (result != false) {
				this.coursList.push({
					class: result,
					member: []
				})
			}
		});
	}

	onClickSave() {
		this.finish.emit(this.editArray);
	}

	onClickBack() {
		this.finish.emit(undefined);
	}

}
