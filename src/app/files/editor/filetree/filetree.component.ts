import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { dirStructur } from '../../files.component';
import { FileNode } from '../editor.component';

@Component({
	selector: 'app-filetree',
	templateUrl: './filetree.component.html',
	styleUrls: ['./filetree.component.css']
})
export class FiletreeComponent implements OnInit {

	@Input() source: FileNode[];
	@Output() cklickFile = new EventEmitter();

	constructor() { }

	ngOnInit(): void {
	}

	onClickFile(path: string, name: string) {
		console.log(path + "/" + name);
		this.cklickFile.emit(path + "/" + name);
	}

	onClickFileChildInstance(path: string) {
		this.cklickFile.emit(path);
	}

}
