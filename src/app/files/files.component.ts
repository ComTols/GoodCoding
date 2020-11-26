import { Router } from '@angular/router';
import { MoveDialogComponent } from './move-dialog/move-dialog.component';
import { DelDialogComponent } from './del-dialog/del-dialog.component';
import { RenameDialogComponent } from './rename-dialog/rename-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from '../client.service';


interface dirStructur {
	name: string,
	type: string,
	size?: number,
	lastModified?: string,
	content?: dirStructur[]
}

@Component({
	selector: 'app-files',
	templateUrl: './files.component.html',
	styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {

	dataSource: dirStructur[] = [];
	displayedColumns: string[] = ['type', 'name', 'size', 'lastChange', 'action'];
	fullFileTree: dirStructur[] = [];
	path: string[] = ["/"];
	awaitingServerResponse: boolean = true;

	refresh: string[] = ["refresh"];
	ergebnisError: string;
	ergebnisCorrect: string;

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

		setInterval(() => {
			this.service.sendDataToServerApiWithData('getDir', { path: '/home/marianum/public_html' }).subscribe(
				(res: { acces: string, dirTree: dirStructur[] }) => {
					this.awaitingServerResponse = false;
					this.fullFileTree = res.dirTree;

					this.refreschTable();

					console.log(this.dataSource);
					this.ergebnisCorrect = JSON.stringify(res);
				},
				err => {
					console.log(err);
					this.ergebnisError = err.error.text + " -> FEHLER";

				}
			)
		}, 5000);
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
				console.log(result);
				//TODO: Verschieben
			}
		});
	}
	public onClickDetails(target) {
		console.log(target);

	}

	refreschTable() {
		var dirContent: dirStructur[];
		this.path.forEach(e => {
			if (e == "/") {
				dirContent = this.fullFileTree;
			} else {
				for (var i: number = 0; i < dirContent.length; i++) {
					if (e == dirContent[i].name) {
						dirContent = dirContent[i].content;
					}
				}
			}
		});
		for (var j: number = 0; j < dirContent.length; j++) {
			if (dirContent[j].type == "file") {
				dirContent[j].type = "description";
			} else if (dirContent[j].type == "dir") {
				dirContent[j].type = "folder";
			}
		}
		if (this.path.length > 1) {
			dirContent.unshift({
				name: "Zurück ...",
				type: "arrow_back"
			});
		}
		this.dataSource = dirContent;
		this.refresh = [Math.random().toString()];
	}

	onClickFolder(name: string) {
		this.path.push(name);
		this.refreschTable();
	}

	onClickBack() {
		this.path.pop();
		this.refreschTable();
	}
}
