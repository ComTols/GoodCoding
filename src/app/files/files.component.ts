import { Router } from '@angular/router';
import { MoveDialogComponent } from './move-dialog/move-dialog.component';
import { DelDialogComponent } from './del-dialog/del-dialog.component';
import { RenameDialogComponent } from './rename-dialog/rename-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from '../client.service';

@Component({
	selector: 'app-files',
	templateUrl: './files.component.html',
	styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {

	dataSource: { type, name, size, lastChange }[] = [{ type: 'description', name: 'test', size: '5mb', lastChange: 'heute' }, { type: 'description', name: 'test2', size: '15mb', lastChange: 'morgen' }];
	displayedColumns: string[] = ['type', 'name', 'size', 'lastChange', 'action'];

	constructor(
		public service: ClientService,
		public dialog: MatDialog,
		public router: Router
	) {
		service.sendDataToServerApi('getFiles').subscribe(
			res => {
				//TODO: dataSource auffüllen
			},
			err => {
				console.log(err);
				service.openSnackBar("Der Server antwortet nicht. Bitte wenden Sie sich an einen Administrator!", "Okay");
			}
		);
	}

	ngOnInit(): void {
		this.service.sendDataToServerApi('userLogin').subscribe(
			res => {
				if (res["acces"] == "denied") {
					this.service.openSnackBar("Bitte überprüfen Sie Ihre Eingabe! Die Kombination aus Benutzername und Passwort existiert nicht.", "Okay");
					this.router.navigate([""]);
				} else if (res["acces"] == "permitted") {
					console.log("Zugang gewährt");
				} else if (res["acces"] == "admin") {
					console.log("Zugang akzeptiert! Adminrechte zugewiesen.");
					//TODO: Weiterleitung zu Admin-Bereich
				}
			},
			err => {
				console.log(err);
				this.service.openSnackBar("Der Server antwortet nicht. Bitte wenden Sie sich an einen Administrator!", "Okay");
				this.router.navigate([""]);
			}
		);
	}

	public onClickDel(target) {
		console.log(target);
		let dialogRef = this.dialog.open(DelDialogComponent);
		dialogRef.afterClosed().subscribe(result => {
			if (result != false) {
				//TODO: löschen
			}
		});
	}

	public onClickRename(target) {
		let dialogRef = this.dialog.open(RenameDialogComponent);
		dialogRef.afterClosed().subscribe(result => {
			if (result != false) {
				//TODO: Umbenennen
			}
		});
		console.log(target);

	}
	public onClickMove(target) {
		console.log(target);
		console.log(target);
		let dialogRef = this.dialog.open(MoveDialogComponent);
		dialogRef.afterClosed().subscribe(result => {
			if (result != false) {
				//TODO: löschen
			}
		});
	}
	public onClickDetails(target) {
		console.log(target);

	}
}
