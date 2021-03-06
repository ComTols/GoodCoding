import { ClientService } from './../client.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	hide = true;
	isPasswordValid = true;
	isUsernameValid = true;
	isCoursValid = true;
	loginFaild = false;
	awaitingServerResponse: boolean = false;
	loginUserData = {};

	loginForm = new FormGroup({
		username: new FormControl(null, [Validators.required, Validators.minLength(3)]),
		password: new FormControl(null, Validators.required),
		cours: new FormControl(null, Validators.required),
		autoLogin: new FormControl()
	});

	options: string[] = new Array;

	constructor(
		private router: Router,
		private service: ClientService,
	) {
		for (let i = 5; i <= 13; i++) {
			for (let index = 0; index < 6; index++) {
				switch (index) {
					case 0:
						this.options.push(i + "a");
						break;
					case 1:
						this.options.push(i + "b");
						break;
					case 2:
						this.options.push(i + "c");
						break;
					case 3:
						this.options.push(i + "d");
						break;
					case 4:
						this.options.push(i + "e");
						break;
					case 5:
						this.options.push(i + "ext");
				}
			}
		}
		this.options.push("teachers");
	}

	sendLogin() {
		if (this.loginForm.status != "VALID") {
			if (this.loginForm.controls["username"].status != "VALID") {
				this.isUsernameValid = false;
			} else {
				this.isUsernameValid = true;
			}
			if (this.loginForm.controls["password"].status != "VALID") {
				this.isPasswordValid = false;
			} else {
				this.isPasswordValid = true;
			}
			this.service.openSnackBar("Bitte überprüfen Sie Ihre Eingabe! Ein Feld ist nicht korrekt ausgefüllt!", "Okay");
			return;
		}

		localStorage.setItem("username", this.loginForm.value['username']);
		localStorage.setItem("password", this.loginForm.value['password']);
		localStorage.setItem("cours", this.loginForm.value['cours']);
		this.awaitingServerResponse = true;
		this.service.sendDataToServerApi('userLogin').subscribe(
			(res: { acces: string }) => {
				console.debug(res);

				this.awaitingServerResponse = false;
				if (res["acces"] == "denied") {
					this.service.openSnackBar("Bitte überprüfen Sie Ihre Eingabe! Die Kombination aus Benutzername und Passwort existiert nicht.", "Okay");
					this.loginForm.controls["password"].reset();
					this.isPasswordValid = true;
					this.isUsernameValid = true;
					this.loginFaild = true;
				} else if (res["acces"] == "permitted") {
					console.debug("Zugang gewährt");
					this.loginFaild = false;
					this.router.navigate(["/dashboard"]);
				} else if (res["acces"] == "admin") {
					console.debug("Zugang akzeptiert! Adminrechte zugewiesen.");
					this.loginFaild = false;
					this.router.navigate(["/admin/dashboard"]);
				} else if (res["acces"] == "wait") {
					console.debug("Freischaltung erforderlich!");
					this.loginFaild = false;
					this.router.navigate(["/wait"]);
				}
			},
			err => {
				this.awaitingServerResponse = true;
				console.error(err);
				this.service.openSnackBar("Der Server antwortet nicht. Bitte wenden Sie sich an einen Administrator!", "Okay");
			}
		);
	}

	ngOnInit() {

	}



}
