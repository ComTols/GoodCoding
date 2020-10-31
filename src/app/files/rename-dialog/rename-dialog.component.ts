import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-rename-dialog',
	templateUrl: './rename-dialog.component.html',
	styleUrls: ['./rename-dialog.component.css']
})
export class RenameDialogComponent implements OnInit {

	newNameGroup: FormGroup = new FormGroup({
		newName: new FormControl(null, [Validators.required])
	});

	constructor(
		public dialogRef: MatDialogRef<RenameDialogComponent>
	) { }

	ngOnInit(): void {
	}

	onClickOkay() {
		if (this.newNameGroup.status == "VALID") {
			this.dialogRef.close(this.newNameGroup.value["newName"]);
		}
	}

}
