import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-move-dialog',
	templateUrl: './move-dialog.component.html',
	styleUrls: ['./move-dialog.component.css']
})
export class MoveDialogComponent implements OnInit {

	dataSource: { name: string, lastChange: string }[] = [{ name: "Test", lastChange: 'gestern' }];
	displayedColumns: string[] = ['type', 'name', 'lastChange'];
	constructor() { }

	ngOnInit(): void {
	}

}
