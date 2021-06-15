import { ClientService } from './client.service';
import { ActivatedRoute, NavigationEnd, Router, Event } from '@angular/router';
import { Component } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	isLogin: boolean = true;
	isEditor: boolean = false;
	isAdmin = false;
	isWait = false;
	site: { url: string, name: string, admin: boolean, both?: boolean, };
	navItems: { url: string, name: string, admin: boolean, both: boolean, showInNavBar: boolean }[] = [
		{
			url: 'wait',
			name: 'Warten auf Freischaltung',
			admin: false,
			both: false,
			showInNavBar: false
		}, {
			url: 'dashboard',
			name: 'Dashboard',
			admin: false,
			both: false,
			showInNavBar: true
		}, {
			url: 'files',
			name: 'Dateien',
			admin: false,
			both: false,
			showInNavBar: true
		}, {
			url: 'phpmyadmin',
			name: 'Datenbank',
			admin: false,
			both: true,
			showInNavBar: true
		}, {
			url: 'all',
			name: 'Weitere Seiten',
			admin: false,
			both: false,
			showInNavBar: true
		}, {
			url: 'logout',
			name: 'Log Out',
			admin: false,
			both: false,
			showInNavBar: true
		}, {
			url: 'admin/dashboard',
			name: 'Dashboard',
			admin: true,
			both: false,
			showInNavBar: true
		}, {
			url: 'admin/sverw',
			name: 'Schülerverwaltung',
			admin: true,
			both: false,
			showInNavBar: true
		}, {
			url: 'admin/files',
			name: 'Dateien',
			admin: true,
			both: false,
			showInNavBar: true
		}, {
			url: 'phpmyadmin',
			name: 'Datenbank',
			admin: true,
			both: false,
			showInNavBar: true
		}, {
			url: 'admin/workload',
			name: 'Auslastung',
			admin: true,
			both: false,
			showInNavBar: true
		}, {
			url: 'admin/all',
			name: 'Alle Seiten',
			admin: true,
			both: false,
			showInNavBar: true
		}, {
			url: 'privacy',
			name: 'Datenschutz',
			admin: false,
			both: true,
			showInNavBar: false
		}, {
			url: 'editor',
			name: 'Editor',
			admin: false,
			both: true,
			showInNavBar: false
		}, {
			url: "imprint",
			name: "Impressum",
			admin: false,
			both: true,
			showInNavBar: false
		}, {
			url: "contact",
			name: "Kontakt",
			admin: false,
			both: true,
			showInNavBar: false
		}, {
			url: "settings",
			name: "Einstellungen",
			admin: false,
			both: true,
			showInNavBar: false
		}, {
			url: "faq",
			name: "FAQ",
			admin: false,
			both: true,
			showInNavBar: false
		}, {
			url: 'logout',
			name: 'Log Out',
			admin: true,
			both: true,
			showInNavBar: true
		}, {
			url: '404',
			name: 'Seite nicht gefunden',
			admin: false,
			both: true,
			showInNavBar: false
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
		public service: ClientService
	) {
		this.router.events.subscribe((event: Event) => {
			if (event instanceof NavigationEnd) {
				if (event.url == undefined) {
					return;
				}
				if (event.url == "/wait") {
					this.isLogin = false;
					this.isAdmin = false;
					this.isWait = true;
					this.site = {
						url: 'wait',
						name: 'Warten auf Freischaltung',
						admin: false
					};
				} else if (event.url == "/logout") {
					this.isLogin = false;
					this.isAdmin = false;
					this.isWait = true;
					this.site = this.navItems[5];
				} else if (event.url.includes("/editor")) {
					this.isLogin = false;
					this.isAdmin = false;
					this.isWait = false;
					this.isEditor = true;
					this.site = {
						url: "editor",
						name: "Editor",
						admin: false
					}
				} else if (event.url == "/404") {
					console.debug("URL: 404");

					this.isLogin = false;
					this.isAdmin = false;
					this.isWait = true;
					this.site = this.navItems[16];
				} else if (event.url != "/") {
					this.isLogin = false;
					this.isAdmin = false;
					this.isWait = false;
					for (var i = 0; i < this.navItems.length; i++) {
						if (event.url == ("/" + this.navItems[i].url)) {
							this.site = this.navItems[i];
						}
					}
				} else if (event.url == "/") {
					this.isLogin = true;
					this.site = { name: "Login", url: "login", admin: false };
				} else {
					this.isLogin = false;
					this.isAdmin = false;
					this.isWait = true;
					this.site = this.navItems[16];
				}

				if (!this.isLogin && !this.isWait) {
					this.checkStatusAndRedirekt(event.url);
				}
			}
		});
	}

	@HostListener('window:scroll', ['$event'])
	onWindowScroll(e) {
		if (this.isEditor == true) return;
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

	checkStatusAndRedirekt(url: string) {
		this.service.sendDataToServerApi('userLogin').subscribe(
			res => {
				console.debug(res);
				if (res["acces"] == "denied") {
					this.service.openSnackBar("Bitte überprüfen Sie Ihre Eingabe! Die Kombination aus Benutzername und Passwort existiert nicht.", "Okay");
					this.router.navigate([""]);
				} else if (res["acces"] == "permitted") {
					if (url.includes("admin") || this.site.admin) {
						this.router.navigate([url.replace("/admin", "")]);
					}
				} else if (res["acces"] == "admin") {
					if (!url.includes("admin") && !this.site.admin && !this.site.both) {
						this.router.navigate(["/admin" + url]);
					}
				}
			},
			err => {
				console.error(err);
				var message: string = err.error.text;
				message.replace("\\", '');
				this.service.openSnackBar("Der Server antwortet nicht. Bitte wenden Sie sich an einen Administrator!", "Okay");
				this.router.navigate([""]);
			}
		);
	}
}
