import { NewFileComponent } from './new-file/new-file.component';
import { Router } from '@angular/router';
import { MoveDialogComponent } from './move-dialog/move-dialog.component';
import { DelDialogComponent } from './del-dialog/del-dialog.component';
import { RenameDialogComponent } from './rename-dialog/rename-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from '../client.service';
import { stringify } from '@angular/compiler/src/util';


export interface dirStructur {
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
	afuConfig = {
		multiple: true,
		formatsAllowed: ".html,.css,.scss,.js,.ts,.php,.txt,.log,.png,.jpg,.jpeg,.gif,.mp4,.mp3",
		maxSize: "90",
		uploadAPI: {
			url: "https://goodcoding.marianum-fulda.de/api.php",
			method: "POST",
			params: {
				'action': 'uploadThisFile',
				'user': localStorage.getItem("username"),
				'pass': localStorage.getItem("password"),
				'cours': localStorage.getItem("cours"),
				'target': this.path
			}
		},
		theme: "dragNDrop",
		hideProgressBar: false,
		hideResetBtn: false,
		hideSelectBtn: false,
		fileNameIndex: true,
		replaceTexts: {
			selectFileBtn: 'Datei auswählen',
			resetBtn: 'Reset',
			uploadBtn: 'Upload',
			dragNDropBox: 'Drag N Drop',
			attachPinBtn: 'Attach Files...',
			afterUploadMsg_success: 'Upload erfolgreich!',
			afterUploadMsg_error: 'Upload fehlgeschlagen!',
			sizeLimit: 'Max. Größe'
		}
	};

	refresh: string[] = ["refresh"];
	ergebnisError: string;
	ergebnisCorrect: string;

	constructor(
		public service: ClientService,
		public dialog: MatDialog,
		public router: Router
	) { }

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

		//setInterval(() => {
		this.getDir();
		//}, 5000);
	}

	public onClickDel(target) {
		let dialogRef = this.dialog.open(DelDialogComponent, {
			data: {
				target: target
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result == "true") {
				var pathFrom: string = "";
				for (let i = 1; i < this.path.length; i++) {
					pathFrom += "/";
					pathFrom += this.path[i];
				}
				pathFrom += "/" + target.name;
				console.log("Löschen von " + pathFrom);
				this.service.sendDataToServerApiWithData("delFileOrDir", pathFrom).subscribe(
					res => {
						this.getDir();
						console.log(res);
					},
					err => {
						console.error(err);
					}
				)
			}
		});
	}

	public onClickRename(target) {
		let dialogRef = this.dialog.open(RenameDialogComponent);
		dialogRef.afterClosed().subscribe(result => {
			if (result != "false") {
				var pathFrom: string = "";
				for (let i = 1; i < this.path.length; i++) {
					pathFrom += "/";
					pathFrom += this.path[i];
				}
				var pathTo: string = pathFrom + "/" + result;
				pathFrom += "/" + target.name;
				console.log("Umbenennen von " + pathFrom + " zu " + result);
				this.service.sendDataToServerApiWithData("moveFile", { from: pathFrom, to: pathTo }).subscribe(
					res => {
						this.getDir();
						console.log(res);

					},
					err => {
						console.error(err);
					}
				)
			}
		});
	}

	public onClickMove(target) {
		let dialogRef = this.dialog.open(MoveDialogComponent, {
			data: {
				tree: this.fullFileTree
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result != "false") {
				var pathFrom: string = "";
				for (let i = 1; i < this.path.length; i++) {
					pathFrom += "/";
					pathFrom += this.path[i];
				}
				pathFrom += "/" + target.name;

				var pathTo: string = "";
				for (let j = 1; j < result.length; j++) {
					pathTo += "/";
					pathTo += result[j];
				}
				pathTo += "/" + target.name;

				if (pathFrom == pathTo) {
					console.log("Verschiebe nicht");
					return;
				}
				console.log("Verschiebe von " + pathFrom + " nach " + pathTo);
				this.service.sendDataToServerApiWithData("moveFile", { from: pathFrom, to: pathTo }).subscribe(
					res => {
						this.getDir();
						console.log(res);

					},
					err => {
						console.error(err);
					}
				)
			}
		});
	}
	public onClickDetails(target) {
		console.log(target);

	}

	refreschTable() {
		var dirContent: dirStructur[] = [];
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
		if (dirContent == undefined) return;

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

	onClickFile(name: string) {
		var stringpath: string = "";
		var first: boolean = true;
		this.path.forEach(e => {
			if (first) {
				stringpath += ""
			} else {
				stringpath += e + "/";
			}
			first = false;
		})
		stringpath += name;
		stringpath = encodeURIComponent(stringpath);
		this.router.navigate(["/editor/" + stringpath]);
	}

	DocUpload(event) {
		console.log(event);
		var fails: string = "";
		event.body.uploadStatus.forEach(e => {
			if (e.status != "ok") {
				fails += e.filename + ", ";
			}
		});
		if (fails.length > 0) {
			fails = fails.substr(0, fails.length - 2);
			this.service.openSnackBar("Folgende Dateien wurden nicht hochgeladen: " + fails, "OK");
		}

		this.getDir();
	}

	getDir() {
		this.service.sendDataToServerApiWithData('getDir', { path: '/home/' + localStorage.getItem("username") + '/public_html' }).subscribe(
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
		);
	}

	onClickNewFile(event) {
		let dialogRef = this.dialog.open(NewFileComponent);
		dialogRef.afterClosed().subscribe(result => {
			if (result != "false") {
				console.log(result);

				var path: string = "";
				for (var i: number = 1; i < this.path.length; i++) {
					path += "/";
					path += this.path[i];
				}
				path += "/" + result;
				this.service.sendDataToServerApiWithData("newFile", path).subscribe(
					res => {
						this.getDir();
					},
					err => {
						console.error(err);
					}
				);
			}
		});
	}
}