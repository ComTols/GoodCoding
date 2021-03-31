import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { dirStructur } from '../files.component';

@Component({
	selector: 'app-del-dialog',
	templateUrl: './del-dialog.component.html',
	styleUrls: ['./del-dialog.component.css']
})
export class DelDialogComponent implements OnInit {

	isNotEmptyDir = false;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: { target: dirStructur }
	) {

	}

	ngOnInit(): void {
		if (this.data.target.type == "folder") {
			if (this.data.target.content != null) {

				this.data.target.content.forEach(e => {
					console.log(e.type);

					if (e.type != "arrow_back") {
						this.isNotEmptyDir = true;
						console.log("Nicht leer");

					}
				});
			}
		}
	}

}
