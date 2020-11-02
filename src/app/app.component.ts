import { ClientService } from './client.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	isLogin: boolean = true;
	site: string = "";
	navItems: object[] = [
		{
			url: 'dashboard',
			name: 'Dashboard'
		}, {
			url: 'files',
			name: 'Dateien'
		}, {
			url: 'phpmyadmin',
			name: 'Datenbank'
		}, {
			url: 'all',
			name: 'Weitere Seiten'
		}, {
			url: 'logout',
			name: 'Log Out'
		}
	];
	myStyle: object = {
		'width': '100%',
		'height': '100%',
		'z-index': -1,
		'top': 0,
		'left': 0,
		'right': 0,
		'bottom': 0,
		'position': 'absolute'
	};
	myParams: object = {
		particles: {
			number: {
				value: 100,
			},
			color: {
				value: '#ffbf00'
			},
			shape: {
				type: 'circle',
			},
			size: {
				value: 5
			},
			move: {
				speed: 6
			}
		}
	};
	width: number = 100;
	height: number = 100;

	constructor(
		router: Router,
		service: ClientService
	) {
		router.events.subscribe((url: any) => {
			console.log(url);
			if (url.url == undefined) {
				return;
			}

			if (url.url != "/") {
				this.isLogin = false;
				console.log(url.url);

				switch (url.url) {
					case "/dashboard": {
						this.site = "Dashboard";
						break;
					}
					case "/files": {
						this.site = "Dateien";
						break;
					}
					case "/all": {
						this.site = "Weitere Seiten";
						break;
					}
					case "/settings": {
						this.site = "Einstellungen";
						break;
					}
					case "/contact": {
						this.site = "Kontakt";
						break;
					}
					case "/faq": {
						this.site = "Fragen und Antworten";
						break;
					}
					case "/privacy": {
						this.site = "Datenschutzerklärung";
						break;
					}
					case "/imprint": {
						this.site = "Impressum";
						break;
					}
					case "/admin/dashboard": {
						this.site = "Administratorbereich: Dashboard";
						break;
					}
					default: {
						this.site = "";
					}
				}
			} else {
				this.isLogin = true;
				this.site = "Login";
			}
		});
		console.log(router.url);
	}

	@HostListener('window:scroll', ['$event'])
	onWindowScroll(e) {
		if (this.isLogin == true) return;
		let element = document.querySelector('.navbar');
		if (window.pageYOffset > element.clientHeight) {
			element.classList.remove('navbar-top');
		} else {
			element.classList.add('navbar-top');
		}
	}
}
