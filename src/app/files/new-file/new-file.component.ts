import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-new-file',
	templateUrl: './new-file.component.html',
	styleUrls: ['./new-file.component.css']
})
export class NewFileComponent {

	newNameGroup: FormGroup = new FormGroup({
		newName: new FormControl(null, [Validators.required])
	});

	constructor(
		public dialogRef: MatDialogRef<NewFileComponent>
	) { }

	ngOnInit(): void {
	}

	onClickOkay() {
		if (this.newNameGroup.status == "VALID") {
			this.dialogRef.close(this.newNameGroup.value["newName"]);
		}
	}

}
