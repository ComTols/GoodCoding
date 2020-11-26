import { Component, OnInit } from '@angular/core';

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

	constructor() {
		this.aktDir = this.dataSource;
		this.path.length
	}

	ngOnInit(): void {
	}

	onClickFolder(name: string) {
		console.log(name);

		var tempDir: dirTree[];
		this.path.push(name);
		console.log(this.path);

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
		console.log(this.path);

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
