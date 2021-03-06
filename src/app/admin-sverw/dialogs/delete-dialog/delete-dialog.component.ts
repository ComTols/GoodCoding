import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
	selector: 'app-delete-dialog',
	templateUrl: './delete-dialog.component.html',
	styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {

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
