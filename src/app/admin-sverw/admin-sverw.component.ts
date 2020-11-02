import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-admin-sverw',
	templateUrl: './admin-sverw.component.html',
	styleUrls: ['./admin-sverw.component.css']
})
export class AdminSverwComponent implements OnInit {

	data: { class: string, member: { username: string, forename: string, lastname: string, lastLogin: string, noDatabase: number, selected: boolean }[] }[] = [{
		class: "teacher",
		member: [{
			username: "tesla",
			forename: "Nikola",
			lastname: "Tesla",
			lastLogin: "02.11.2020 - 17:59",
			noDatabase: 1,
			selected: false
		}]
	}, {
		class: "12c",
		member: [{
			username: "schuelma",
			forename: "Maximilian",
			lastname: "Schüller",
			lastLogin: "09.07.2020 - 21:00",
			noDatabase: 1,
			selected: false
		}]
	}];

	constructor() { }

	ngOnInit(): void {
	}

	onAllClick(event, klasse) {
		console.log(event);
		console.log(klasse);
		this.data.forEach(element => {
			if (element.class == klasse) {
				element.member.forEach(mem => {
					mem.selected = true;
				});
			}
		});
	}

	changeSingelCheckbox(event, row) {
		console.log(event);
		console.log(row);


	}

}
