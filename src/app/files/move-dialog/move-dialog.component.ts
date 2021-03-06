import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject, } from '@angular/core';
import { dirStructur } from '../files.component';

interface dirTree {
	name: string,
	lastChange: string,
	path: string[],
	children?: dirTree[]
}

@Component({
	selector: 'app-move-dialog',
	templateUrl: './move-dialog.component.html',
	styleUrls: ['./move-dialog.component.css']
})
export class MoveDialogComponent implements OnInit {

	aktDir: dirTree[];
	dataSource: dirTree[] = [
		{
			name: "Test",
			lastChange: "gestern",
			path: ["root"],
			children: [
				{
					name: "Test2",
					lastChange: "morgen",
					path: ["root", "Test"]
				}
			]
		}, {
			name: "Test3",
			lastChange: "gestern",
			path: ["root"],
			children: [
				{
					name: "Test4",
					lastChange: "morgen",
					path: ["root", "Test3"]
				}
			]
		}
	];
	displayedColumns: string[] = ['type', 'name', 'lastChange'];
	path: string[] = ["root"];
	refresh: string[] = ["refresh"];

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: { tree: dirStructur[] }
	) {
		this.dataSource = this.recFillInDirTree(data.tree, ["root"]);
		this.aktDir = this.dataSource;
	}

	recFillInDirTree(e: dirStructur[], path: string[]): dirTree[] {
		var ret: dirTree[] = [];
		e.forEach(element => {
			if (element.type == "folder" || element.type == "dir") {
				var tmp: dirTree = {
					name: element.name,
					lastChange: element.lastModified,
					path: path
				};
				if (element.content?.length > 0) {
					var tmpPath: string[] = path;
					tmpPath.push(element.name);
					tmp.children = this.recFillInDirTree(element.content, tmpPath);
				}
				ret.push(tmp);
			}
		});

		return ret;
	}

	ngOnInit(): void {
	}

	onClickFolder(name: string) {
		var tempDir: dirTree[];
		this.path.push(name);
		this.path.forEach(e => {
			if (e == "root") {
				tempDir = this.dataSource;
			} else {
				var wasFounded: boolean = false;
				this.dataSource.forEach(element => {
					if (element.name == e) {
						tempDir = element.children;
						wasFounded = true;
					}
				});
				if (!wasFounded) {
					tempDir = [{
						name: "Noch keine Dateien",
						lastChange: "",
						path: []
					}]
				}
			}
		});
		this.aktDir = tempDir;
		this.refresh = [Math.random().toString()];
	}

	onClickBack() {
		if (this.path.length <= 1) return;
		var tempDir: dirTree[];
		this.path.pop();
		this.path.forEach(e => {
			if (e == "root") {
				tempDir = this.dataSource;
			} else {
				this.dataSource.forEach(element => {
					if (element.name == e) {
						tempDir = element.children;
					}
				});
			}
		});
		this.aktDir = tempDir;
		this.refresh = [Math.random().toString()];
	}

}
