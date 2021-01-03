import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import 'brace';
import 'brace/ext/language_tools'
import 'brace/mode/text';
import 'brace/mode/html';
import 'brace/mode/css';
import 'brace/mode/javascript';
import 'brace/mode/typescript';
import 'brace/mode/php';
import 'brace/theme/twilight';
import 'brace/theme/github';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { dirStructur } from '../files.component';
import { ClientService } from 'src/app/client.service';

export class FileNode {
	children?: FileNode[];
	filename: string;
	type: string;
	path: string;
}

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

	config: any = {
		printMargin: false,
		enableBasicAutocompletion: true,
		enableLiveAutocompletion: true,
		focus: true
	};
	value = "text";
	theme = "twilight"
	mode = "html";
	languages: { value: string, text: string }[] = [{
		value: "html",
		text: "HTML"
	}, {
		value: "javascript",
		text: "JavaScript"
	}, {
		value: "css",
		text: "CSS"
	}, {
		value: "text",
		text: "Nur Text"
	}, {
		value: "php",
		text: "PHP"
	}, {
		value: "typescript",
		text: "TypeScript"
	}];

	source: FileNode[] = [];
	awaitingServerResponse: boolean = true;

	aktPath: string;

	ergebnisCorrect: string;
	ergebnisError: string;

	constructor(public service: ClientService, private router: Router, private route: ActivatedRoute) {
	}

	ngOnInit(): void {
		this.service.sendDataToServerApiWithData('getDir', { path: '/home/' + localStorage.getItem("username") + '/public_html' }).subscribe(
			(res: { acces: string, dirTree: dirStructur[] }) => {
				this.awaitingServerResponse = false;
				res.dirTree.forEach(e => {
					this.source.push(this.changeDirStructureToFileNode(e, "root"));
				});
				this.source.sort(function (a, b): number {
					if (a.type == b.type) {
						return 0;
					}
					var aNum: number, bNum: number;
					switch (a.type) {
						case 'file':
							aNum = 1;
							break;
						case 'dir':
							aNum = 2;
							break;
						default:
							aNum = 3;
					}
					switch (b.type) {
						case 'file':
							bNum = 1;
							break;
						case 'dir':
							bNum = 2;
							break;
						default:
							bNum = 3;
					}
					if (aNum < bNum) {
						return -1;
					}
					if (aNum > bNum) {
						return 1;
					}

				});

				console.log(this.source);
				this.ergebnisCorrect = JSON.stringify(res);
			},
			err => {
				console.log(err);
				this.ergebnisError = err.error.text + " -> FEHLER";

			}
		);
		var path: string = this.route.snapshot.params['path'];
		path = decodeURIComponent(path);
		this.getFile(path);
	}

	onChange(event: any) {
		//Ace Change
	}

	onChangeLanguage(event: { value: string; }) {
		this.mode = event.value;
	}

	onChangeDarkMode(event: { checked: any; }) {
		if (event.checked) {
			this.theme = "twilight";
		} else if (!event.checked) {
			this.theme = "github";
		}

	}

	onClickFile(path: string) {
		//TODO: Datei öffnen
		path = path.replace("root/", "");
		console.log(path);

		this.getFile(path);
	}

	private changeDirStructureToFileNode(d: dirStructur, path: string): FileNode {
		var f: FileNode = new FileNode();
		var children: FileNode[] = [];
		if (d.content?.length > 0) {
			d.content.forEach(e => {
				children.push(this.changeDirStructureToFileNode(e, path + "/" + d.name));
			});
		}
		children.sort(function (a, b): number {
			if (a.type == b.type) {
				return 0;
			}
			var aNum: number, bNum: number;
			switch (a.type) {
				case 'file':
					aNum = 1;
					break;
				case 'dir':
					aNum = 2;
					break;
				default:
					aNum = 3;
			}
			switch (b.type) {
				case 'file':
					bNum = 1;
					break;
				case 'dir':
					bNum = 2;
					break;
				default:
					bNum = 3;
			}
			if (aNum < bNum) {
				return -1;
			}
			if (aNum > bNum) {
				return 1;
			}

		});
		if (d.type == "file") {
			d.type = "description";
		}
		f = {
			filename: d.name,
			type: d.type,
			children: children,
			path: path
		}

		return f;
	}

	onClickClose() {
		console.log("Close");
		this.router.navigate(["/files"]);
	}

	onClickSave() {
		this.service.sendDataToServerApiWithData("saveFile", { path: "/home/" + localStorage.getItem("username") + "/public_html/" + this.aktPath, fileContent: this.value }).subscribe(
			(res) => {
				console.log(res);

			},
			err => {
				console.error(err);
			}
		);
	}

	private getFile(path: string) {
		if (this.aktPath != path) {
			this.service.sendDataToServerApiWithData("getFile", { path: "/home/" + localStorage.getItem("username") + "/public_html/" + path }).subscribe(
				(res: { acces: string, fileContent: string }) => {
					console.log(res);
					this.value = res.fileContent;
					this.aktPath = path;
				},
				err => {
					console.error(err);
				}
			);
		}
	}
}
