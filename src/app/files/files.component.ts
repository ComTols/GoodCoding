import { Component, OnInit } from '@angular/core';
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
		private service: ClientService
	) {
		service.sendDataToServerApi({ action: 'getFiles', pass: '', user: '' }, this);
	}

	ngOnInit(): void {
	}

	public serverFinish(data) {
		console.log("Der Server antwortete:");
		console.log(data);
		//TODO: Fill table
	}

	public onClickDel(target) {
		console.log(target);

	}

	public onClickRename(target) {
		console.log(target);

	}
	public onClickMove(target) {
		console.log(target);

	}
	public onClickDetails(target) {
		console.log(target);

	}


}
