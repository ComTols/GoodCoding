import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
	selector: 'app-lock-dialog',
	templateUrl: './lock-dialog.component.html',
	styleUrls: ['./lock-dialog.component.css']
})
export class LockDialogComponent implements OnInit {

	isSingel: boolean = false;
	isMulti: boolean = false;
	multiData: string[] = [];
	singelData: string;

	constructor(
		public dialogRef: MatDialogRef<DeleteDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { mode: string, user?: string, users?: string[] }
	) { }

	ngOnInit(): void {
		if (this.data.mode == "singly") {
			this.isSingel = true;
			this.singelData = this.data.user;
		} else if (this.data.mode == "multi") {
			this.isMulti = true;
			this.data.users.forEach(e => {
				this.multiData.push(e);
			});
		}
	}

}
