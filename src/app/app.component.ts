import { ClientService } from './client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	isLogin: boolean = true;
	isAdmin = false;
	isWait = false;
	site: { url: string, name: string, admin: boolean };
	navItems: { url: string, name: string, admin: boolean }[] = [
		/*{
			url: 'wait',
			name: 'Warten auf Freischaltung',
			admin: false
		}, */{
			url: 'dashboard',
			name: 'Dashboard',
			admin: false
		}, {
			url: 'files',
			name: 'Dateien',
			admin: false
		}, {
			url: 'phpmyadmin',
			name: 'Datenbank',
			admin: false
		}, {
			url: 'all',
			name: 'Weitere Seiten',
			admin: false
		}, {
			url: 'logout',
			name: 'Log Out',
			admin: false
		}, {
			url: 'admin/dashboard',
			name: 'Dashboard',
			admin: true
		}, {
			url: 'admin/sverw',
			name: 'Schülerverwaltung',
			admin: true
		}, {
			url: 'admin/workload',
			name: 'Auslastung',
			admin: true
		}, {
			url: 'admin/all',
			name: 'Alle Seiten',
			admin: true
		}, {
			url: 'privacy',
			name: 'Datenschutz',
			admin: false
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
		public router: Router,
		public route: ActivatedRoute,
		service: ClientService
	) {
		router.events.subscribe((url: any) => {
			console.log(url);
			if (url.url == undefined) {
				return;
			}

			if (url.url == "/wait") {
				this.isLogin = false;
				this.isAdmin = false;
				this.isWait = true;
				this.site = {
					url: 'wait',
					name: 'Warten auf Freischaltung',
					admin: false
				};
			} else if (url.url != "/") {
				this.isLogin = false;
				this.isAdmin = false;
				this.isWait = false;
				console.log(url.url);

				for (var i = 0; i < this.navItems.length; i++) {
					if (url.url == ("/" + this.navItems[i].url)) {
						this.site = this.navItems[i];
					}
				}
			} else {
				this.isLogin = true;
				this.site = { name: "Login", url: "login", admin: false };
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

	onClickNavItem(url: String) {
		this.router.navigate([url], { relativeTo: this.route });
	}
}
