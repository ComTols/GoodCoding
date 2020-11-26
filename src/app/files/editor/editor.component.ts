import { Component, OnInit, ViewChild } from '@angular/core';
import 'brace';
import 'brace/ext/language_tools'
import 'brace/mode/text';
import 'brace/mode/html';
import 'brace/mode/css';
import 'brace/mode/javascript';
import 'brace/mode/php';
import 'brace/theme/twilight';
import 'brace/theme/github';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';

export class FileNode {
	children: FileNode[];
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
	}];

	dataSource: MatTreeNestedDataSource<FileNode>;
	dataChange: BehaviorSubject<FileNode[]> = new BehaviorSubject<FileNode[]>([]);
	treeControl: NestedTreeControl<FileNode>;

	constructor() {
		this.treeControl = new NestedTreeControl<FileNode>(this._getChildren);
		this.dataSource = new MatTreeNestedDataSource();

		this.dataChange.subscribe(data => this.dataSource.data = data);

		this.dataChange.next([
			{
				filename: "folder",
				type: "dir",
				path: "root",
				children: [
					{
						filename: "test3",
						type: "dir",
						path: "root/folder",
						children: [
							{
								filename: "child",
								type: "exe",
								path: "root/folder/test3",
								children: []
							}
						],
					}
				],
			},
			{
				filename: "test2",
				type: "exe",
				path: "root",
				children: [],
			},
		]);
	}

	private _getChildren = (node: FileNode) => { return observableOf(node.children); };

	hasNestedChild = (_: number, nodeData: FileNode) => {
		if (nodeData.type == "dir") {
			return true;
		} else {
			return false;
		}
	};

	ngOnInit(): void {
	}

	onChange(event) {

	}

	onChangeLanguage(event) {
		this.mode = event.value;
	}

	onChangeDarkMode(event) {
		if (event.checked) {
			this.mode = "twilight";
		} else if (!event.checked) {
			this.mode = "github";
		}

	}

	onClickFile(node: FileNode) {
		console.log(node.path + "/" + node.filename + "." + node.type);

	}
}
