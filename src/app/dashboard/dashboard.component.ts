import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ClientService } from './../client.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	constructor(
		private router: Router,
		private client: HttpClient,
		private service: ClientService
	) { }

	async ngOnInit() {
		this.service.validLoginData(this);
	}

	public serverFinish(answer) {
		console.log(answer);

		if (answer != null) {
			console.log("Login Data Valid!");
		} else {
			console.log("Login Data Invalid!");
		}
	}

}